import OpenAI from 'openai';

const MODEL = 'gpt-4o';

// Updated token limits to stay within model constraints
const TOKEN_LIMITS = {
  free: 4000,     // Basic analysis
  pro: 8000,      // Enhanced analysis
  premium: 16000, // Maximum depth analysis (model limit)
  admin: 16000    // Same as premium
};

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function createCompletion(
  systemPrompt: string,
  userPrompt: string,
  userRole: 'free' | 'pro' | 'premium' | 'admin' = 'free'
) {
  const maxTokens = TOKEN_LIMITS[userRole];

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `${systemPrompt}
          CRITICAL REQUIREMENTS:
          - Response MUST be complete, valid JSON
          - Each response must be specific and comprehensive
          - All arrays must contain exactly the specified number of items
          - All content must be accurate and relevant
          - Never truncate or abbreviate responses`
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.8,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
    top_p: 0.95,
    frequency_penalty: 0.9,
    presence_penalty: 0.9
  });

  const result = response.choices[0].message.content;
  if (!result) throw new Error('No analysis generated');

  try {
    return JSON.parse(result);
  } catch (error) {
    console.error('Invalid JSON response:', result);
    throw new Error('Response was not valid JSON');
  }
}