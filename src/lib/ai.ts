import OpenAI from 'openai'
import type { AIDraftMessage, AIDraftSession, AIStrategyTip, PetitionCategory } from '@/types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt for the AI drafting assistant
const SYSTEM_PROMPT = `You are an expert petition writing assistant for IGotYou, a workplace advocacy platform. 
Your role is to help employees create effective, compelling petitions that are more likely to succeed.

Guidelines:
1. Ask 1-2 clarifying questions to understand the issue fully (don't ask too many!)
2. Help craft clear, specific, and actionable petition titles
3. Write professional but passionate descriptions
4. Suggest appropriate targets (CEO, HR, Board, specific managers)
5. Be empathetic and supportive - workplace issues can be stressful
6. Never encourage illegal actions

IMPORTANT: After gathering enough information (usually after 1-2 exchanges), present a complete draft using this EXACT format:

---DRAFT---
Title: [Compelling petition title]
Target: [Who should act - e.g., "CEO Jane Smith" or "HR Director"]
Category: [One of: PAY_EQUITY, BENEFITS, WORKPLACE_SAFETY, REMOTE_WORK, LAYOFFS, HARASSMENT, DISCRIMINATION, UNION, POLICY_CHANGE, ENVIRONMENTAL, OTHER]
Description:
[Full petition description with:
- Clear statement of the problem
- Why it matters to employees
- Specific change being requested
- Call to action]
---END DRAFT---

After presenting the draft, ask if they'd like any changes. Be ready to revise based on feedback.`

/**
 * Process a message in the AI drafting conversation
 */
export async function processAIDraftMessage(
  userMessage: string,
  conversationHistory: AIDraftMessage[]
): Promise<{
  response: string
  suggestedDraft?: {
    title?: string
    description?: string
    target?: string
    category?: PetitionCategory
  }
}> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // Faster than GPT-4, good for drafting
    messages,
    temperature: 0.7,
    max_tokens: 800,  // Reduced for faster responses
  })

  const response = completion.choices[0]?.message?.content || 'I apologize, I encountered an error. Please try again.'

  // Check if the response contains a draft (indicated by specific markers)
  let suggestedDraft: { title?: string; description?: string; target?: string; category?: PetitionCategory } | undefined

  // Parse draft if markers are present
  if (response.includes('---DRAFT---') || response.includes('Title:')) {
    suggestedDraft = extractDraftFromResponse(response)
  }

  return { response, suggestedDraft }
}

/**
 * Predict success probability for a petition
 */
export async function predictPetitionSuccess(
  title: string,
  description: string,
  target: string,
  category: PetitionCategory,
  company?: string
): Promise<{
  score: number
  reasoning: string
  tips: AIStrategyTip[]
}> {
  const prompt = `Analyze this workplace petition and predict its likelihood of success on a scale of 0-100:

Title: ${title}
Description: ${description}
Target: ${target}
Category: ${category}
${company ? `Company: ${company}` : ''}

Provide:
1. A success probability score (0-100)
2. Brief reasoning for the score
3. 2-3 specific tips to improve success chances

Format your response as JSON:
{
  "score": <number>,
  "reasoning": "<string>",
  "tips": [
    {"type": "timing|target|content|threshold|escalation", "title": "<string>", "description": "<string>", "priority": "high|medium|low"}
  ]
}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // Faster model for predictions
    messages: [
      { role: 'system', content: 'You are an expert in workplace organizing and petition effectiveness. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0]?.message?.content || '{}'
  
  try {
    const result = JSON.parse(content)
    return {
      score: Math.min(100, Math.max(0, result.score || 50)) / 100,
      reasoning: result.reasoning || 'Unable to analyze petition.',
      tips: result.tips || [],
    }
  } catch {
    return {
      score: 0.5,
      reasoning: 'Unable to analyze petition at this time.',
      tips: [],
    }
  }
}

/**
 * Get strategy tips for an active petition
 */
export async function getStrategyTips(
  petition: {
    title: string
    description: string
    target: string
    category: PetitionCategory
    signatureCount: number
    goal: number
    daysActive: number
  }
): Promise<AIStrategyTip[]> {
  const prompt = `Analyze this active workplace petition and provide strategic advice:

Title: ${petition.title}
Target: ${petition.target}
Category: ${petition.category}
Progress: ${petition.signatureCount}/${petition.goal} signatures (${Math.round(petition.signatureCount / petition.goal * 100)}%)
Days Active: ${petition.daysActive}

Provide 3-5 actionable tips to help this petition succeed. Consider timing, outreach strategies, escalation options, and momentum building.

Format as JSON array:
[{"type": "timing|target|content|threshold|escalation", "title": "<string>", "description": "<string>", "priority": "high|medium|low"}]`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // Faster model for strategy tips
    messages: [
      { role: 'system', content: 'You are an expert in workplace organizing. Respond only with valid JSON array.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 400,
  })

  const content = completion.choices[0]?.message?.content || '[]'
  
  try {
    return JSON.parse(content)
  } catch {
    return []
  }
}

// Valid category values
const VALID_CATEGORIES: PetitionCategory[] = [
  'PAY_EQUITY', 'BENEFITS', 'WORKPLACE_SAFETY', 'REMOTE_WORK', 
  'LAYOFFS', 'HARASSMENT', 'DISCRIMINATION', 'UNION', 
  'POLICY_CHANGE', 'ENVIRONMENTAL', 'OTHER'
]

// Helper function to extract draft from AI response
function extractDraftFromResponse(response: string): {
  title?: string
  description?: string
  target?: string
  category?: PetitionCategory
} {
  const draft: { title?: string; description?: string; target?: string; category?: PetitionCategory } = {}
  
  // Try to extract from the ---DRAFT--- section first
  const draftSection = response.match(/---DRAFT---\s*([\s\S]*?)(?:---END DRAFT---|$)/i)
  const textToSearch = draftSection ? draftSection[1] : response
  
  // Extract title
  const titleMatch = textToSearch.match(/Title:\s*(.+?)(?:\n|$)/i)
  if (titleMatch) draft.title = titleMatch[1].trim().replace(/^\*+|\*+$/g, '')  // Remove asterisks
  
  // Extract target (before Description)
  const targetMatch = textToSearch.match(/Target:\s*(.+?)(?:\n|$)/i)
  if (targetMatch) draft.target = targetMatch[1].trim().replace(/^\*+|\*+$/g, '')
  
  // Extract category
  const categoryMatch = textToSearch.match(/Category:\s*(.+?)(?:\n|$)/i)
  if (categoryMatch) {
    const rawCategory = categoryMatch[1].trim().toUpperCase().replace(/[^A-Z_]/g, '')
    if (VALID_CATEGORIES.includes(rawCategory as PetitionCategory)) {
      draft.category = rawCategory as PetitionCategory
    }
  }
  
  // Extract description (everything after "Description:" until end of draft or next section)
  const descMatch = textToSearch.match(/Description:\s*\n?([\s\S]*?)(?:---END DRAFT---|$)/i)
  if (descMatch) {
    draft.description = descMatch[1].trim()
  }
  
  return draft
}

export type { AIDraftSession }
