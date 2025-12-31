import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      // Arrange & Act
      render(<Button>Click me</Button>)
      
      // Assert
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should apply primary variant by default', () => {
      // Arrange & Act
      render(<Button>Primary</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600')
    })

    it('should apply secondary variant styles', () => {
      // Arrange & Act
      render(<Button variant="secondary">Secondary</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100')
    })

    it('should apply success variant styles', () => {
      // Arrange & Act
      render(<Button variant="success">Success</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-emerald-600')
    })

    it('should apply danger variant styles', () => {
      // Arrange & Act
      render(<Button variant="danger">Danger</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })
  })

  describe('sizes', () => {
    it('should apply small size', () => {
      // Arrange & Act
      render(<Button size="sm">Small</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5')
    })

    it('should apply medium size by default', () => {
      // Arrange & Act
      render(<Button>Medium</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2.5')
    })

    it('should apply large size', () => {
      // Arrange & Act
      render(<Button size="lg">Large</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3')
    })
  })

  describe('states', () => {
    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(<Button disabled>Disabled</Button>)
      
      // Assert
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should be disabled when loading', () => {
      // Arrange & Act
      render(<Button isLoading>Loading</Button>)
      
      // Assert
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show loading spinner when isLoading is true', () => {
      // Arrange & Act
      render(<Button isLoading>Loading</Button>)
      
      // Assert
      const button = screen.getByRole('button')
      // The Loader2 icon should be present (it has animate-spin class)
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onClick when clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      // Act
      await user.click(screen.getByRole('button'))
      
      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      // Act
      await user.click(screen.getByRole('button'))
      
      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      // Arrange
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} isLoading>Loading</Button>)
      
      // Act
      await user.click(screen.getByRole('button'))
      
      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('icons', () => {
    it('should render left icon', () => {
      // Arrange & Act
      render(<Button leftIcon={<span data-testid="left-icon">←</span>}>With Icon</Button>)
      
      // Assert
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('should render right icon', () => {
      // Arrange & Act
      render(<Button rightIcon={<span data-testid="right-icon">→</span>}>With Icon</Button>)
      
      // Assert
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })

    it('should not render right icon when loading', () => {
      // Arrange & Act
      render(
        <Button isLoading rightIcon={<span data-testid="right-icon">→</span>}>
          Loading
        </Button>
      )
      
      // Assert
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
    })
  })
})
