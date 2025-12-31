import { NextRequest, NextResponse } from 'next/server'
import { predictPetitionSuccess } from '@/lib/ai'
import type { PetitionCategory } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, target, category, company } = body
    
    if (!title || !description || !target || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a mock response for development
      return NextResponse.json(getMockPrediction(category))
    }
    
    const prediction = await predictPetitionSuccess(
      title,
      description,
      target,
      category as PetitionCategory,
      company
    )
    
    return NextResponse.json(prediction)
  } catch (error) {
    console.error('Error in prediction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}

// Mock prediction for development
function getMockPrediction(category: string) {
  const categoryScores: Record<string, number> = {
    PAY_EQUITY: 0.45,
    BENEFITS: 0.55,
    WORKPLACE_SAFETY: 0.72,
    REMOTE_WORK: 0.68,
    LAYOFFS: 0.35,
    HARASSMENT: 0.58,
    DISCRIMINATION: 0.52,
    UNION: 0.42,
    POLICY_CHANGE: 0.61,
    ENVIRONMENTAL: 0.48,
    OTHER: 0.50,
  }
  
  const score = categoryScores[category] || 0.5
  
  return {
    score,
    reasoning: `Based on historical data, petitions in the ${category.toLowerCase().replace('_', ' ')} category have a ${Math.round(score * 100)}% success rate. Your petition has solid foundations but could be strengthened with more specific asks.`,
    tips: [
      {
        type: 'content',
        title: 'Add specific metrics',
        description: 'Petitions with concrete numbers (e.g., "30% of employees affected") perform 23% better.',
        priority: 'high',
      },
      {
        type: 'timing',
        title: 'Launch on Monday morning',
        description: 'Petitions launched Monday-Wednesday get 40% more signatures in the first week.',
        priority: 'medium',
      },
      {
        type: 'target',
        title: 'Consider adding secondary targets',
        description: 'Including the Board of Directors as a CC often accelerates responses.',
        priority: 'low',
      },
    ],
  }
}
