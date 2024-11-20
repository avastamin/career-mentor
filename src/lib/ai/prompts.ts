import type { CareerProfile } from '../types';

export const QUICK_ANALYSIS_PROMPT = `
Return JSON with:
{
  "direction": "string (2-3 encouraging sentences focused on reaching target role)",
  "skills": ["string"] (exactly 4 key skills needed for target role),
  "growthScore": "number (0-100 based on match to target role)",
  "roleAnalysis": {
    "title": "string (specific target role recommendation)",
    "match": "number (percentage match to target role)",
    "requirements": ["string"] (exactly 3 key requirements for target role)",
    "timeToAchieve": "string (realistic timeline to target role)"
  }
}`;

export const generatePrompts = (
  component: string,
  profile: CareerProfile,
  userRole: string
) => ({
  skillAnalysis: `Analyze the skills needed to become a ${profile.desiredRole}. 
    Consider the candidate's current position as ${profile.currentRole} with ${profile.yearsExperience} years of experience and skills: ${profile.skills.join(', ')}.
    ${userRole === 'free' ? 'Provide basic skill gap analysis.' : 'Include detailed competency mapping and development priorities.'}
    Focus on identifying the specific skills required for the ${profile.desiredRole} position.
    
    Return a detailed JSON with:
    {
      "currentSkills": [
        {
          "skill": "string",
          "proficiency": "string (Beginner|Intermediate|Advanced|Expert)",
          "relevance": "number (0-100 relevance to target role)"
        }
      ],
      "skillGaps": [
        {
          "skill": "string (skill needed for target role)",
          "priority": "string (High|Medium|Low)",
          "timeToAcquire": "string"
        }
      ],
      "skillMatrix": {
        "technical": {
          "current": ["string"] (exactly 5 skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        },
        "soft": {
          "current": ["string"] (exactly 5 skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        },
        "leadership": {
          "current": ["string"] (exactly 5 skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        }
      },
      "recommendations": {
        "immediate": ["string"] (exactly 3 actions focused on target role),
        "shortTerm": ["string"] (exactly 3 actions focused on target role),
        "longTerm": ["string"] (exactly 3 actions focused on target role)
      }
    }`,

  careerPath: `Create a detailed path to transition from ${profile.currentRole} to ${profile.desiredRole}.
    Experience: ${profile.yearsExperience} years
    Skills: ${profile.skills.join(', ')}
    Industry: ${profile.industryPreference}

    Focus on providing a clear roadmap to reach the ${profile.desiredRole} position.

    CRITICAL REQUIREMENTS FOR ROLE ANALYSIS:
    1. Each role MUST be a stepping stone toward ${profile.desiredRole}
    2. Requirements must reflect skills needed for ${profile.desiredRole}
    3. Salary ranges must be specific to ${profile.desiredRole} and market conditions
    4. Growth rates must be based on current market data for ${profile.desiredRole}
    5. Trends must be specific to ${profile.desiredRole}'s industry segment
    6. All information must be factual and focused on reaching ${profile.desiredRole}

    Return JSON with:
    {
      "path": "string (minimum 3 detailed sentences describing path to target role)",
      "potentialRoles": {
        "roles": [
          {
            "title": "string (intermediate role title leading to target)",
            "description": "string (minimum 3 sentences about how this role leads to target)",
            "requirements": ["string"] (exactly 3 requirements aligned with target role),
            "timeToAchieve": "string (timeline in path to target role)",
            "salary": "string (salary range for this step)",
            "growth": "string (growth rate toward target role)",
            "demand": "string (current market demand)",
            "trends": ["string"] (exactly 2 trends relevant to target role path),
            "opportunities": ["string"] (exactly 2 opportunities leading to target role)
          }
        ] (exactly 2 roles leading to target position)
      },
      "timeline": {
        "shortTerm": ["string"] (exactly 3 goals toward target role),
        "midTerm": ["string"] (exactly 3 goals toward target role),
        "longTerm": ["string"] (exactly 3 goals reaching target role)
      },
      "recommendations": {
        "immediate": ["string"] (exactly 4 actions toward target role),
        "shortTerm": ["string"] (exactly 4 goals toward target role),
        "longTerm": ["string"] (exactly 4 objectives reaching target role)
      }
    }`,

  industryAnalysis: `Analyze industry trends and opportunities in ${profile.industryPreference} specifically for the ${profile.desiredRole} position.
    ${userRole === 'free' ? 'Provide basic industry insights.' : 'Include detailed market dynamics and future projections.'}
    Focus analysis on requirements and trends for ${profile.desiredRole}.
    
    Return JSON with:
    {
      "trends": ["string"] (exactly 5 trends relevant to target role),
      "opportunities": [
        {
          "description": "string (minimum 2 sentences focused on target role)",
          "timeframe": "string",
          "impact": "string (High|Medium|Low)"
        }
      ] (exactly 5 opportunities),
      "challenges": [
        {
          "description": "string (minimum 2 sentences about reaching target role)",
          "severity": "string (High|Medium|Low)",
          "mitigation": "string (minimum 2 sentences on overcoming challenges)"
        }
      ] (exactly 5 challenges),
      "marketDynamics": {
        "growthRate": "string (growth projection for target role)",
        "demandLevel": "string (High|Medium|Low)",
        "competitionLevel": "string (competition analysis for target role)",
        "emergingTechnologies": ["string"] (exactly 5 technologies relevant to target role),
        "skillDemand": ["string"] (exactly 5 in-demand skills for target role)",
        "compensationTrends": "string (salary trends for target role)",
        "workCulture": "string (industry culture in target role)"
      }
    }`,

  learningPath: `Design a ${userRole === 'free' ? 'basic' : 'detailed'} learning path to achieve the ${profile.desiredRole} position.
    Current skills: ${profile.skills.join(', ')}
    Focus on skills and knowledge required for ${profile.desiredRole}.
    
    Return JSON with:
    {
      "resources": [
        {
          "title": "string",
          "type": "string",
          "url": "string",
          "priority": "string (High|Medium|Low)",
          "duration": "string",
          "skills": ["string"] (skills relevant to target role),
          "certification": "boolean",
          "provider": "string",
          "description": "string (how this helps reach target role)"
        }
      ] (minimum 5 resources),
      "milestones": ["string"] (exactly 5 milestones toward target role),
      "certifications": ["string"] (exactly 3 certifications for target role),
      "projects": ["string"] (exactly 3 projects demonstrating target role skills),
      "keySkills": ["string"] (exactly 5 key skills for target role),
      "learningAreas": ["string"] (exactly 5 areas of study for target role)
    }`,

  marketAnalysis: `Analyze the job market specifically for the ${profile.desiredRole} position in ${profile.industryPreference}.
    ${userRole === 'free' ? 'Provide basic market insights.' : 'Include detailed salary trends and qualifications.'}
    
    Return JSON with:
    {
      "marketOverview": {
        "salaryRange": "string (salary range for target role)",
        "demandLevel": "string (High|Medium|Low)",
        "growthRate": "string (growth projection for target role)",
        "requiredQualifications": ["string"] (exactly 5 qualifications for target role),
        "timeToAchieve": "string (timeline to target role)",
        "competitionLevel": "string (competition analysis for target role)",
        "marketMaturity": "string (market status for target role)",
        "futureOutlook": "string (future prospects in target role)"
      },
      "trends": ["string"] (exactly 5 trends for target role),
      "opportunities": ["string"] (exactly 5 opportunities in target role),
      "challenges": ["string"] (exactly 5 challenges to reach target role)
    }`,

  proSkillGap: `Perform an advanced skill gap analysis for reaching the ${profile.desiredRole} position.
    Current skills: ${profile.skills.join(', ')}
    Focus on identifying and bridging gaps to ${profile.desiredRole}.
    
    Return JSON with:
    {
      "skillMatrix": {
        "technical": {
          "current": ["string"] (exactly 5 current skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        },
        "soft": {
          "current": ["string"] (exactly 5 current skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        },
        "leadership": {
          "current": ["string"] (exactly 5 current skills),
          "required": ["string"] (exactly 5 skills needed for target role),
          "gaps": ["string"] (exactly 5 skills to develop)
        }
      },
      "developmentPlan": {
        "immediate": ["string"] (exactly 5 actions toward target role),
        "shortTerm": ["string"] (exactly 5 actions toward target role),
        "longTerm": ["string"] (exactly 5 actions toward target role)
      }
    }`,

  proCareerStrategy: `Develop a detailed strategy to reach the ${profile.desiredRole} position.
    
    Return JSON with:
    {
      "strategy": {
        "networking": ["string"] (exactly 5 networking strategies for target role),
        "upskilling": ["string"] (exactly 5 skill development strategies for target role),
        "visibility": ["string"] (exactly 5 visibility strategies in target field),
        "positioning": ["string"] (exactly 5 positioning strategies for target role)
      },
      "milestones": ["string"] (exactly 5 milestones toward target role),
      "actionPlan": {
        "30days": ["string"] (exactly 5 immediate actions toward target role),
        "90days": ["string"] (exactly 5 short-term actions toward target role),
        "180days": ["string"] (exactly 5 medium-term actions toward target role)
      }
    }`,

  proMarketPosition: `Analyze market positioning strategy for the ${profile.desiredRole} position.
    
    Return JSON with:
    {
      "marketDynamics": {
        "emergingTechnologies": ["string"] (exactly 5 technologies relevant to target role),
        "skillDemand": ["string"] (exactly 5 in-demand skills for target role),
        "compensationTrends": "string (detailed salary trends for target role)",
        "workCulture": "string (work culture in target role)"
      },
      "competitiveAnalysis": {
        "strengths": ["string"] (exactly 5 strengths needed for target role),
        "opportunities": ["string"] (exactly 5 opportunities in target role),
        "challenges": ["string"] (exactly 5 challenges to overcome)
      },
      "positioning": {
        "uniqueValue": ["string"] (exactly 5 differentiators for target role),
        "targetCompanies": ["string"] (exactly 5 companies hiring for target role),
        "networking": ["string"] (exactly 5 networking strategies for target role)
      }
    }`
});