import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Brain,
  Loader,
  Info,
  Star,
  Crown,
  Gem,
  Activity,
} from 'lucide-react';
import {
  CareerProfileSchema,
  type CareerProfile,
  LearningResource,
} from '../../../lib/types';
import { analyzeCareer } from '../../../lib/ai';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  canCreateAnalysis,
  getRemainingAnalyses,
  saveCareerAnalysis,
} from '../../../lib/career-storage';
import {
  getRecommendedCourses,
  enrichCourseWithPartnerInfo,
} from '../../../lib/coursera.ts';
import { AnimatedCard } from '../../AnimatedCard';
import { LoadingOverlay } from '../../LoadingOverlay';
import { AnimatedButton } from '../../AnimatedButton';
import { PricingPlansModal } from '../PricingPlansModal';
import { useNavigate } from 'react-router-dom';

export const CareerAnalysisForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAnalyses, setRemainingAnalyses] = useState<number | null>(
    null
  );
  const [showPricingModal, setShowPricingModal] = useState(false);
  const {
    setAnalysisResults: setGlobalAnalysisResults,
    setUserProfile,
    setLearningResources,
  } = useCareerAnalysis();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerProfile>({
    resolver: zodResolver(CareerProfileSchema),
  });

  useEffect(() => {
    let mounted = true;

    const loadRemainingAnalyses = async () => {
      if (!user) {
        setRemainingAnalyses(null);
        return;
      }

      try {
        const remaining = await getRemainingAnalyses(user.id);
        if (mounted) {
          setRemainingAnalyses(remaining);
        }
      } catch (error) {
        console.error('Error loading remaining analyses:', error);
        if (mounted) {
          setRemainingAnalyses(0);
        }
      }
    };

    loadRemainingAnalyses();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Update the onSubmit function to handle course recommendations better
  const onSubmit = async (data: CareerProfile) => {
    if (!user) {
      setError('Please sign in to perform career analysis');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      // Check if user can create analysis
      const canCreate = await canCreateAnalysis(user.id);

      if (!canCreate) {
        setError(
          'You have reached your analysis limit. Please upgrade your plan to create more analyses.'
        );
        return;
      }

      // Transform string inputs to arrays
      const transformedData = {
        ...data,
        skills: data.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        interests: data.interests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      console.log('Starting analysis with data:', transformedData);

      // Perform AI analysis
      const result = await analyzeCareer(
        transformedData,
        userProfile?.role || 'free'
      );

      if (!result) {
        throw new Error('Failed to generate analysis results');
      }

      console.log('Analysis results:', result);

      // Get course recommendations with error handling
      let resources: LearningResource[] = [];
      if (userProfile?.role !== 'free') {
        try {
          const courseRecommendations = await getRecommendedCourses(
            transformedData.skills,
            transformedData.desiredRole,
            result // Pass analysis results for better recommendations
          );

          if (courseRecommendations?.length) {
            const enrichedCourses = await Promise.all(
              courseRecommendations.map(async (course) => {
                try {
                  return await enrichCourseWithPartnerInfo(course);
                } catch (err) {
                  console.error('Error enriching course:', err);
                  return course;
                }
              })
            );

            resources = enrichedCourses
              .filter(Boolean)
              .map((course) => ({
                id: course.id || Math.random().toString(),
                title: course.name || 'Career Development Course',
                type: 'course',
                url: course.slug
                  ? `https://www.coursera.org/learn/${course.slug}`
                  : '#',
                priority: (course.relevanceScore || 0) >= 0.7 ? 'high' : 'medium',
                duration: course.workload || 'Self-paced',
                skills: course.domainTypes || [],
                certification: Boolean(course.certificates?.length),
                provider: 'Coursera',
                partnerInfo: course.partnerInfo,
                description: course.description || 'No description available',
                photoUrl: course.photoUrl || 'https://via.placeholder.com/150',
              }));
          }
        } catch (err) {
          console.error('Error getting course recommendations:', err);
          // Don't throw error, continue with empty resources
        }
      }

      // Save analysis to database
      await saveCareerAnalysis(user.id, transformedData, result);

      // Update remaining analyses count
      const remaining = await getRemainingAnalyses(user.id);
      setRemainingAnalyses(remaining);

      // Update global state
      setGlobalAnalysisResults(result);
      setUserProfile(transformedData);
      setLearningResources(resources);

      // Store results in session storage
      sessionStorage.setItem('latestAnalysis', JSON.stringify(result));
      sessionStorage.setItem('latestProfile', JSON.stringify(transformedData));
      if (resources.length) {
        sessionStorage.setItem('learningResources', JSON.stringify(resources));
      }

      // Navigate to overview page
      navigate('/dashboard/overview', {
        replace: true,
        state: {
          analysisResults: result,
          userProfile: transformedData,
          learningResources: resources,
        },
      });

      console.log('Analysis completed and saved successfully');
    } catch (error) {
      console.error('Analysis error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to analyze career data'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFreeUser = userProfile?.role === 'free';
  const isProUser = userProfile?.role === 'pro';
  const isPremiumUser = userProfile?.role === 'premium';

  const getAnalysisLimitColor = () => {
    if (remainingAnalyses === null) return 'bg-gray-100';
    if (remainingAnalyses === 0) return 'bg-red-100 text-red-700';
    if (remainingAnalyses === 1) return 'bg-yellow-100 text-yellow-700';
    if (remainingAnalyses === -1) return 'bg-green-100 text-green-700';
    return 'bg-indigo-100 text-indigo-700';
  };

  const getAnalysisLimitText = () => {
    if (remainingAnalyses === null) return 'Loading...';
    if (remainingAnalyses === 0) return 'No analyses remaining';
    if (remainingAnalyses === -1) return 'Unlimited analyses';
    return `${remainingAnalyses} ${
      remainingAnalyses === 1 ? 'analysis' : 'analyses'
    } remaining`;
  };

  const renderFormHeader = () => {
    if (isPremiumUser) {
      return (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Gem className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Premium Career Analysis
            </h2>
            <p className="text-gray-600">
              Get comprehensive insights with our most advanced AI analysis
            </p>
          </div>
        </div>
      );
    }

    if (isProUser) {
      return (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Crown className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pro Career Analysis
            </h2>
            <p className="text-gray-600">
              Get detailed insights with advanced AI analysis
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Star className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Basic Career Analysis
          </h2>
          <p className="text-gray-600">Get started with a basic AI analysis</p>
        </div>
      </div>
    );
  };

  const renderAdditionalFields = () => {
    if (!isPremiumUser && !isProUser) return null;

    return (
      <>
        <div>
          <label
            htmlFor="careerGoals"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Career Goals
          </label>
          <textarea
            id="careerGoals"
            {...register('careerGoals')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe your short-term and long-term career goals..."
            rows={3}
            disabled={loading}
          />
          {errors.careerGoals && (
            <p id="careerGoals-error" className="text-red-500 text-sm mt-1">
              {errors.careerGoals.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="workEnvironment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred Work Environment
          </label>
          <input
            id="workEnvironment"
            {...register('workEnvironment')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Remote, Hybrid, Office"
            disabled={loading}
          />
          {errors.workEnvironment && (
            <p id="workEnvironment-error" className="text-red-500 text-sm mt-1">
              {errors.workEnvironment.message}
            </p>
          )}
        </div>

        {isPremiumUser && (
          <div>
            <label
              htmlFor="customFocus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Analysis Focus
            </label>
            <textarea
              id="customFocus"
              {...register('customFocus')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Specify any particular aspects you'd like the analysis to focus on..."
              rows={3}
              disabled={loading}
            />
            {errors.customFocus && (
              <p id="customFocus-error" className="text-red-500 text-sm mt-1">
                {errors.customFocus.message}
              </p>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <LoadingOverlay isVisible={loading} />

      <AnimatedCard>
        <div className="p-6">
          {renderFormHeader()}

          {/* Analysis Limit Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6"
          >
            <div className={`rounded-lg p-4 ${getAnalysisLimitColor()}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Analysis Credits</h3>
                    <p className="text-sm">{getAnalysisLimitText()}</p>
                  </div>
                </div>
                {(isFreeUser || isProUser) && (
                  <AnimatedButton
                    variant="secondary"
                    onClick={() => setShowPricingModal(true)}
                    className="text-sm bg-white/90 hover:bg-white"
                  >
                    {isFreeUser ? 'Upgrade Plan' : 'Get More Credits'}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </motion.div>

          {isFreeUser && (
            <motion.div
              className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-indigo-900 mb-1">
                    Free Plan - Basic Analysis
                  </h3>
                  <p className="text-sm text-indigo-700 mb-3">
                    You have access to one basic career analysis. Upgrade to Pro
                    or Premium for:
                  </p>
                  <ul className="text-sm text-indigo-700 space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      <span>
                        Pro: 10 detailed analyses with advanced insights
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Gem className="w-4 h-4" />
                      <span>Premium: Unlimited comprehensive analyses</span>
                    </li>
                  </ul>
                  <AnimatedButton
                    variant="secondary"
                    onClick={() => setShowPricingModal(true)}
                    className="text-sm bg-white"
                  >
                    Upgrade Plan
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form fields */}
            <div>
              <label
                htmlFor="currentRole"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Role
              </label>
              <input
                id="currentRole"
                {...register('currentRole')}
                aria-invalid={!!errors.currentRole}
                aria-describedby={
                  errors.currentRole ? 'currentRole-error' : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Software Developer"
                disabled={loading}
              />
              {errors.currentRole && (
                <p
                  id="currentRole-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.currentRole.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="yearsExperience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Years of Experience
              </label>
              <input
                id="yearsExperience"
                type="number"
                {...register('yearsExperience', { valueAsNumber: true })}
                aria-invalid={!!errors.yearsExperience}
                aria-describedby={
                  errors.yearsExperience ? 'yearsExperience-error' : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 5"
                disabled={loading}
              />
              {errors.yearsExperience && (
                <p
                  id="yearsExperience-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsExperience.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills (comma-separated)
              </label>
              <input
                id="skills"
                {...register('skills')}
                aria-invalid={!!errors.skills}
                aria-describedby={errors.skills ? 'skills-error' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., JavaScript, React, Node.js"
                disabled={loading}
              />
              {errors.skills && (
                <p id="skills-error" className="text-red-500 text-sm mt-1">
                  {errors.skills.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interests (comma-separated)
              </label>
              <input
                id="interests"
                {...register('interests')}
                aria-invalid={!!errors.interests}
                aria-describedby={
                  errors.interests ? 'interests-error' : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., AI, Cloud Computing, Mobile Development"
                disabled={loading}
              />
              {errors.interests && (
                <p id="interests-error" className="text-red-500 text-sm mt-1">
                  {errors.interests.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="desiredRole"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Desired Role
              </label>
              <input
                id="desiredRole"
                {...register('desiredRole')}
                aria-invalid={!!errors.desiredRole}
                aria-describedby={
                  errors.desiredRole ? 'desiredRole-error' : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Senior Software Engineer"
                disabled={loading}
              />
              {errors.desiredRole && (
                <p
                  id="desiredRole-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.desiredRole.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Education
              </label>
              <input
                id="education"
                {...register('education')}
                aria-invalid={!!errors.education}
                aria-describedby={
                  errors.education ? 'education-error' : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., BS in Computer Science"
                disabled={loading}
              />
              {errors.education && (
                <p id="education-error" className="text-red-500 text-sm mt-1">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="industryPreference"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry Preference
              </label>
              <input
                id="industryPreference"
                {...register('industryPreference')}
                aria-invalid={!!errors.industryPreference}
                aria-describedby={
                  errors.industryPreference
                    ? 'industryPreference-error'
                    : undefined
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Technology, Healthcare"
                disabled={loading}
              />
              {errors.industryPreference && (
                <p
                  id="industryPreference-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.industryPreference.message}
                </p>
              )}
            </div>

            {renderAdditionalFields()}

            <button
              type="submit"
              disabled={loading || remainingAnalyses === 0}
              className={`w-full btn-primary flex items-center justify-center gap-2 ${
                isPremiumUser
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                  : isProUser
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Start {isPremiumUser ? 'Premium' : isProUser ? 'Pro' : 'Basic'}{' '}
                  Analysis
                </>
              )}
            </button>
          </form>
        </div>
      </AnimatedCard>

      <PricingPlansModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
};
