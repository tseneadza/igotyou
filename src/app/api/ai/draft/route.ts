import { NextRequest, NextResponse } from 'next/server'
import { processAIDraftMessage } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a mock response for development
      return NextResponse.json({
        success: true,
        response: getMockResponse(message, history?.length || 0),
        suggestedDraft: history?.length >= 3 ? getMockDraft() : undefined,
      })
    }
    
    const result = await processAIDraftMessage(message, history || [])
    
    return NextResponse.json({
      success: true,
      response: result.response,
      suggestedDraft: result.suggestedDraft,
    })
  } catch (error) {
    console.error('Error in AI draft:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

// Mock responses for development without OpenAI key
function getMockResponse(message: string, turnCount: number): string {
  const responses = [
    "That's a great issue to address! Can you tell me more about your company and who specifically should be targeted with this petition? (CEO, HR Director, Board of Directors, etc.)",
    "I understand. Let me help you craft a compelling petition. What specific changes or outcomes are you hoping to achieve? Be as specific as possible.",
    "Perfect! Based on what you've told me, here's a draft for your petition:\n\n**Title:** Employees Demand [Your Issue] at [Company]\n\n**Description:** We, the employees of [Company], are calling for immediate action on [issue]. This matter affects [describe impact] and we believe [proposed solution] is both reasonable and necessary.\n\n**Target:** [Appropriate decision maker]\n\nWould you like me to refine this further?",
  ]
  
  return responses[Math.min(turnCount, responses.length - 1)]
}

function getMockDraft() {
  return {
    title: 'Employees Demand Better Work-Life Balance',
    description: 'We, the employees, are calling for flexible work arrangements that support both productivity and personal well-being. Studies show that flexible work options increase employee satisfaction and retention while maintaining or improving productivity.',
    target: 'Human Resources Director',
    category: 'REMOTE_WORK' as const,
  }
}
