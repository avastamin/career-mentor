import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { GoalsList } from './GoalsList';
import { GoalProgress } from './GoalProgress';
import { GoalInsights } from './GoalInsights';

export const GoalsPage = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();

  return (
    <>
      <Helmet>
        <title>Career Goals - CareerMentor</title>
        <meta 
          name="description" 
          content="Track and manage your career goals with AI-powered insights and recommendations." 
        />
      </Helmet>
      
      {!analysisResults || !userProfile ? (
        <CareerAnalysisPrompt />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Career Goals</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GoalProgress />
              <div className="mt-6">
                <GoalsList />
              </div>
            </div>
            <div>
              <GoalInsights />
            </div>
          </div>
        </div>
      )}
    </>
  );
};