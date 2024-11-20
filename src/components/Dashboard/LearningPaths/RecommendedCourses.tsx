import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';

export const RecommendedCourses = () => {
  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recommended Courses</h2>
        
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 text-sm">
            Course recommendations will appear here after generating your learning paths.
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};