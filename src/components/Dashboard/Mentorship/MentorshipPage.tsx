import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { MentorList } from './MentorList';
import { UpcomingSessions } from './UpcomingSessions';
import { MentorshipProgress } from './MentorshipProgress';

export const MentorshipPage = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();

  return (
    <>
      <Helmet>
        <title>Mentorship - CareerMentor</title>
        <meta 
          name="description" 
          content="Connect with experienced mentors and track your mentorship journey." 
        />
      </Helmet>
      
      {!analysisResults || !userProfile ? (
        <CareerAnalysisPrompt />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mentorship</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MentorshipProgress />
              <div className="mt-6">
                <MentorList />
              </div>
            </div>
            <div>
              <UpcomingSessions />
            </div>
          </div>
        </div>
      )}
    </>
  );
};