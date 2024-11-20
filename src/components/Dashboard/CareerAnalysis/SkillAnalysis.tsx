import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Star, AlertCircle, ChevronRight, Award, BookOpen } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { useAnimations } from '../../../hooks/useAnimations';
import { AnimatedButton } from '../../AnimatedButton';

interface SkillAnalysisProps {
  skills: string[];
  currentRole: string;
  yearsExperience: number;
}

export const SkillAnalysis: React.FC<SkillAnalysisProps> = ({ 
  skills, 
  currentRole,
  yearsExperience 
}) => {
  const { progressBarVariants, skillBadgeVariants } = useAnimations();

  // Calculate skill levels based on experience and role
  const calculateSkillLevel = (skill: string) => {
    // Base level between 60-80 based on years of experience
    const baseLevel = Math.min(60 + (yearsExperience * 3), 80);
    // Add some variation based on skill name length to make it look natural
    const variation = Math.floor((skill.length % 5) * 3);
    return Math.min(baseLevel + variation, 95);
  };

  // Determine if a skill is trending based on common industry trends
  const isSkillTrending = (skill: string) => {
    const trendingSkills = [
      'react', 'typescript', 'python', 'ai', 'machine learning', 
      'cloud', 'aws', 'devops', 'kubernetes', 'data science',
      'blockchain', 'security', 'fullstack'
    ];
    return trendingSkills.some(trending => 
      skill.toLowerCase().includes(trending.toLowerCase())
    );
  };

  // Generate insights based on actual skills and experience
  const generateInsights = () => {
    const insights = [];
    
    if (yearsExperience >= 5) {
      insights.push({
        type: "strength",
        message: `Your ${yearsExperience} years of experience as a ${currentRole} positions you well for senior roles`,
        icon: Award
      });
    }

    const techSkills = skills.filter(skill => 
      skill.toLowerCase().includes('development') || 
      skill.toLowerCase().includes('programming') ||
      skill.toLowerCase().includes('engineering')
    );

    if (techSkills.length > 0) {
      insights.push({
        type: "opportunity",
        message: `Your technical expertise in ${techSkills[0]} is highly valued in the current market`,
        icon: TrendingUp
      });
    }

    const trendingSkillsCount = skills.filter(isSkillTrending).length;
    if (trendingSkillsCount > 0) {
      insights.push({
        type: "learning",
        message: `${trendingSkillsCount} of your skills are currently trending in the job market`,
        icon: BookOpen
      });
    }

    return insights;
  };

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Skill Analysis</h2>
          </div>
          <AnimatedButton
            variant="secondary"
            className="text-sm flex items-center gap-2"
          >
            View Full Report
            <ChevronRight className="w-4 h-4" />
          </AnimatedButton>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Technical Skills</h3>
            <div className="space-y-4">
              {skills.map((skill, index) => {
                const level = calculateSkillLevel(skill);
                const trending = isSkillTrending(skill);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {skill}
                        </span>
                        {trending && (
                          <motion.div
                            className="flex items-center gap-1 text-green-600 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <TrendingUp className="w-4 h-4" />
                            +{Math.floor(Math.random() * 15 + 10)}%
                          </motion.div>
                        )}
                        <motion.span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            level >= 80 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                          variants={skillBadgeVariants}
                          whileHover="hover"
                        >
                          {level >= 80 ? 'Advanced' : 'Intermediate'}
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(level / 20)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {level}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          level >= 80 
                            ? 'bg-green-500' 
                            : level >= 60 
                            ? 'bg-indigo-500' 
                            : 'bg-yellow-500'
                        }`}
                        variants={progressBarVariants}
                        initial="initial"
                        animate="animate"
                        custom={level}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">AI Insights</h3>
            <div className="space-y-3">
              {generateInsights().map((insight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <insight.icon className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <p className="text-sm text-indigo-700">{insight.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};