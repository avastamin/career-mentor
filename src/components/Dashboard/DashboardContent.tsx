import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Building,
  Globe,
  DollarSign,
  Users,
  Clock,
  Lock,
  Crown,
  Gem,
  Sparkles,
  Star,
  Info,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useCareerAnalysis } from '../../contexts/CareerAnalysisContext';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedCard } from '../AnimatedCard';
import { AnimatedButton } from '../AnimatedButton';
import { useAnimations } from '../../hooks/useAnimations';
import { ProDashboardContent } from './ProFeatures/ProDashboardContent';
import { PricingPlansModal } from './PricingPlansModal';
import { CareerPathRecommendations } from './CareerAnalysis/CareerPathRecommendations';

interface DashboardContentProps {}

export const DashboardContent: React.FC<DashboardContentProps> = () => {
  const { analysisResults, userProfile, learningResources } = useCareerAnalysis();
  const { progressBarVariants } = useAnimations();
  const navigate = useNavigate();
  const { userProfile: authProfile } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isFreeUser = authProfile?.role === 'free';
  const isProUser = authProfile?.role === 'pro' || authProfile?.role === 'premium';
  const showLearningResources = !isFreeUser && (learningResources?.length > 0 || analysisResults?.learningResources?.length > 0);

  if (!analysisResults || !userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Complete your career analysis to view insights.</p>
        <AnimatedButton
          variant="primary"
          onClick={() => navigate('/dashboard/career-analysis')}
          className="mt-4"
        >
          Start Analysis
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Career Overview Section */}
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career Overview</h1>
              <p className="text-gray-600">Your personalized career insights and recommendations</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Current Role</h3>
              </div>
              <p className="text-gray-600">{userProfile.currentRole}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Target Role</h3>
              </div>
              <p className="text-gray-600">{userProfile.desiredRole}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Industry</h3>
              </div>
              <p className="text-gray-600">{userProfile.industryPreference}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Market Overview */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Market Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Salary Range</span>
                  </div>
                  <span className="font-medium">{analysisResults.marketOverview.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Market Demand</span>
                  </div>
                  <span className="font-medium text-green-600">{analysisResults.marketOverview.demandLevel}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Time to Achieve</span>
                  </div>
                  <span className="font-medium">{analysisResults.marketOverview.timeToAchieve}</span>
                </div>
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">Key Skills to Develop</h3>
              </div>
              <div className="space-y-2">
                {analysisResults.skillGaps.slice(0, 4).map((skillGap, index) => (
                  <motion.div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{skillGap.skill}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        skillGap.priority === 'High' 
                          ? 'bg-red-100 text-red-700'
                          : skillGap.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {skillGap.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Career Path Recommendations */}
      <CareerPathRecommendations 
        careerPath={analysisResults.careerPath}
        potentialRoles={analysisResults.potentialRoles}
        roleDetails={analysisResults.roleDetails}
        recommendations={analysisResults.recommendations}
        marketOverview={analysisResults.marketOverview}
        timeline={analysisResults.timeline}
        industryInsights={analysisResults.industryInsights}
      />

      {/* Pro Features */}
      {isProUser && analysisResults.proFeatures && (
        <ProDashboardContent analysis={analysisResults} />
      )}

      {/* Learning Resources */}
      <AnimatedCard>
        <div className="p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Learning Resources</h2>
            </div>
            <AnimatedButton
              variant="secondary"
              onClick={() => isFreeUser ? setShowPricingModal(true) : navigate('/dashboard/learning')}
              className="text-sm flex items-center gap-2"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </AnimatedButton>
          </div>

          {showLearningResources ? (
            <div className="grid gap-4">
              {(learningResources || analysisResults.learningResources)?.slice(0, 3).map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    {resource.photoUrl && (
                      <img 
                        src={resource.photoUrl} 
                        alt={resource.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                          {resource.provider && (
                            <div className="flex items-center gap-2 mb-2">
                              {resource.partnerInfo?.[0]?.name && (
                                <span className="text-sm text-gray-600">
                                  by {resource.partnerInfo[0].name}
                                </span>
                              )}
                            </div>
                          )}
                          {resource.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            resource.priority === 'high' 
                              ? 'bg-red-100 text-red-700'
                              : resource.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {resource.priority}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Premium Feature
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Upgrade to Pro or Premium to access personalized learning resources and course recommendations.
              </p>
              <AnimatedButton
                variant="primary"
                onClick={() => setShowPricingModal(true)}
                className="inline-flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade Now
              </AnimatedButton>
            </div>
          )}
        </div>
      </AnimatedCard>

      <PricingPlansModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
};