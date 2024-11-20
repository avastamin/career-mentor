import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '../AnimatedButton';
import { useTheme } from '../../contexts/ThemeContext';

export const CareerAnalysisPrompt = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-4 py-8"
      >
        <div className={`w-20 h-20 ${
          theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'
        } rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Brain className={`w-10 h-10 ${
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Complete Your Career Analysis
        </h2>
        <p className={`mb-8 text-lg leading-relaxed ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Get personalized insights, progress tracking, and career recommendations by completing your career analysis.
        </p>
        <AnimatedButton
          variant="primary"
          onClick={() => navigate('/dashboard/career-analysis')}
          className="inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          Start Career Analysis
          <ArrowRight className="w-6 h-6" />
        </AnimatedButton>
      </motion.div>
    </div>
  );
};