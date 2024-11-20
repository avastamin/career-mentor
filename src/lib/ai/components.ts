import { createCompletion } from './client';
import { generatePrompts } from './prompts';
import { validateCareerPathResponse } from './validation';
import { getRecommendedCourses, enrichCourseWithPartnerInfo } from '../coursera';
import type { CareerProfile } from '../types';

export async function analyzeComponent(
  component: 'skillAnalysis' | 'careerPath' | 'industryAnalysis' | 'learningPath' | 'marketAnalysis' | 'proSkillGap' | 'proCareerStrategy' | 'proMarketPosition',
  profile: CareerProfile,
  userRole: string
): Promise<any> {
  try {
    const prompts = generatePrompts(component, profile, userRole);
    const systemPrompt = `You are CareerMentor AI, a professional career advisor specializing in ${component}. 
      You must provide highly detailed, specific, and actionable insights.
      Your analysis should be comprehensive and tailored to the user's experience level.
      ${userRole === 'premium' ? 'Provide executive-level strategic insights and advanced recommendations.' : ''}
      ${userRole === 'pro' ? 'Include detailed technical analysis and professional growth strategies.' : ''}
      Never use generic or placeholder content.
      Each response must be unique and specifically tailored to the user's profile.`;

    const result = await createCompletion(systemPrompt, prompts[component], userRole as any);

    try {
      // Validate career path response structure
      if (component === 'careerPath') {
        result = validateCareerPathResponse(result);
      }

      // Handle learning path resources
      if (component === 'learningPath' && userRole !== 'free') {
        result = await enrichLearningResources(result, profile);
      }

      return result;
    } catch (error) {
      console.error(`Error processing ${component} analysis:`, error);
      throw new Error(`Failed to process ${component} analysis: ${error.message}`);
    }
  } catch (error) {
    console.error(`Error analyzing ${component}:`, error);
    throw error;
  }
}

async function enrichLearningResources(parsedResult: any, profile: CareerProfile) {
  try {
    const searchTerms = [
      profile.desiredRole,
      ...profile.skills,
      ...(parsedResult.keySkills || []),
      ...(parsedResult.learningAreas || []),
      ...(parsedResult.certifications || []),
      ...(parsedResult.resources?.flatMap(r => [
        r.title,
        ...(r.searchTerms || []),
        ...(r.skills || [])
      ]) || [])
    ].filter(Boolean);

    const courseRecommendations = await getRecommendedCourses(
      searchTerms,
      profile.desiredRole,
      parsedResult
    );

    const enrichedCourses = await Promise.all(
      courseRecommendations.map(course => enrichCourseWithPartnerInfo(course))
    );

    parsedResult.resources = [
      ...(parsedResult.resources || []),
      ...enrichedCourses
        .filter(Boolean)
        .map(course => ({
          id: course.id || Math.random().toString(),
          title: course.name || 'Career Development Course',
          type: 'course',
          url: course.slug ? `https://www.coursera.org/learn/${course.slug}` : '#',
          priority: course.relevanceScore >= 0.7 ? 'high' : 'medium',
          duration: course.workload || 'Self-paced',
          skills: course.domainTypes || [],
          provider: 'Coursera',
          partnerInfo: course.partnerInfo,
          description: course.description || 'No description available',
          photoUrl: course.photoUrl || 'https://via.placeholder.com/150',
          relevanceScore: course.relevanceScore
        }))
    ];

    return parsedResult;
  } catch (error) {
    console.error('Error adding course recommendations:', error);
    return parsedResult;
  }
}