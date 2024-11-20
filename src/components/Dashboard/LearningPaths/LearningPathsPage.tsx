import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { LearningPathsList } from './LearningPathsList';
import { CurrentProgress } from './CurrentProgress';

export const LearningPathsPage = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();

  return (
    <>
      <Helmet>
        <title>Learning Paths - CareerMentor</title>
        <meta 
          name="description" 
          content="Get personalized learning paths and course recommendations based on your career goals." 
        />
      </Helmet>
      
      {!analysisResults || !userProfile ? (
        <CareerAnalysisPrompt />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
          </div>

          <div className="space-y-6">
            <CurrentProgress />
            <LearningPathsList />
          </div>
        </div>
      )}
    </>
  );
};