import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useCareerAnalysis } from '../../contexts/CareerAnalysisContext';
import { useAuth } from '../../contexts/AuthContext';
import { CareerAnalysisPrompt } from './CareerAnalysisPrompt';
import { DashboardContent } from './DashboardContent';

export const DashboardOverview = () => {
  const location = useLocation();
  const { analysisResults, setAnalysisResults, userProfile } = useCareerAnalysis();
  const { user, userProfile: authProfile } = useAuth();

  // Update analysis results when navigating from form submission
  useEffect(() => {
    if (location.state?.analysisResults) {
      setAnalysisResults(location.state.analysisResults);
    }
  }, [location.state, setAnalysisResults]);

  // Show analysis prompt for free users without analysis
  const shouldShowPrompt = () => {
    if (!user || !authProfile) return true;
    if (
      authProfile.role === 'free' &&
      (!analysisResults || !userProfile)
    )
      return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {shouldShowPrompt() ? (
        <CareerAnalysisPrompt />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardContent />
        </motion.div>
      )}
    </div>
  );
};