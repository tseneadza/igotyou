import { describe, it, expect } from 'vitest'
import { extractDraftFromResponse, hasDraftMarkers, VALID_CATEGORIES } from './parser'

describe('AI Parser', () => {
  describe('extractDraftFromResponse', () => {
    it('should extract title from structured draft', () => {
      // Arrange
      const response = `---DRAFT---
Title: Better Parental Leave Policy
Target: HR Director
Category: BENEFITS
Description:
We need better parental leave.
---END DRAFT---`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBe('Better Parental Leave Policy')
    })

    it('should extract all fields from complete draft', () => {
      // Arrange
      const response = `---DRAFT---
Title: Improve Remote Work Policy
Target: CEO John Smith
Category: REMOTE_WORK
Description:
We are requesting a more flexible remote work policy that allows employees to work from home at least 3 days per week.
---END DRAFT---`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBe('Improve Remote Work Policy')
      expect(result.target).toBe('CEO John Smith')
      expect(result.category).toBe('REMOTE_WORK')
      expect(result.description).toContain('flexible remote work policy')
    })

    it('should handle response without END marker', () => {
      // Arrange
      const response = `---DRAFT---
Title: Safety Improvements Needed
Target: Facilities Manager
Category: WORKPLACE_SAFETY
Description:
Our workplace needs better safety equipment.`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBe('Safety Improvements Needed')
      expect(result.category).toBe('WORKPLACE_SAFETY')
    })

    it('should extract from response without DRAFT markers', () => {
      // Arrange
      const response = `Here's a draft for your petition:

Title: Fair Pay for All
Target: Compensation Committee
Category: PAY_EQUITY
Description:
We demand equal pay for equal work.`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBe('Fair Pay for All')
      expect(result.target).toBe('Compensation Committee')
    })

    it('should remove asterisks from title', () => {
      // Arrange
      const response = `Title: **Bold Title Here**
Target: Manager
Category: OTHER`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBe('Bold Title Here')
    })

    it('should validate category against allowed values', () => {
      // Arrange
      const response = `Title: Test
Target: Boss
Category: INVALID_CATEGORY`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.category).toBeUndefined()
    })

    it('should accept all valid categories', () => {
      VALID_CATEGORIES.forEach(category => {
        // Arrange
        const response = `Title: Test
Target: Boss
Category: ${category}`
        
        // Act
        const result = extractDraftFromResponse(response)
        
        // Assert
        expect(result.category).toBe(category)
      })
    })

    it('should return empty object for unstructured response', () => {
      // Arrange
      const response = 'I need more information about your workplace issue.'
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.title).toBeUndefined()
      expect(result.target).toBeUndefined()
      expect(result.category).toBeUndefined()
      expect(result.description).toBeUndefined()
    })

    it('should handle multi-line descriptions', () => {
      // Arrange
      const response = `---DRAFT---
Title: Better Benefits
Target: HR
Category: BENEFITS
Description:
Line 1 of description.

Line 2 of description with more details.

- Bullet point 1
- Bullet point 2
---END DRAFT---`
      
      // Act
      const result = extractDraftFromResponse(response)
      
      // Assert
      expect(result.description).toContain('Line 1')
      expect(result.description).toContain('Line 2')
      expect(result.description).toContain('Bullet point')
    })
  })

  describe('hasDraftMarkers', () => {
    it('should return true for response with DRAFT markers', () => {
      // Arrange
      const response = '---DRAFT---\nTitle: Test\n---END DRAFT---'
      
      // Act & Assert
      expect(hasDraftMarkers(response)).toBe(true)
    })

    it('should return true for response with Title:', () => {
      // Arrange
      const response = 'Here is your draft:\nTitle: My Petition'
      
      // Act & Assert
      expect(hasDraftMarkers(response)).toBe(true)
    })

    it('should return false for conversational response', () => {
      // Arrange
      const response = 'Can you tell me more about your workplace issue?'
      
      // Act & Assert
      expect(hasDraftMarkers(response)).toBe(false)
    })
  })
})
