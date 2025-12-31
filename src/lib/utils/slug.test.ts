import { describe, it, expect } from 'vitest'
import { generateSlug, generateBaseSlug } from './slug'

describe('slug utilities', () => {
  describe('generateBaseSlug', () => {
    it('should convert title to lowercase', () => {
      // Arrange
      const title = 'My PETITION Title'
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('my-petition-title')
    })

    it('should replace spaces with hyphens', () => {
      // Arrange
      const title = 'Better Parental Leave'
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('better-parental-leave')
    })

    it('should remove special characters', () => {
      // Arrange
      const title = "We Need Better Pay! (Now)"
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('we-need-better-pay-now')
    })

    it('should trim leading/trailing hyphens', () => {
      // Arrange
      const title = '---Hello World---'
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('hello-world')
    })

    it('should respect maxLength parameter', () => {
      // Arrange
      const title = 'This is a very long petition title that should be truncated'
      
      // Act
      const result = generateBaseSlug(title, 20)
      
      // Assert
      expect(result.length).toBeLessThanOrEqual(20)
    })

    it('should handle empty string', () => {
      // Arrange
      const title = ''
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('')
    })

    it('should collapse multiple hyphens into one', () => {
      // Arrange
      const title = 'Multiple   Spaces   Here'
      
      // Act
      const result = generateBaseSlug(title)
      
      // Assert
      expect(result).toBe('multiple-spaces-here')
    })
  })

  describe('generateSlug', () => {
    it('should append a unique suffix', () => {
      // Arrange
      const title = 'My Petition'
      
      // Act
      const result = generateSlug(title)
      
      // Assert
      expect(result).toMatch(/^my-petition-[a-zA-Z0-9_-]{6}$/)
    })

    it('should generate different slugs for same title', () => {
      // Arrange
      const title = 'Same Title'
      
      // Act
      const slug1 = generateSlug(title)
      const slug2 = generateSlug(title)
      
      // Assert
      expect(slug1).not.toBe(slug2)
    })
  })
})
