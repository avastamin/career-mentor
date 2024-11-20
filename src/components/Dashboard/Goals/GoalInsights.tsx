import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Award, Loader, Info } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { generateGoalInsights, generateBasicInsights, type GoalInsight } from '../../../lib/ai/goals';

interface InsightWithIcon extends GoalInsight {
  icon: React.ElementType;
}

export const GoalInsights = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();
  const [insights, setInsights] = useState<InsightWithIcon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Get goals from localStorage
  const goals = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('careerGoals') || '[]');
    } catch (err) {
      console.error('Error parsing goals:', err);
      return [];
    }
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return Award;
      case 'action':
        return Target;
      case 'warning':
        return Sparkles;
      default:
        return TrendingUp;
    }
  };

  // Generate insights
  const generateInsights = async () => {
    if (!analysisResults || !userProfile || loading) return;

    try {
      setLoading(true);
      setError(null);

      let aiInsights: GoalInsight[];
      try {
        aiInsights = await generateGoalInsights(goals, userProfile, analysisResults);
      } catch (err) {
        console.error('Error generating AI insights:', err);
        aiInsights = generateBasicInsights(goals, analysisResults);
      }

      const insightsWithIcons: InsightWithIcon[] = aiInsights.map(insight => ({
        ...insight,
        icon: getInsightIcon(insight.type)
      }));

      setInsights(insightsWithIcons);
      setLastUpdate(new Date().toLocaleTimeString());

      // Store insights without icons to avoid serialization issues
      sessionStorage.setItem('goalInsights', JSON.stringify(aiInsights));
      sessionStorage.setItem('goalInsightsTimestamp', Date.now().toString());
    } catch (err) {
      console.error('Error in insights generation:', err);
      setError('Failed to generate insights');
      
      const basicInsights = generateBasicInsights(goals, analysisResults);
      const basicInsightsWithIcons = basicInsights.map(insight => ({
        ...insight,
        icon: getInsightIcon(insight.type)
      }));
      setInsights(basicInsightsWithIcons);
    } finally {
      setLoading(false);
    }
  };

  // Load insights on mount or when dependencies change
  useEffect(() => {
    const loadStoredInsights = () => {
      const storedInsights = sessionStorage.getItem('goalInsights');
      const storedTimestamp = sessionStorage.getItem('goalInsightsTimestamp');
      
      if (storedInsights && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp);
        const now = Date.now();
        if (now - timestamp < 5 * 60 * 1000) { // 5 minutes
          try {
            const parsedInsights = JSON.parse(storedInsights);
            const insightsWithIcons = parsedInsights.map((insight: GoalInsight) => ({
              ...insight,
              icon: getInsightIcon(insight.type)
            }));
            setInsights(insightsWithIcons);
            setLastUpdate(new Date(timestamp).toLocaleTimeString());
            return true;
          } catch (err) {
            console.error('Error parsing stored insights:', err);
          }
        }
      }
      return false;
    };

    // Only generate new insights if we couldn't load stored ones
    if (!loadStoredInsights() && analysisResults && userProfile) {
      generateInsights();
    }
  }, [analysisResults, userProfile]);

  // Listen for goal changes
  useEffect(() => {
    const handleStorageChange = () => {
      generateInsights();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getInsightStyles = (type: string): string => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "tip":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "action":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "warning":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  if (loading) {
    return (
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-indigo-600">
              <Loader className="w-6 h-6 animate-spin" />
              <span className="font-medium">Analyzing your goals...</span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  if (!goals.length) {
    return (
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
            <p className="text-gray-600">
              Add some goals to receive AI-powered insights and recommendations
            </p>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
            {lastUpdate && (
              <p className="text-sm text-gray-500">Last updated: {lastUpdate}</p>
            )}
          </div>
          <AnimatedButton
            variant="secondary"
            onClick={() => generateInsights()}
            className="text-sm flex items-center gap-2"
            disabled={loading}
          >
            <Sparkles className="w-4 h-4" />
            Refresh
          </AnimatedButton>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2 text-red-600">
              <Info className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Error generating insights</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {insights.map((insight, index) => {
            const InsightIcon = insight.icon;
            return (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${getInsightStyles(insight.type)}`}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <InsightIcon className="w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedCard>
  );
};