import type { PetitionCategory } from '@/types'

// Valid category values
export const VALID_CATEGORIES: PetitionCategory[] = [
  'PAY_EQUITY', 'BENEFITS', 'WORKPLACE_SAFETY', 'REMOTE_WORK', 
  'LAYOFFS', 'HARASSMENT', 'DISCRIMINATION', 'UNION', 
  'POLICY_CHANGE', 'ENVIRONMENTAL', 'OTHER'
]

export interface ParsedDraft {
  title?: string
  description?: string
  target?: string
  category?: PetitionCategory
}

/**
 * Extracts draft content from AI response text
 * Looks for structured format with ---DRAFT--- markers or Title: fields
 */
export function extractDraftFromResponse(response: string): ParsedDraft {
  const draft: ParsedDraft = {}
  
  // Try to extract from the ---DRAFT--- section first
  const draftSection = response.match(/---DRAFT---\s*([\s\S]*?)(?:---END DRAFT---|$)/i)
  const textToSearch = draftSection ? draftSection[1] : response
  
  // Extract title
  const titleMatch = textToSearch.match(/Title:\s*(.+?)(?:\n|$)/i)
  if (titleMatch) {
    draft.title = cleanText(titleMatch[1])
  }
  
  // Extract target (before Description)
  const targetMatch = textToSearch.match(/Target:\s*(.+?)(?:\n|$)/i)
  if (targetMatch) {
    draft.target = cleanText(targetMatch[1])
  }
  
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

/**
 * Cleans text by removing markdown formatting artifacts
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/^\*+|\*+$/g, '')  // Remove asterisks
    .replace(/^#+\s*/, '')       // Remove heading markers
    .trim()
}

/**
 * Checks if a response contains draft markers
 */
export function hasDraftMarkers(response: string): boolean {
  return response.includes('---DRAFT---') || response.includes('Title:')
}
