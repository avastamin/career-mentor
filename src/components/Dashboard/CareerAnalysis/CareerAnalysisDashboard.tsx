import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Loader } from 'lucide-react';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { useAuth } from '../../../contexts/AuthContext';
import { CareerAnalysisForm } from './CareerAnalysisForm';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { useLocation } from 'react-router-dom';

export const CareerAnalysisDashboard = () => {
  const { analysisResults, userProfile, loading, error } = useCareerAnalysis();
  const { user } = useAuth();
  const location = useLocation();

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!user) {
    return <CareerAnalysisPrompt />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Career Analysis - CareerMentor</title>
        <meta 
          name="description" 
          content="Get detailed insights about your career path, skills, and growth opportunities." 
        />
      </Helmet>
      
      <div className="relative">
        <CareerAnalysisForm />
      </div>
    </>
  );
};