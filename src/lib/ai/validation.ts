import { CareerProfileSchema, type CareerProfile } from '../types';
import similarity from 'similarity';

export function validateProfile(profile: CareerProfile): void {
  const result = CareerProfileSchema.safeParse(profile);
  if (!result.success) {
    throw new Error(`Invalid profile data: ${JSON.stringify(result.error.errors)}`);
  }
}

function checkSimilarity(str1: string, str2: string): boolean {
  return similarity(str1.toLowerCase(), str2.toLowerCase()) > 0.7;
}

function validateUniqueness(items: string[], context: string): void {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (checkSimilarity(items[i], items[j])) {
        throw new Error(`Found similar content in ${context}: "${items[i]}" and "${items[j]}"`);
      }
    }
  }
}

export function validateCareerPathResponse(parsedResult: any) {
  // Validate path description
  if (!parsedResult.path || parsedResult.path.split('.').length < 3) {
    throw new Error('Career path must contain at least 3 detailed sentences');
  }

  // Validate roles array exists and has required length
  if (!parsedResult.potentialRoles?.roles?.length) {
    throw new Error('Invalid career path analysis: missing roles array');
  }

  if (parsedResult.potentialRoles.roles.length < 2) {
    throw new Error('Invalid career path analysis: insufficient number of roles');
  }

  // Validate each role has unique information
  const roleDetails = parsedResult.potentialRoles.roles;
  const titles = new Set();
  const descriptions = new Set();
  const requirements = new Set();
  const salaryRanges = new Set();
  const trends = new Set();
  const opportunities = new Set();
  
  roleDetails.forEach((role: any, index: number) => {
    // Check for duplicate titles
    if (titles.has(role.title)) {
      throw new Error(`Duplicate role title found: ${role.title}`);
    }
    titles.add(role.title);

    // Check for similar descriptions
    const descriptions = roleDetails.map(r => r.description);
    validateUniqueness(descriptions, 'role descriptions');

    // Check for similar requirements
    const allRequirements = roleDetails.flatMap(r => r.requirements);
    validateUniqueness(allRequirements, 'role requirements');

    // Check for similar trends
    const allTrends = roleDetails.flatMap(r => r.trends);
    validateUniqueness(allTrends, 'role trends');

    // Check for similar opportunities
    const allOpportunities = roleDetails.flatMap(r => r.opportunities);
    validateUniqueness(allOpportunities, 'role opportunities');

    // Validate description length
    if (!role.description || role.description.split('.').length < 3) {
      throw new Error(`Role ${role.title} must have at least 3 detailed sentences in description`);
    }

    // Validate salary ranges are different
    if (salaryRanges.has(role.salary)) {
      throw new Error(`Duplicate salary range found: ${role.salary}`);
    }
    salaryRanges.add(role.salary);

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'requirements', 'timeToAchieve',
      'salary', 'growth', 'demand', 'trends', 'opportunities'
    ];

    requiredFields.forEach(field => {
      if (!role[field]) {
        throw new Error(`Missing required field '${field}' for role at index ${index}`);
      }
    });

    // Validate array lengths
    if (!Array.isArray(role.requirements) || role.requirements.length !== 3) {
      throw new Error(`Role ${role.title} must have exactly 3 unique requirements`);
    }
    if (!Array.isArray(role.trends) || role.trends.length !== 2) {
      throw new Error(`Role ${role.title} must have exactly 2 unique trends`);
    }
    if (!Array.isArray(role.opportunities) || role.opportunities.length !== 2) {
      throw new Error(`Role ${role.title} must have exactly 2 unique opportunities`);
    }

    // Validate content is role-specific
    if (!role.description.toLowerCase().includes(role.title.toLowerCase())) {
      throw new Error(`Description for ${role.title} must specifically mention the role`);
    }
  });

  // Extract role titles and details
  parsedResult.potentialRoles = roleDetails.map((role: any) => role.title);
  parsedResult.roleDetails = roleDetails;

  // Validate timeline arrays
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

  return parsedResult;
}