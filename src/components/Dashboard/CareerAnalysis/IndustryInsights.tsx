import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  TrendingUp, 
  Building, 
  Globe,
  DollarSign,
  Users,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';

interface IndustryInsightsProps {
  currentRole: string;
  desiredRole: string;
  industryPreference: string;
}

export const IndustryInsights: React.FC<IndustryInsightsProps> = ({
  currentRole,
  desiredRole,
  industryPreference
}) => {
  // Generate insights based on the user's profile
  const generateInsights = () => {
    const insights = [];
    
    // Primary industry insight based on preference
    insights.push({
      industry: industryPreference || "Technology",
      growth: "+15%",
      demand: "High",
      salaryTrend: "+8%",
      topSkills: [
        "Cloud Architecture",
        "AI/ML",
        "System Design"
      ],
      companies: 1250
    });

    // Secondary industry based on desired role
    const secondaryIndustry = desiredRole.toLowerCase().includes('tech') ? 'FinTech' : 'Tech';
    insights.push({
      industry: secondaryIndustry,
      growth: "+12%",
      demand: "Very High",
      salaryTrend: "+10%",
      topSkills: [
        "API Development",
        "Security",
        "Cloud Computing"
      ],
      companies: 850
    });

    return insights;
  };

  // Generate market trends based on roles
  const generateMarketTrends = () => {
    const trends = [
      {
        trend: "Remote Work Opportunities",
        growth: "+25%",
        impact: "High"
      }
    ];

    // Add role-specific trends
    if (desiredRole.toLowerCase().includes('senior') || desiredRole.toLowerCase().includes('lead')) {
      trends.push({
        trend: "Leadership Roles",
        growth: "+20%",
        impact: "Very High"
      });
    }

    if (currentRole.toLowerCase().includes('developer') || desiredRole.toLowerCase().includes('developer')) {
      trends.push({
        trend: "Full-Stack Development",
        growth: "+30%",
        impact: "High"
      });
    }

    return trends;
  };

  const insights = generateInsights();
  const marketTrends = generateMarketTrends();

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LineChart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Industry Insights</h2>
          </div>
          <AnimatedButton
            variant="secondary"
            className="text-sm flex items-center gap-2"
          >
            Full Report
            <ArrowRight className="w-4 h-4" />
          </AnimatedButton>
        </div>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900">{insight.industry}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {insight.companies.toLocaleString()} companies hiring
                    </span>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-1 text-green-600 text-sm font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  {insight.growth} YoY
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Demand</p>
                    <p className="font-medium text-sm">{insight.demand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Salary Trend</p>
                    <p className="font-medium text-sm text-green-600">{insight.salaryTrend}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Top Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {insight.topSkills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: skillIndex * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Market Trends</h3>
            <div className="space-y-3">
              {marketTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trend.trend}</p>
                      <p className="text-sm text-gray-600">Impact: {trend.impact}</p>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium">{trend.growth}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};