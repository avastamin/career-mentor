import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Building, 
  DollarSign, 
  Users, 
  Clock,
  ChevronRight,
  Briefcase,
  Target,
  LineChart,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';

interface CareerPathRecommendationsProps {
  careerPath: string;
  potentialRoles: string[];
  roleDetails?: Array<{
    title: string;
    description: string;
    requirements: string[];
    timeToAchieve: string;
    salary: string;
    growth: string;
    demand: string;
    trends: string[];
    opportunities: string[];
  }>;
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  marketOverview: any;
  timeline: any;
  industryInsights: any;
}

export const CareerPathRecommendations: React.FC<CareerPathRecommendationsProps> = ({
  careerPath,
  potentialRoles,
  roleDetails = [],
  recommendations,
  marketOverview,
  timeline,
  industryInsights
}) => {
  // Use roleDetails if available, otherwise generate from potentialRoles
  const processedRoles = roleDetails.length > 0 
    ? roleDetails.slice(0, 2).map((role, index) => ({
        ...role,
        matchScore: 95 - (index * 5), // 95, 90 for top recommendations
        marketMaturity: marketOverview.marketMaturity || 'Growing Market',
        futureOutlook: marketOverview.futureOutlook || 'Positive',
        competitionLevel: marketOverview.competitionLevel || 'Moderate'
      }))
    : potentialRoles.slice(0, 2).map((role, index) => ({
        title: role,
        description: "Career path description",
        requirements: recommendations.immediate.slice(0, 3),
        timeToAchieve: marketOverview.timeToAchieve || "1-2 years",
        salary: marketOverview.salaryRange || "$120K - $180K",
        growth: industryInsights.marketDynamics?.growthRate || "+15% YoY",
        demand: industryInsights.marketDynamics?.demandLevel || "High",
        trends: industryInsights.trends?.slice(0, 2) || [],
        opportunities: industryInsights.opportunities?.map(o => 
          typeof o === 'string' ? o : o.description
        ).slice(0, 2) || [],
        matchScore: 95 - (index * 5),
        marketMaturity: marketOverview.marketMaturity || 'Growing Market',
        futureOutlook: marketOverview.futureOutlook || 'Positive',
        competitionLevel: marketOverview.competitionLevel || 'Moderate'
      }));

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Career Path Recommendations</h2>
            <p className="text-gray-600">Top career paths based on your profile and market analysis</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Career Progression Path</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{careerPath}</p>
        </div>

        <div className="space-y-8">
          {processedRoles.map((path, index) => (
            <div 
              key={index}
              className="relative border border-gray-100 rounded-xl p-6 hover:border-indigo-100 transition-colors"
            >
              <motion.div
                className="absolute top-6 right-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{path.growth}</span>
                </div>
              </motion.div>

              <div className="flex items-start gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{path.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{path.description}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>{path.matchScore}% Match</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium text-gray-900">{path.salary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time to Achieve</p>
                    <p className="font-medium text-gray-900">{path.timeToAchieve}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Market Demand</p>
                    <p className="font-medium text-green-600">{path.demand}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Requirements</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {path.requirements.map((req, reqIndex) => (
                      <motion.div
                        key={reqIndex}
                        className="p-3 bg-gray-50 rounded-lg text-gray-600 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reqIndex * 0.1 }}
                      >
                        {req}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Industry Trends</h4>
                    <div className="space-y-3">
                      {path.trends.map((trend, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{trend}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Growth Opportunities</h4>
                    <div className="space-y-3">
                      {path.opportunities.map((opp, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Target className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{opp}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};