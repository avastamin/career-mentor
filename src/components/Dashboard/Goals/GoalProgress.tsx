import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, TrendingUp } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { useAnimations } from '../../../hooks/useAnimations';

export const GoalProgress = () => {
  const { progressBarVariants } = useAnimations();
  
  // Get goals from localStorage and calculate stats
  const goals = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('careerGoals') || '[]');
    } catch (error) {
      console.error('Error parsing goals:', error);
      return [];
    }
  }, []); // Empty dependency array since we want to calculate only on mount

  // Calculate actual progress stats
  const stats = React.useMemo(() => {
    const initialStats = {
      shortTerm: { completed: 0, total: 0, progress: 0 },
      midTerm: { completed: 0, total: 0, progress: 0 },
      longTerm: { completed: 0, total: 0, progress: 0 }
    };

    return goals.reduce((acc, goal) => {
      const type = goal.type === 'short-term' ? 'shortTerm' :
                   goal.type === 'mid-term' ? 'midTerm' : 'longTerm';
      
      acc[type].total++;
      // Consider a goal completed if progress is 100% or status is 'completed'
      if (goal.progress === 100 || goal.status === 'completed') {
        acc[type].completed++;
      }
      
      // Update progress percentage
      acc[type].progress = acc[type].total > 0 
        ? Math.round((acc[type].completed / acc[type].total) * 100)
        : 0;

      return acc;
    }, initialStats);
  }, [goals]);

  // Re-render when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'careerGoals') {
        // Force re-render
        forceUpdate({});
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress Overview</h2>
        
        <div className="space-y-6">
          {[
            { label: 'Short-term Goals', stats: stats.shortTerm, icon: Target },
            { label: 'Mid-term Goals', stats: stats.midTerm, icon: Award },
            { label: 'Long-term Goals', stats: stats.longTerm, icon: TrendingUp }
          ].map((goal, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <goal.icon className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">{goal.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {goal.stats.completed} of {goal.stats.total} completed
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  variants={progressBarVariants}
                  initial="initial"
                  animate={{ width: `${goal.stats.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};