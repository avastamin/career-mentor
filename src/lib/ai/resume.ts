import OpenAI from 'openai';
import type { CareerProfile } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    duration: string;
    description?: string;
  }>;
  links: Array<{
    title: string;
    url: string;
  }>;
}

export async function generateResume(
  profile: CareerProfile,
  template: string
): Promise<ResumeData> {
  try {
    const prompt = `
      Generate a professional resume for someone with the following profile:
      Current Role: ${profile.currentRole}
      Years of Experience: ${profile.yearsExperience}
      Skills: ${profile.skills.join(', ')}
      Desired Role: ${profile.desiredRole}
      Education: ${profile.education}
      Industry: ${profile.industryPreference}

      The resume should follow a ${template} style template.
      
      Return a JSON object with the following structure:
      {
        "personalInfo": {
          "name": "string (leave empty for user to fill)",
          "title": "string (current role)",
          "email": "string (leave empty)",
          "phone": "string (leave empty)",
          "location": "string (leave empty)",
          "summary": "string (professional summary based on experience and goals)"
        },
        "experience": [
          {
            "title": "string (role title)",
            "company": "string (example company name)",
            "location": "string (example location)",
            "duration": "string (timeframe)",
            "description": "string (role description)",
            "achievements": ["string (specific achievements)"]
          }
        ],
        "skills": ["string (relevant skills)"],
        "education": [
          {
            "degree": "string",
            "institution": "string",
            "location": "string",
            "duration": "string",
            "description": "string (optional)"
          }
        ],
        "links": [
          {
            "title": "string (e.g., LinkedIn, Portfolio)",
            "url": "string (leave empty)"
          }
        ]
      }

      Focus on:
      1. Professional summary highlighting key strengths and career goals
      2. Relevant experience descriptions that align with the desired role
      3. Skills that demonstrate progression towards the desired role
      4. Achievement-focused bullet points
      5. ${template === 'creative' ? 'Creative and impactful language' : 'Clear and professional language'}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer with experience in crafting compelling resumes for career transitions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No resume data generated');

    return JSON.parse(result);
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume content');
  }
}

export async function enhanceResumeSection(
  section: string,
  content: string,
  role: string,
  template: string
): Promise<string> {
  try {
    const prompt = `
      Enhance the following ${section} section for a ${role} resume using a ${template} style:

      Original content:
      ${content}

      Provide an improved version that:
      1. Uses strong action verbs
      2. Quantifies achievements where possible
      3. Aligns with ${template} style (${template === 'creative' ? 'bold and innovative' : 'professional and clear'} language)
      4. Highlights relevant skills and accomplishments
      5. Maintains professional tone while being impactful

      Return only the enhanced content without any additional formatting or explanation.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer specializing in impactful content optimization.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No enhancement generated');

    return result;
  } catch (error) {
    console.error('Error enhancing resume section:', error);
    throw new Error('Failed to enhance resume section');
  }
}

export async function suggestSkills(
  currentRole: string,
  desiredRole: string,
  currentSkills: string[]
): Promise<string[]> {
  try {
    const prompt = `
      Suggest additional relevant skills for someone transitioning from ${currentRole} to ${desiredRole}.
      
      Current skills: ${currentSkills.join(', ')}

      Return a JSON array of strings containing 5-8 suggested skills that would strengthen the resume.
      Focus on both technical and soft skills that would be valuable for the desired role.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in professional skill development and career transitions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No skills generated');

    return JSON.parse(result).skills;
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw new Error('Failed to suggest skills');
  }
}

export async function generateAchievements(
  role: string,
  description: string
): Promise<string[]> {
  try {
    const prompt = `
      Based on the following role description for a ${role} position, generate specific, quantifiable achievements:

      ${description}

      Return a JSON array of 3-4 achievement statements that:
      1. Use strong action verbs
      2. Include specific metrics where possible
      3. Highlight impact and results
      4. Align with industry standards
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in crafting achievement-focused resume content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No achievements generated');

    return JSON.parse(result).achievements;
  } catch (error) {
    console.error('Error generating achievements:', error);
    throw new Error('Failed to generate achievements');
  }
}