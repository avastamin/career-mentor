import { analyzeComponent } from './components';
import { validateProfile } from './validation';
import { createCompletion } from './client';
import { QUICK_ANALYSIS_PROMPT } from './prompts';
import type { CareerProfile, CareerAnalysis } from '../types';

export async function analyzeCareer(
  profile: CareerProfile,
  userRole: 'free' | 'pro' | 'premium' | 'admin' = 'free'
): Promise<CareerAnalysis> {
  try {
    validateProfile(profile);

    const components = ['skillAnalysis', 'careerPath', 'industryAnalysis', 'learningPath', 'marketAnalysis'];
    if (userRole === 'pro' || userRole === 'premium') {
      components.push('proSkillGap', 'proCareerStrategy', 'proMarketPosition');
    }

    const results = await Promise.all(
      components.map(component => 
        analyzeComponent(
          component as any,
          profile,
          userRole
        )
      )
    );

    const [
      skillAnalysis,
      careerPathAnalysis,
      industryAnalysis,
      learningPathAnalysis,
      marketAnalysis,
      ...proAnalyses
    ] = results;

    const analysis: CareerAnalysis = {
      careerPath: careerPathAnalysis.path,
      currentSkills: skillAnalysis.currentSkills,
      skillGaps: skillAnalysis.skillGaps,
      recommendations: careerPathAnalysis.recommendations,
      potentialRoles: careerPathAnalysis.potentialRoles,
      roleDetails: careerPathAnalysis.roleDetails,
      learningResources: learningPathAnalysis.resources,
      industryInsights: industryAnalysis,
      marketOverview: marketAnalysis.marketOverview,
      timeline: careerPathAnalysis.timeline,
      milestones: learningPathAnalysis.milestones
    };

    if (userRole === 'pro' || userRole === 'premium') {
      const [skillGapAnalysis, careerStrategyAnalysis, marketPositionAnalysis] = proAnalyses;
      analysis.proFeatures = {
        skillMatrix: skillGapAnalysis.skillMatrix,
        careerStrategy: careerStrategyAnalysis.strategy,
        marketDynamics: marketPositionAnalysis.marketDynamics
      };
    }

    return analysis;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

export async function quickAnalyzeCareer(profile: any) {
  try {
    const systemPrompt = `You are CareerMentor AI, providing personalized career guidance.
      Your response must be in valid JSON format.
      Provide specific, actionable insights tailored to the user's profile.`;

    const userPrompt = `
      Analyze the following career profile and provide personalized guidance:
      ${JSON.stringify(profile, null, 2)}
      ${QUICK_ANALYSIS_PROMPT}
    `;

    const result = await createCompletion(systemPrompt, userPrompt, 'free');
    return result;
  } catch (error) {
    console.error('Preview analysis error:', error);
    throw new Error('Failed to generate career analysis preview');
  }
}