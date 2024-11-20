import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';

export const CurrentProgress = () => {
  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Progress</h2>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Start Learning</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Your learning progress and achievements will be tracked here once you begin your personalized learning path.
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};