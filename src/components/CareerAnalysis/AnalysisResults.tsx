import React from 'react';
import { motion } from 'framer-motion';
import type { CareerAnalysis } from '../../lib/types';

interface AnalysisResultsProps {
  analysis: CareerAnalysis;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onReset }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Career Path Analysis</h3>
        <p className="text-gray-600 mb-6">{analysis.careerPath}</p>
        
        <h4 className="font-semibold mb-2">Skill Gaps to Address:</h4>
        <ul className="list-disc list-inside mb-6 space-y-2">
          {analysis.skillGaps.map((skill, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="text-gray-600"
            >
              {skill}
            </motion.li>
          ))}
        </ul>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(analysis.recommendations).map(([period, items], index) => (
            <motion.div
              key={period}
              variants={itemVariants}
              className="feature-card"
            >
              <h4 className="font-semibold mb-3 capitalize">{period} Actions</h4>
              <ul className="space-y-2">
                {items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    variants={itemVariants}
                    className="text-gray-600 text-sm"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Potential Roles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.potentialRoles.map((role, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="font-medium">{role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="feature-card">
        <h3 className="text-2xl font-bold mb-4">Learning Resources</h3>
        <div className="grid gap-4">
          {analysis.learningResources.map((resource, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${resource.priority === 'high' ? 'bg-red-100 text-red-700' : 
                    resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-green-100 text-green-700'}
                `}>
                  {resource.priority} priority
                </span>
                <motion.a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Access
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        onClick={onReset}
        className="btn-secondary w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start New Analysis
      </motion.button>
    </motion.div>
  );
};