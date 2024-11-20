import React from 'react';
import { motion } from 'framer-motion';
import { SkillMatrix } from './SkillMatrix';
import { CareerStrategy } from './CareerStrategy';
import { MarketDynamics } from './MarketDynamics';
import type { CareerAnalysis } from '../../../lib/types';

interface ProDashboardContentProps {
  analysis: CareerAnalysis & { proFeatures?: any };
}

export const ProDashboardContent = ({ analysis }: ProDashboardContentProps) => {
  // Only render if proFeatures exist
  if (!analysis.proFeatures) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {analysis.proFeatures.skillMatrix && (
          <SkillMatrix skillMatrix={analysis.proFeatures.skillMatrix} />
        )}
        {analysis.proFeatures.marketDynamics && (
          <MarketDynamics dynamics={analysis.proFeatures.marketDynamics} />
        )}
      </div>
      
      {analysis.proFeatures.careerStrategy && (
        <CareerStrategy strategy={analysis.proFeatures.careerStrategy} />
      )}
    </motion.div>
  );
};