import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function quickAnalyzeCareer(profile: any) {
  try {
    const prompt = `
You are CareerMentor AI, a supportive and insightful career advisor. Analyze the following profile and provide personalized guidance:

Profile:
${JSON.stringify(profile, null, 2)}

Respond in a warm, encouraging tone while maintaining professionalism. Focus on:
1. Personal connection and acknowledgment of their experience
2. Clear, actionable insights about their potential
3. Specific growth opportunities based on their background
4. Encouraging next steps that align with their goals

Format response as JSON with the following structure:
{
  "direction": "string (2-3 sentences, personal and encouraging)",
  "skills": ["string"] (4 most relevant skills to focus on),
  "growthScore": number (0-100, based on experience and potential),
  "roleAnalysis": {
    "title": "string (specific role recommendation)",
    "match": number (percentage match),
    "requirements": ["string"] (3 key requirements),
    "timeToAchieve": "string (realistic timeline)"
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are CareerMentor AI, a supportive and insightful career advisor focused on providing personalized, actionable guidance.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No analysis generated');

    return JSON.parse(result);
  } catch (error) {
    console.error('Preview analysis error:', error);
    throw new Error('Failed to generate career analysis preview');
  }
}

// Helper function to calculate growth score based on profile
function calculateGrowthScore(profile: any): number {
  let score = 70; // Base score

  // Add points for experience
  score += Math.min(profile.yearsExperience * 2, 15);

  // Add points for skill alignment
  const skillsCount = profile.skills?.split(',').length || 0;
  score += Math.min(skillsCount * 3, 10);

  // Add points for clear career direction
  if (profile.currentRole && profile.desiredRole) {
    score += 5;
  }

  return Math.min(score, 95); // Cap at 95 to show room for growth
}

// Helper function to generate personalized insights
function generatePersonalizedInsights(profile: any): string {
  const insights = [
    `Your ${profile.yearsExperience} years as a ${profile.currentRole} provide a strong foundation.`,
    `I see excellent potential for your transition to ${profile.desiredRole}.`,
    `Your experience with ${profile.skills?.split(',')[0]} is particularly valuable.`,
    `Let's focus on building the right skills to reach your goals.`
  ];

  return insights.join(' ');
}

// Helper function to determine skill recommendations
function getSkillRecommendations(profile: any): string[] {
  const currentSkills = profile.skills?.split(',').map((s: string) => s.trim()) || [];
  const desiredRole = profile.desiredRole?.toLowerCase() || '';

  const technicalSkills = [
    'System Design',
    'Cloud Architecture',
    'API Development',
    'Full-Stack Development'
  ];

  const leadershipSkills = [
    'Team Leadership',
    'Project Management',
    'Strategic Planning',
    'Stakeholder Management'
  ];

  return desiredRole.includes('senior') || desiredRole.includes('lead')
    ? [...technicalSkills.slice(0, 2), ...leadershipSkills.slice(0, 2)]
    : technicalSkills;
}