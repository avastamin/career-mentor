import { createCompletion } from './ai/client';

// Function to get AI-generated course recommendations
export async function getRecommendedCourses(
  skills: string[],
  role: string,
  analysis?: any
): Promise<any[]> {
  try {
    if (!Array.isArray(skills) || !skills.length || !role) {
      console.error('Invalid input: skills array and role are required');
      return getMockCourses(role);
    }

    const prompt = `
      Generate detailed course recommendations for someone transitioning to a ${role} role.
      Their skills include: ${skills.join(', ')}
      
      Return a JSON array of exactly 5 courses with this structure:
      [
        {
          "id": "string (unique identifier)",
          "name": "string (course title)",
          "description": "string (2-3 sentences about the course)",
          "workload": "string (e.g., '6-8 hours/week')",
          "domainTypes": ["string"] (exactly 3 relevant skill domains),
          "certificates": ["string"] (certification types),
          "photoUrl": "string (valid Unsplash image URL for course thumbnail)",
          "relevanceScore": number (0-1, how relevant to career goals),
          "partnerInfo": [{
            "name": "string (institution name)",
            "description": "string (1-2 sentences about institution)",
            "location": {
              "city": "string",
              "state": "string",
              "country": "string"
            }
          }],
          "price": "string (course price)",
          "level": "string (Beginner|Intermediate|Advanced)",
          "duration": "string (course duration)"
        }
      ]

      Requirements:
      1. Use real, valid Unsplash image URLs
      2. Make courses highly relevant to ${role} position
      3. Include top educational institutions as partners
      4. Ensure realistic workload and duration
      5. Focus on skills needed for ${role}`;

    const response = await createCompletion(
      'You are an expert in professional education and career development, specializing in course recommendations.',
      prompt,
      'premium'
    );

    if (!response?.courses || !Array.isArray(response.courses)) {
      throw new Error('Invalid AI response format');
    }

    return response.courses;
  } catch (error) {
    console.error('Error getting course recommendations:', error);
    return getMockCourses(role);
  }
}

// Helper function to get mock courses if AI generation fails
function getMockCourses(role: string) {
  return [
    {
      id: '1',
      name: `Professional ${role} Development`,
      description: `Comprehensive course designed specifically for aspiring ${role}s. Learn industry best practices, essential skills, and practical techniques.`,
      workload: 'Self-paced',
      domainTypes: ['Professional Development', 'Career Growth', 'Technical Skills'],
      certificates: ['Professional Certificate'],
      photoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
      relevanceScore: 0.9,
      partnerInfo: [{
        name: 'Career Development Institute',
        description: 'Leading professional development organization specializing in tech careers',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        }
      }],
      price: '$199',
      level: 'Intermediate',
      duration: '8 weeks'
    },
    {
      id: '2',
      name: `Advanced ${role} Skills`,
      description: `Master advanced concepts and skills required for senior ${role} positions. Includes hands-on projects and real-world case studies.`,
      workload: 'Self-paced',
      domainTypes: ['Career Strategy', 'Leadership', 'Advanced Skills'],
      certificates: ['Professional Certificate'],
      photoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200',
      relevanceScore: 0.85,
      partnerInfo: [{
        name: 'Professional Training Academy',
        description: 'Expert career development and training institution',
        location: {
          city: 'New York',
          state: 'NY',
          country: 'USA'
        }
      }],
      price: '$299',
      level: 'Advanced',
      duration: '12 weeks'
    }
  ];
}

// Simplified function since we don't need to enrich data anymore
export async function enrichCourseWithPartnerInfo(course: any) {
  return course;
}