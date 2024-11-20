import OpenAI from 'openai';
import { CareerProfileSchema, type CareerProfile, type CareerAnalysis } from './types';
import { getRecommendedCourses, enrichCourseWithPartnerInfo } from './coursera';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function validateProfile(profile: CareerProfile): void {
  const result = CareerProfileSchema.safeParse(profile);
  if (!result.success) {
    throw new Error(`Invalid profile data: ${JSON.stringify(result.error.errors)}`);
  }
}

async function analyzeComponent(
  component: 'skillAnalysis' | 'careerPath' | 'industryAnalysis' | 'learningPath' | 'marketAnalysis' | 'proSkillGap' | 'proCareerStrategy' | 'proMarketPosition',
  profile: CareerProfile,
  userRole: string
): Promise<any> {
  try {
    const maxTokens = userRole === 'premium' ? 10000 : userRole === 'pro' ? 10000 : 10000;
    const model = 'gpt-4o';

    const prompts = {
      skillAnalysis: `Analyze the current skills and identify gaps for a ${profile.currentRole} aiming to become a ${profile.desiredRole}. 
        Consider their ${profile.yearsExperience} years of experience and current skills: ${profile.skills.join(', ')}.
        ${userRole === 'free' ? 'Provide basic skill analysis.' : 'Include detailed competency mapping and development priorities.'}
        
        Return a detailed JSON with:
        {
          "currentSkills": [
            {
              "skill": "string",
              "proficiency": "string (Beginner|Intermediate|Advanced|Expert)",
              "relevance": "number (0-100)"
            }
          ],
          "skillGaps": [
            {
              "skill": "string",
              "priority": "string (High|Medium|Low)",
              "timeToAcquire": "string"
            }
          ],
          "skillMatrix": {
            "technical": ["string"] (exactly 5 skills),
            "soft": ["string"] (exactly 5 skills),
            "leadership": ["string"] (exactly 5 skills),
            "domain": ["string"] (exactly 5 skills)
          },
          "recommendations": {
            "immediate": ["string"] (exactly 3 actions),
            "shortTerm": ["string"] (exactly 3 actions),
            "longTerm": ["string"] (exactly 3 actions)
          }
        }`,

      careerPath: `Analyze the career progression path from ${profile.currentRole} to ${profile.desiredRole}.
        Experience: ${profile.yearsExperience} years
        Skills: ${profile.skills.join(', ')}
        
        Provide two detailed analyses in the following JSON format:
        {
          "path": "string (minimum 3 detailed sentences describing the career progression path)",
          "potentialRoles": {
            "roles": [
              {
                "title": "string (role title)",
                "description": "string (2-3 sentences about the role)",
                "requirements": ["string"] (exactly 3 key requirements),
                "timeToAchieve": "string (estimated time)",
                "salary": "string (salary range)",
                "growth": "string (growth rate)",
                "demand": "string (market demand)",
                "trends": ["string"] (exactly 2 industry trends),
                "opportunities": ["string"] (exactly 2 growth opportunities)
              }
            ] (exactly 4 roles)
          },
          "timeline": {
            "shortTerm": ["string"] (exactly 3 goals),
            "midTerm": ["string"] (exactly 3 goals),
            "longTerm": ["string"] (exactly 3 goals)
          },
          "recommendations": {
            "immediate": ["string"] (exactly 4 actions),
            "shortTerm": ["string"] (exactly 4 goals),
            "longTerm": ["string"] (exactly 4 objectives)
          }
        }`,

      industryAnalysis: `Analyze industry trends and opportunities in ${profile.industryPreference} for someone moving from ${profile.currentRole} to ${profile.desiredRole}.
        ${userRole === 'free' ? 'Provide basic industry insights.' : 'Include detailed market dynamics and future projections.'}
        
        Return JSON with:
        {
          "trends": ["string"] (exactly 5 trends),
          "opportunities": [
            {
              "description": "string",
              "timeframe": "string",
              "impact": "string (High|Medium|Low)"
            }
          ] (exactly 5 opportunities),
          "challenges": [
            {
              "description": "string",
              "severity": "string (High|Medium|Low)",
              "mitigation": "string"
            }
          ] (exactly 5 challenges),
          "marketDynamics": {
            "growthRate": "string",
            "demandLevel": "string (High|Medium|Low)",
            "competitionLevel": "string",
            "emergingTechnologies": ["string"] (exactly 5 technologies),
            "skillDemand": ["string"] (exactly 5 in-demand skills),
            "compensationTrends": "string (detailed salary trends)",
            "workCulture": "string (industry work culture)"
          }
        }`,

      learningPath: `Design a ${userRole === 'free' ? 'basic' : 'detailed'} learning path to transition from ${profile.currentRole} to ${profile.desiredRole}.
        Consider their current skills: ${profile.skills.join(', ')}.
        
        Return JSON with:
        {
          "resources": [
            {
              "title": "string",
              "type": "string",
              "url": "string",
              "priority": "string (High|Medium|Low)",
              "duration": "string",
              "skills": ["string"],
              "certification": "boolean",
              "provider": "string",
              "description": "string"
            }
          ] (minimum 5 resources),
          "milestones": ["string"] (exactly 5 milestones),
          "certifications": ["string"] (exactly 3 recommended certifications),
          "projects": ["string"] (exactly 3 practical projects),
          "keySkills": ["string"] (exactly 5 key skills to focus on),
          "learningAreas": ["string"] (exactly 5 areas of study)
        }`,

      marketAnalysis: `Analyze the job market for ${profile.desiredRole} in ${profile.industryPreference}.
        ${userRole === 'free' ? 'Provide basic market insights.' : 'Include detailed salary trends and qualifications.'}
        
        Return JSON with:
        {
          "marketOverview": {
            "salaryRange": "string",
            "demandLevel": "string (High|Medium|Low)",
            "growthRate": "string",
            "requiredQualifications": ["string"] (exactly 5 qualifications),
            "timeToAchieve": "string",
            "competitionLevel": "string",
            "marketMaturity": "string",
            "futureOutlook": "string"
          },
          "trends": ["string"] (exactly 5 trends),
          "opportunities": ["string"] (exactly 5 opportunities),
          "challenges": ["string"] (exactly 5 challenges)
        }`,

      proSkillGap: `Perform an advanced skill gap analysis for transitioning from ${profile.currentRole} to ${profile.desiredRole}.
        Current skills: ${profile.skills.join(', ')}.
        
        Return JSON with:
        {
          "skillMatrix": {
            "technical": {
              "current": ["string"] (exactly 5 skills),
              "required": ["string"] (exactly 5 skills),
              "gaps": ["string"] (exactly 5 skills)
            },
            "soft": {
              "current": ["string"] (exactly 5 skills),
              "required": ["string"] (exactly 5 skills),
              "gaps": ["string"] (exactly 5 skills)
            },
            "leadership": {
              "current": ["string"] (exactly 5 skills),
              "required": ["string"] (exactly 5 skills),
              "gaps": ["string"] (exactly 5 skills)
            }
          },
          "developmentPlan": {
            "immediate": ["string"] (exactly 5 actions),
            "shortTerm": ["string"] (exactly 5 actions),
            "longTerm": ["string"] (exactly 5 actions)
          }
        }`,

      proCareerStrategy: `Develop a detailed career strategy for advancing from ${profile.currentRole} to ${profile.desiredRole}.
        
        Return JSON with:
        {
          "strategy": {
            "networking": ["string"] (exactly 5 strategies),
            "upskilling": ["string"] (exactly 5 strategies),
            "visibility": ["string"] (exactly 5 strategies),
            "positioning": ["string"] (exactly 5 strategies)
          },
          "milestones": ["string"] (exactly 5 key milestones),
          "actionPlan": {
            "30days": ["string"] (exactly 5 actions),
            "90days": ["string"] (exactly 5 actions),
            "180days": ["string"] (exactly 5 actions)
          }
        }`,

      proMarketPosition: `Analyze market positioning strategy for transitioning to ${profile.desiredRole}.
        
        Return JSON with:
        {
          "marketDynamics": {
            "emergingTechnologies": ["string"] (exactly 5 technologies),
            "skillDemand": ["string"] (exactly 5 in-demand skills),
            "compensationTrends": "string (detailed salary trends)",
            "workCulture": "string (industry work culture)"
          },
          "competitiveAnalysis": {
            "strengths": ["string"] (exactly 5 points),
            "opportunities": ["string"] (exactly 5 points),
            "challenges": ["string"] (exactly 5 points)
          },
          "positioning": {
            "uniqueValue": ["string"] (exactly 5 points),
            "targetCompanies": ["string"] (exactly 5 companies),
            "networking": ["string"] (exactly 5 strategies)
          }
        }`
    };

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are CareerMentor AI, a professional career advisor specializing in ${component}. 
            Your responses must be in valid JSON format.
            Focus on practical, industry-relevant recommendations.
            Consider the user's experience level and career goals.
            Never use placeholder content or generic responses.
            Ensure all arrays contain exactly the specified number of items.`
        },
        {
          role: 'user',
          content: prompts[component]
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No analysis generated');

    try {
      const parsedResult = JSON.parse(result);

      // Validate career path response structure
      if (component === 'careerPath') {
        if (!parsedResult.potentialRoles?.roles?.length) {
          throw new Error('Invalid career path analysis: missing roles array');
        }

        // Extract role titles for the potentialRoles array
        const roleDetails = parsedResult.potentialRoles.roles;
        parsedResult.potentialRoles = roleDetails.map((role: any) => role.title);
        parsedResult.roleDetails = roleDetails;

        // Validate required arrays have correct length
        const validateArrayLength = (arr: any[], expectedLength: number, fieldName: string) => {
          if (!Array.isArray(arr) || arr.length !== expectedLength) {
            throw new Error(`Invalid ${fieldName}: expected ${expectedLength} items, got ${arr?.length || 0}`);
          }
        };

        validateArrayLength(parsedResult.timeline.shortTerm, 3, 'shortTerm timeline');
        validateArrayLength(parsedResult.timeline.midTerm, 3, 'midTerm timeline');
        validateArrayLength(parsedResult.timeline.longTerm, 3, 'longTerm timeline');
        validateArrayLength(parsedResult.recommendations.immediate, 4, 'immediate recommendations');
        validateArrayLength(parsedResult.recommendations.shortTerm, 4, 'shortTerm recommendations');
        validateArrayLength(parsedResult.recommendations.longTerm, 4, 'longTerm recommendations');
      }

      // Handle learning path resources
      if (component === 'learningPath' && userRole !== 'free') {
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
        } catch (error) {
          console.error('Error adding course recommendations:', error);
        }
      }

      return parsedResult;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', result);
      throw new Error(`Invalid JSON response from AI for ${component}: ${parseError.message}`);
    }
  } catch (error) {
    console.error(`Error analyzing ${component}:`, error);
    throw error;
  }
}

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
          component as 'skillAnalysis' | 'careerPath' | 'industryAnalysis' | 'learningPath' | 'marketAnalysis' | 'proSkillGap' | 'proCareerStrategy' | 'proMarketPosition',
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
    const prompt = `
      Analyze the following career profile and provide personalized guidance:
      ${JSON.stringify(profile, null, 2)}

      Return JSON with:
      {
        "direction": "string (2-3 encouraging sentences)",
        "skills": ["string"] (exactly 4 key skills to focus on),
        "growthScore": "number (0-100)",
        "roleAnalysis": {
          "title": "string (specific role recommendation)",
          "match": "number (percentage match)",
          "requirements": ["string"] (exactly 3 key requirements),
          "timeToAchieve": "string (realistic timeline)"
        }
      }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are CareerMentor AI, providing personalized career guidance.'
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

    const result = response.choices[0].message.content;
    if (!result) throw new Error('No analysis generated');

    return JSON.parse(result);
  } catch (error) {
    console.error('Preview analysis error:', error);
    throw new Error('Failed to generate career analysis preview');
  }
}