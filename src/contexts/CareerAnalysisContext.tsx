import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CareerProfile, CareerAnalysis, LearningResource } from '../lib/types';
import { useAuth } from './AuthContext';
import { getLatestCareerAnalysis } from '../lib/career-storage';
import { getRecommendedCourses, enrichCourseWithPartnerInfo } from '../lib/coursera';

interface CareerAnalysisContextType {
  analysisResults: CareerAnalysis | null;
  setAnalysisResults: (results: CareerAnalysis | null) => void;
  userProfile: CareerProfile | null;
  setUserProfile: (profile: CareerProfile | null) => void;
  learningResources: LearningResource[];
  setLearningResources: (resources: LearningResource[]) => void;
  error: string | null;
  retryLoading: () => void;
}

const CareerAnalysisContext = createContext<CareerAnalysisContextType | undefined>(undefined);

export const CareerAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState<CareerAnalysis | null>(() => {
    const cached = sessionStorage.getItem('latestAnalysis');
    return cached ? JSON.parse(cached) : null;
  });

  const [userProfile, setUserProfile] = useState<CareerProfile | null>(() => {
    const cached = sessionStorage.getItem('latestProfile');
    return cached ? JSON.parse(cached) : null;
  });

  const [learningResources, setLearningResources] = useState<LearningResource[]>(() => {
    const cached = sessionStorage.getItem('learningResources');
    return cached ? JSON.parse(cached) : [];
  });

  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadLatestAnalysis = async () => {
      if (!user) {
        setAnalysisResults(null);
        setUserProfile(null);
        setLearningResources([]);
        setError(null);
        return;
      }

      try {
        setError(null);
        const latestAnalysis = await getLatestCareerAnalysis(user.id);
        
        if (latestAnalysis) {
          setAnalysisResults(latestAnalysis.analysis_results);
          setUserProfile(latestAnalysis.profile);
          
          // Store in session storage
          sessionStorage.setItem('latestAnalysis', JSON.stringify(latestAnalysis.analysis_results));
          sessionStorage.setItem('latestProfile', JSON.stringify(latestAnalysis.profile));

          // Load course recommendations if not already cached
          if (!sessionStorage.getItem('learningResources')) {
            try {
              const courseRecommendations = await getRecommendedCourses(
                latestAnalysis.profile.skills,
                latestAnalysis.profile.desiredRole
              );

              const enrichedCourses = await Promise.all(
                courseRecommendations.map(course => enrichCourseWithPartnerInfo(course))
              );

              const resources: LearningResource[] = enrichedCourses.map(course => ({
                id: course.id || Math.random().toString(),
                title: course.name || 'Untitled Course',
                type: 'course',
                url: course.slug ? `https://www.coursera.org/learn/${course.slug}` : '#',
                priority: (course.relevanceScore || 0) >= 0.7 ? 'high' : 'medium',
                duration: course.workload || 'Self-paced',
                skills: course.domainTypes || [],
                certification: course.certificates?.length > 0,
                provider: 'Coursera',
                partnerInfo: course.partnerInfo,
                description: course.description || 'No description available',
                photoUrl: course.photoUrl || 'https://via.placeholder.com/150'
              }));

              setLearningResources(resources);
              sessionStorage.setItem('learningResources', JSON.stringify(resources));
            } catch (courseError) {
              console.error('Error loading course recommendations:', courseError);
              // Don't set error state here as we still want to show the analysis
            }
          }
        }
      } catch (err) {
        const error = err as Error;
        if (
          !error.message?.includes('does not exist') &&
          !error.message?.includes('Failed to fetch')
        ) {
          setError('Failed to load career analysis');
          console.error('Error loading career analysis:', error);
        }
      }
    };

    loadLatestAnalysis();
  }, [user, retryCount]);

  const retryLoading = () => setRetryCount((prev) => prev + 1);

  const updateAnalysisResults = (results: CareerAnalysis | null) => {
    setAnalysisResults(results);
    if (results) {
      sessionStorage.setItem('latestAnalysis', JSON.stringify(results));
    } else {
      sessionStorage.removeItem('latestAnalysis');
      sessionStorage.removeItem('learningResources');
      setLearningResources([]);
    }
  };

  const updateUserProfile = (profile: CareerProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      sessionStorage.setItem('latestProfile', JSON.stringify(profile));
    } else {
      sessionStorage.removeItem('latestProfile');
      sessionStorage.removeItem('learningResources');
      setLearningResources([]);
    }
  };

  const value = {
    analysisResults,
    setAnalysisResults: updateAnalysisResults,
    userProfile,
    setUserProfile: updateUserProfile,
    learningResources,
    setLearningResources,
    error,
    retryLoading,
  };

  return (
    <CareerAnalysisContext.Provider value={value}>
      {children}
    </CareerAnalysisContext.Provider>
  );
};

export const useCareerAnalysis = () => {
  const context = useContext(CareerAnalysisContext);
  if (context === undefined) {
    throw new Error('useCareerAnalysis must be used within a CareerAnalysisProvider');
  }
  return context;
};