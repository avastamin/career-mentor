import OpenAI from 'openai';
import type { CareerProfile, CareerAnalysis } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'mid-term' | 'long-term';
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  description?: string;
}

export interface GoalInsight {
  title: string;
  description: string;
  type: 'success' | 'tip' | 'action' | 'warning';
}

export async function generateGoalInsights(
  goals: Goal[],
  profile: CareerProfile,
  analysis: CareerAnalysis
): Promise<GoalInsight[]> {
  try {
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
    const totalGoals = goals.length;

    const prompt = `
      As an expert career advisor, analyze this career profile and goals to provide strategic insights:

      Profile:
      - Current Role: ${profile.currentRole}
      - Desired Role: ${profile.desiredRole}
      - Career Path: ${analysis.careerPath}
      
      Goals Progress:
      - Total Goals: ${totalGoals}
      - Completed: ${completedGoals}
      - In Progress: ${inProgressGoals}
      
      Active Goals:
      ${goals.map(g => `- ${g.title} (${g.status}, ${g.priority} priority, ${g.type})`).join('\n')}

      Provide 3 strategic insights in this JSON format:
      {
        "insights": [
          {
            "title": "string (concise insight title)",
            "description": "string (2-3 sentences of specific, actionable advice)",
            "type": "success|tip|action|warning"
          }
        ]
      }

      Requirements:
      1. Make insights specific to the user's goals and career path
      2. Focus on actionable next steps
      3. Consider goal priorities and timeline
      4. Reference specific goals where relevant
      5. Provide strategic recommendations for career growth`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a career strategy AI assistant specializing in goal analysis and career development.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    return result.insights;
  } catch (error) {
    console.error('Error generating goal insights:', error);
    throw new Error('Failed to generate goal insights');
  }
}

export function generateBasicInsights(goals: Goal[], analysis: CareerAnalysis): GoalInsight[] {
  const insights: GoalInsight[] = [];

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  if (completionRate > 0) {
    insights.push({
      title: "Goal Progress",
      description: `You've completed ${completedGoals} out of ${totalGoals} goals (${Math.round(completionRate)}%). Keep up the momentum!`,
      type: "success"
    });
  }

  const highPriorityGoals = goals.filter(g => g.priority === 'high' && g.status !== 'completed');
  if (highPriorityGoals.length > 0) {
    insights.push({
      title: "Priority Focus",
      description: `Focus on your ${highPriorityGoals.length} high-priority goals to maintain momentum toward your career objectives.`,
      type: "action"
    });
  }

  if (analysis?.careerPath) {
    insights.push({
      title: "Career Alignment",
      description: "Your goals align well with your target career path. Continue focusing on skill development and networking opportunities.",
      type: "tip"
    });
  }

  return insights;
}