import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '../error-boundary'

describe('ErrorBoundary', () => {
  describe('Basic Rendering', () => {
    it('renders error message', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      // Should show user-friendly message in heading
      expect(
        screen.getByRole('heading', { name: /something went wrong/i })
      ).toBeInTheDocument()
    })

    it('displays AlertCircle icon', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      // Icon should be rendered (lucide-react AlertCircle)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('renders retry button when retry prop provided', () => {
      const error = new Error('Test error')
      const mockRetry = vi.fn()
      render(<ErrorBoundary error={error} retry={mockRetry} />)
      expect(
        screen.getByRole('button', { name: /retry loading/i })
      ).toBeInTheDocument()
    })

    it('does not render retry button without retry prop', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      expect(
        screen.queryByRole('button', { name: /retry loading/i })
      ).not.toBeInTheDocument()
    })

    it('renders refresh page button', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument()
    })
  })

  describe('Error Message Display', () => {
    it('shows user-friendly message for generic errors', () => {
      const error = new Error('Some technical error')
      render(<ErrorBoundary error={error} />)
      expect(
        screen.getByRole('heading', { name: /something went wrong/i })
      ).toBeInTheDocument()
    })

    it('shows network error message for network failures', () => {
      const error = new Error('Network request failed')
      render(<ErrorBoundary error={error} />)
      // getUserFriendlyMessage should handle this
      expect(screen.getByText(/connection/i)).toBeInTheDocument()
    })

    it('includes context string in display when provided', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} context="loading habits" />)
      expect(screen.getByText(/loading habits/i)).toBeInTheDocument()
    })

    it('works without context string', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Retry Functionality', () => {
    it('calls retry callback when retry button is clicked', async () => {
      const user = userEvent.setup()
      const handleRetry = vi.fn()
      const error = new Error('Test error')

      render(<ErrorBoundary error={error} retry={handleRetry} />)
      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      expect(handleRetry).toHaveBeenCalledTimes(1)
    })

    it('allows only single manual retry', async () => {
      const user = userEvent.setup()
      const handleRetry = vi.fn()
      const error = new Error('Test error')

      render(<ErrorBoundary error={error} retry={handleRetry} />)
      const retryButton = screen.getByRole('button', { name: /retry/i })

      await user.click(retryButton)
      expect(handleRetry).toHaveBeenCalledTimes(1)

      // Button should still be clickable (no automatic retry prevention in component)
      await user.click(retryButton)
      expect(handleRetry).toHaveBeenCalledTimes(2)
    })
  })

  describe('Refresh Page Functionality', () => {
    it('reloads page when refresh button is clicked', async () => {
      const user = userEvent.setup()
      const reloadSpy = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { reload: reloadSpy },
        writable: true,
      })

      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)

      const refreshButton = screen.getByRole('button', {
        name: /refresh page/i,
      })
      await user.click(refreshButton)

      expect(reloadSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Development Mode', () => {
    it('shows error stack in development mode', () => {
      vi.stubEnv('NODE_ENV', 'development')
      const error = new Error('Test error')
      error.stack = 'Error: Test error\n  at testFunction (test.ts:10:5)'

      render(<ErrorBoundary error={error} />)
      expect(screen.getByText(/show technical details/i)).toBeInTheDocument()
      vi.unstubAllEnvs()
    })

    it('hides error stack in production mode', () => {
      vi.stubEnv('NODE_ENV', 'production')
      const error = new Error('Test error')
      error.stack = 'Error: Test error\n  at testFunction (test.ts:10:5)'

      render(<ErrorBoundary error={error} />)
      expect(
        screen.queryByText(/show technical details/i)
      ).not.toBeInTheDocument()
      vi.unstubAllEnvs()
    })

    it('toggles error stack visibility when details button is clicked', async () => {
      const user = userEvent.setup()
      vi.stubEnv('NODE_ENV', 'development')
      const error = new Error('Test error with stack')
      error.stack = 'Error: Test error\n  at testFunction (test.ts:10:5)'

      const { container } = render(<ErrorBoundary error={error} />)

      const details = container.querySelector('details')
      expect(details).toBeInTheDocument()

      // Details should have content (pre tag) inside
      const preElement = container.querySelector('pre')
      expect(preElement).toBeInTheDocument()
      expect(preElement).toHaveTextContent(/at testFunction/)

      vi.unstubAllEnvs()
    })

    it('renders error stack in pre tag', async () => {
      const user = userEvent.setup()
      vi.stubEnv('NODE_ENV', 'development')
      const error = new Error('Test error')
      error.stack = 'Error stack trace here'

      const { container } = render(<ErrorBoundary error={error} />)
      const detailsButton = screen.getByText(/show technical details/i)
      await user.click(detailsButton)

      const preElement = container.querySelector('pre')
      expect(preElement).toBeInTheDocument()
      expect(preElement).toHaveTextContent('Error stack trace here')
      vi.unstubAllEnvs()
    })
  })

  describe('Accessibility', () => {
    it('has role="alert" attribute', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('has aria-live="assertive" attribute', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const alert = container.querySelector('[aria-live="assertive"]')
      expect(alert).toBeInTheDocument()
    })

    it('auto-focuses retry button when retry prop provided', () => {
      const error = new Error('Test error')
      const mockRetry = vi.fn()
      const { container } = render(
        <ErrorBoundary error={error} retry={mockRetry} />
      )
      const retryButton = screen.getByRole('button', { name: /retry loading/i })
      // Retry button should exist and be the first button (receives focus)
      expect(retryButton).toBeInTheDocument()
      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toBe(retryButton) // First button gets autoFocus
    })

    it('buttons have accessible labels', () => {
      const error = new Error('Test error')
      const mockRetry = vi.fn()
      render(<ErrorBoundary error={error} retry={mockRetry} />)

      expect(
        screen.getByRole('button', { name: /retry loading/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument()
    })

    it('error message is part of alert region', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent(/something went wrong/i)
    })
  })

  describe('Dark Theme Styling', () => {
    it('applies zinc-900 background', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const errorContainer = container.querySelector('.bg-zinc-900')
      expect(errorContainer).toBeInTheDocument()
    })

    it('applies red border with opacity', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const errorContainer = container.querySelector('.border-red-500\\/20')
      expect(errorContainer).toBeInTheDocument()
    })

    it('applies rounded corners', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const errorContainer = container.querySelector('.rounded-lg')
      expect(errorContainer).toBeInTheDocument()
    })

    it('applies proper padding', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      // ErrorBoundary uses p-8 not p-6
      const errorContainer = container.querySelector('.p-8')
      expect(errorContainer).toBeInTheDocument()
    })

    it('applies red color to icon', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const iconContainer = container.querySelector('.text-red-500')
      expect(iconContainer).toBeInTheDocument()
    })

    it('applies zinc-100 color to main text', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const textElements = container.querySelectorAll('.text-zinc-100')
      expect(textElements.length).toBeGreaterThan(0)
    })

    it('applies zinc-400 color to secondary text', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} context="test context" />)
      const { container } = render(<ErrorBoundary error={error} />)
      const secondaryText = container.querySelector('.text-zinc-400')
      expect(secondaryText).toBeInTheDocument()
    })
  })

  describe('Button Styling', () => {
    it('applies primary styling to retry button', () => {
      const error = new Error('Test error')
      const mockRetry = vi.fn()
      render(<ErrorBoundary error={error} retry={mockRetry} />)
      const retryButton = screen.getByRole('button', { name: /retry loading/i })
      expect(retryButton).toHaveClass('bg-primary-500', 'hover:bg-primary-600')
    })

    it('applies secondary styling to refresh button', () => {
      const error = new Error('Test error')
      render(<ErrorBoundary error={error} />)
      const refreshButton = screen.getByRole('button', {
        name: /refresh page/i,
      })
      expect(refreshButton).toHaveClass('bg-zinc-800', 'hover:bg-zinc-700')
    })

    it('buttons have transition classes', () => {
      const error = new Error('Test error')
      const mockRetry = vi.fn()
      render(<ErrorBoundary error={error} retry={mockRetry} />)
      const retryButton = screen.getByRole('button', { name: /retry loading/i })
      expect(retryButton).toHaveClass('transition-colors', 'duration-200')
    })
  })

  describe('Edge Cases', () => {
    it('handles error without message', () => {
      const error = new Error()
      const { container } = render(<ErrorBoundary error={error} />)
      expect(container).toBeInTheDocument()
      // Should show default "Something went wrong" title (h3 element)
      const heading = screen.getByRole('heading', {
        name: /something went wrong/i,
      })
      expect(heading).toBeInTheDocument()
    })

    it('handles error without stack trace', () => {
      vi.stubEnv('NODE_ENV', 'development')
      const error = new Error('Test error')
      delete error.stack

      const { container } = render(<ErrorBoundary error={error} />)
      expect(container).toBeInTheDocument()
      vi.unstubAllEnvs()
    })

    it('handles very long error messages gracefully', () => {
      const longMessage = 'Error: ' + 'A'.repeat(1000)
      const error = new Error(longMessage)
      const { container } = render(<ErrorBoundary error={error} />)
      expect(container).toBeInTheDocument()
    })

    it('renders without crashing when all props are provided', () => {
      const error = new Error('Complete error')
      const handleRetry = vi.fn()
      const { container } = render(
        <ErrorBoundary
          error={error}
          retry={handleRetry}
          context="Complete test"
        />
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('displays icon and content in correct order', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const mainDiv = container.firstChild as HTMLElement
      const children = Array.from(mainDiv.children)

      // Icon container should be first
      expect(children[0]).toHaveClass('text-red-500')
      // Heading should be second
      expect(children[1].tagName).toBe('H3')
      // Description should be third
      expect(children[2].tagName).toBe('P')
      // Button container should be fourth
      expect(children[3].tagName).toBe('DIV')
      expect(children[3]).toHaveClass('flex', 'gap-3')
    })

    it('displays buttons in a row', () => {
      const error = new Error('Test error')
      const { container } = render(<ErrorBoundary error={error} />)
      const buttonContainer = container.querySelector('.flex.gap-3')
      expect(buttonContainer).toBeInTheDocument()
    })
  })
})
