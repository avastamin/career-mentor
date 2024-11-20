import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import type { CareerAnalysis } from '../../../lib/types';

interface AnalysisResultsProps {
  analysis: CareerAnalysis;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onReset }) => {
  if (!analysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <p className="text-gray-600">Here's what we found based on your profile</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Career Path */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Career Path</h3>
              <p className="text-gray-600 mb-6">{analysis.careerPath}</p>

              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(analysis.recommendations).map(([period, items]) => (
                  <div key={period} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3 capitalize">{period} Actions</h4>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Skill Gaps to Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.skillGaps.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <span className="text-gray-900">{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recommended Resources</h3>
              <div className="space-y-3">
                {analysis.learningResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : resource.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {resource.priority} priority
                      </span>
                      <AnimatedButton
                        variant="secondary"
                        className="text-sm py-1"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Access
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </AnimatedButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Industry Insights</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(analysis.industryInsights).map(([key, items]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-medium capitalize">{key}</h4>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedButton
        variant="secondary"
        onClick={onReset}
        className="w-full"
      >
        Start New Analysis
      </AnimatedButton>
    </motion.div>
  );
};