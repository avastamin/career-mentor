import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ArrowRight, ExternalLink, Building, Award, Sparkles, Info } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { getRecommendedCourses, enrichCourseWithPartnerInfo } from '../../../lib/coursera';
import type { LearningResource } from '../../../lib/types';

export const LearningPathsList = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(() => {
    const cached = sessionStorage.getItem('learningResources');
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    if (!userProfile?.skills || !userProfile?.desiredRole || learningResources.length > 0) {
      return;
    }

    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        // Clean and validate inputs
        const validSkills = userProfile.skills
          .filter(skill => typeof skill === 'string' && skill.trim())
          .map(skill => skill.trim());
        const cleanRole = userProfile.desiredRole.trim();

        if (!validSkills.length || !cleanRole) {
          setError('Invalid profile data: missing skills or desired role');
          return;
        }

        const courseRecommendations = await getRecommendedCourses(
          validSkills,
          cleanRole,
          analysisResults // Pass the analysis results for better search terms
        );

        if (!courseRecommendations.length) {
          setError('No relevant courses found for your profile');
          return;
        }

        const enrichedCourses = await Promise.all(
          courseRecommendations.map(course => enrichCourseWithPartnerInfo(course))
        );

        const resources: LearningResource[] = enrichedCourses
          .filter(Boolean)
          .map(course => ({
            id: course.id || Math.random().toString(),
            title: course.name || 'Untitled Course',
            type: 'course',
            url: course.slug ? `https://www.coursera.org/learn/${course.slug}` : '#',
            priority: (course.relevanceScore || 0) >= 0.7 ? 'high' : 'medium',
            duration: course.workload || 'Self-paced',
            skills: course.domainTypes?.filter(Boolean) || [],
            certification: Boolean(course.certificates?.length),
            provider: 'Coursera',
            partnerInfo: course.partnerInfo?.filter(Boolean),
            description: course.description || 'No description available',
            photoUrl: course.photoUrl || 'https://via.placeholder.com/150'
          }));

        if (!resources.length) {
          setError('No courses could be processed');
          return;
        }

        setLearningResources(resources);
        sessionStorage.setItem('learningResources', JSON.stringify(resources));
      } catch (error) {
        console.error('Error loading courses:', error);
        setError(error instanceof Error ? error.message : 'Failed to load course recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [userProfile, analysisResults]);

  if (!analysisResults || !userProfile) {
    return (
      <AnimatedCard>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Paths Yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Complete your career analysis to get personalized learning recommendations.
            </p>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  if (loading) {
    return (
      <AnimatedCard>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </motion.div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Courses</h3>
            <p className="text-gray-600">Finding the best learning resources for you...</p>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  if (error) {
    return (
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Info className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">Error Loading Courses</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recommended Learning Paths</h2>
          <AnimatedButton
            variant="secondary"
            className="text-sm flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {learningResources.map((course, index) => (
            <motion.a
              key={course.id}
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                {course.photoUrl && (
                  <img 
                    src={course.photoUrl} 
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                      {course.provider && (
                        <div className="flex items-center gap-2 mb-2">
                          {course.partnerInfo?.[0]?.name && (
                            <span className="text-sm text-gray-600">
                              by {course.partnerInfo[0].name}
                            </span>
                          )}
                          {course.certification && (
                            <span className="flex items-center gap-1 text-sm text-indigo-600">
                              <Award className="w-3 h-3" />
                              Certificate
                            </span>
                          )}
                        </div>
                      )}
                      {course.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : course.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {course.priority}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.skills?.slice(0, 3).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};