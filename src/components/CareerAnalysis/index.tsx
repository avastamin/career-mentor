import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

const CareerForm = lazy(() => import('./CareerForm').then(m => ({ default: m.CareerForm })));
const AnalysisResults = lazy(() => import('./AnalysisResults').then(m => ({ default: m.AnalysisResults })));

import { analyzeCareer } from '../../lib/ai';
import type { CareerProfile, CareerAnalysis } from '../../lib/types';

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-indigo-600" />
  </div>
);

export const CareerAnalysisForm = () => {
  const [analysis, setAnalysis] = React.useState<CareerAnalysis | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: CareerProfile) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCareer(data);
      if (!result) {
        throw new Error('Failed to analyze career data');
      }
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze career data. Please try again.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="career-analysis" className="max-w-4xl mx-auto p-6 career-analysis-section">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          {!analysis ? (
            <CareerForm key="form" onSubmit={handleSubmit} loading={loading} />
          ) : (
            <AnalysisResults 
              key="results" 
              analysis={analysis} 
              onReset={() => {
                setAnalysis(null);
                setError(null);
              }} 
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};