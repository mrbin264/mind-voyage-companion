import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { WidgetCard } from '../widget-card'

describe('WidgetCard', () => {
  describe('Basic Rendering', () => {
    it('renders children content', () => {
      render(
        <WidgetCard>
          <div data-testid="content">Widget content</div>
        </WidgetCard>
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('renders without title or header', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      expect(container.querySelector('h3')).not.toBeInTheDocument()
    })

    it('applies default dark theme styling', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass(
        'bg-background-card',
        'border',
        'border-border-subtle',
        'rounded-xl'
      )
    })

    it('applies additional className', () => {
      const { container } = render(
        <WidgetCard className="custom-class">Content</WidgetCard>
      )
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('Title Section', () => {
    it('renders title when provided', () => {
      render(<WidgetCard title="Test Widget">Content</WidgetCard>)
      expect(
        screen.getByRole('heading', { name: /test widget/i })
      ).toBeInTheDocument()
    })

    it('renders subtitle when provided', () => {
      render(
        <WidgetCard title="Test Widget" subtitle="Test Subtitle">
          Content
        </WidgetCard>
      )
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('renders icon in header', () => {
      const icon = <span data-testid="test-icon">📝</span>
      render(
        <WidgetCard title="Test Widget" icon={icon}>
          Content
        </WidgetCard>
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('renders actions in header', () => {
      const actions = <button data-testid="action-button">Action</button>
      render(
        <WidgetCard title="Test Widget" actions={actions}>
          Content
        </WidgetCard>
      )
      expect(screen.getByTestId('action-button')).toBeInTheDocument()
    })

    it('renders actions without title', () => {
      const actions = <button data-testid="action-button">Action</button>
      render(<WidgetCard actions={actions}>Content</WidgetCard>)
      expect(screen.getByTestId('action-button')).toBeInTheDocument()
    })

    it('does not render header when no title or actions', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      expect(
        container.querySelector('.flex.items-start')
      ).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows SkeletonLoader when loading is true', () => {
      render(<WidgetCard loading={true}>Content</WidgetCard>)
      const skeleton = screen.getByRole('status')
      expect(skeleton).toBeInTheDocument()
    })

    it('does not show children when loading', () => {
      render(
        <WidgetCard loading={true}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('shows children when not loading', () => {
      render(
        <WidgetCard loading={false}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('shows ErrorBoundary when error is provided', () => {
      const error = new Error('Test error')
      render(<WidgetCard error={error}>Content</WidgetCard>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('does not show children when error exists', () => {
      const error = new Error('Test error')
      render(
        <WidgetCard error={error}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('error takes precedence over empty state', () => {
      const error = new Error('Test error')
      render(
        <WidgetCard
          error={error}
          empty={true}
          emptyConfig={{ message: 'No data' }}
        >
          Content
        </WidgetCard>
      )
      // Should show error, not empty state
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('shows EmptyState when empty is true and emptyConfig is provided', () => {
      render(
        <WidgetCard empty={true} emptyConfig={{ message: 'No data available' }}>
          Content
        </WidgetCard>
      )
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('does not show children when empty', () => {
      render(
        <WidgetCard empty={true} emptyConfig={{ message: 'No data' }}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('shows children when not empty', () => {
      render(
        <WidgetCard empty={false} emptyConfig={{ message: 'No data' }}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('does not show empty state when emptyConfig is missing', () => {
      render(
        <WidgetCard empty={true}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      // Should show children if emptyConfig is missing
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('State Priority (Loading > Error > Empty > Normal)', () => {
    it('loading takes precedence over all states', () => {
      const error = new Error('Test')
      render(
        <WidgetCard
          loading={true}
          error={error}
          empty={true}
          emptyConfig={{ message: 'Empty' }}
        >
          Content
        </WidgetCard>
      )
      // Should show loading skeleton
      const statuses = screen.getAllByRole('status')
      expect(statuses[0]).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/loading/i)
      )
    })

    it('error takes precedence over empty and normal', () => {
      const error = new Error('Test')
      render(
        <WidgetCard
          error={error}
          empty={true}
          emptyConfig={{ message: 'Empty' }}
        >
          Content
        </WidgetCard>
      )
      // Should show error alert
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.queryByText('Empty')).not.toBeInTheDocument()
    })

    it('empty takes precedence over normal', () => {
      render(
        <WidgetCard empty={true} emptyConfig={{ message: 'No data' }}>
          <div data-testid="content">Content</div>
        </WidgetCard>
      )
      // Should show empty state
      expect(screen.getByText('No data')).toBeInTheDocument()
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })

    it('shows normal content when no states are active', () => {
      render(
        <WidgetCard>
          <div data-testid="content">Normal content</div>
        </WidgetCard>
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('Responsive Padding', () => {
    it('applies default responsive padding', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-4', 'md:p-6')
    })

    it('removes padding when noPadding is true', () => {
      const { container } = render(
        <WidgetCard noPadding={true}>Content</WidgetCard>
      )
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('p-4')
      expect(card).not.toHaveClass('p-6')
    })

    it('applies padding when noPadding is false', () => {
      const { container } = render(
        <WidgetCard noPadding={false}>Content</WidgetCard>
      )
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-4', 'md:p-6')
    })
  })

  describe('Full Width Variant', () => {
    it('applies max-w-full by default', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('max-w-full')
    })

    it('does not apply max-w-full when fullWidth is true', () => {
      const { container } = render(
        <WidgetCard fullWidth={true}>Content</WidgetCard>
      )
      const card = container.firstChild as HTMLElement
      // fullWidth removes max-w constraint
      expect(card).not.toHaveClass('max-w-full')
    })
  })

  describe('Hover Effect', () => {
    it('applies hover shadow transition', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass(
        'transition-all',
        'duration-200',
        'hover:shadow-lg',
        'hover:shadow-black/20'
      )
    })
  })

  describe('Text Truncation', () => {
    it('applies truncate class to title', () => {
      render(<WidgetCard title="Test Title">Content</WidgetCard>)
      const title = screen.getByRole('heading')
      expect(title).toHaveClass('truncate')
    })

    it('shows tooltip title for long titles (>60 chars)', () => {
      const longTitle = 'A'.repeat(61)
      render(<WidgetCard title={longTitle}>Content</WidgetCard>)
      const title = screen.getByRole('heading')
      // Tooltip component wraps the title, so check aria-label instead
      expect(title).toHaveAttribute('aria-label', longTitle)
    })

    it('does not show tooltip for short titles (<60 chars)', () => {
      const shortTitle = 'Short Title'
      render(<WidgetCard title={shortTitle}>Content</WidgetCard>)
      const title = screen.getByRole('heading')
      // Short titles don't need tooltip or aria-label
      expect(title).not.toHaveAttribute('aria-label')
    })

    it('applies truncate class to subtitle', () => {
      render(
        <WidgetCard title="Title" subtitle="Subtitle">
          Content
        </WidgetCard>
      )
      const subtitle = screen.getByText('Subtitle')
      expect(subtitle).toHaveClass('truncate')
    })
  })

  describe('Complete Widget Examples', () => {
    it('renders complete widget with all features', () => {
      const icon = <span data-testid="icon">📊</span>
      const actions = <button data-testid="action">More</button>

      render(
        <WidgetCard
          title="Analytics Dashboard"
          subtitle="Last 7 days"
          icon={icon}
          actions={actions}
          className="custom-class"
        >
          <div data-testid="content">Dashboard content</div>
        </WidgetCard>
      )

      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Last 7 days')).toBeInTheDocument()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByTestId('action')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('renders minimal widget', () => {
      render(
        <WidgetCard>
          <div data-testid="content">Simple content</div>
        </WidgetCard>
      )
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('renders widget with loading state', () => {
      render(
        <WidgetCard title="Loading Widget" loading={true}>
          Content
        </WidgetCard>
      )
      expect(screen.getByText('Loading Widget')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('renders widget with error state', () => {
      const error = new Error('Failed to load')
      render(
        <WidgetCard title="Error Widget" error={error}>
          Content
        </WidgetCard>
      )
      expect(screen.getByText('Error Widget')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders widget with empty state', () => {
      render(
        <WidgetCard
          title="Empty Widget"
          empty={true}
          emptyConfig={{
            message: 'No data available',
            description: 'Try adding some content',
          }}
        >
          Content
        </WidgetCard>
      )
      expect(screen.getByText('Empty Widget')).toBeInTheDocument()
      expect(screen.getByText('No data available')).toBeInTheDocument()
      expect(screen.getByText('Try adding some content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic heading for title', () => {
      render(<WidgetCard title="Widget Title">Content</WidgetCard>)
      const heading = screen.getByRole('heading', { name: /widget title/i })
      expect(heading.tagName).toBe('H3')
    })

    it('hides icon from screen readers', () => {
      const icon = <span data-testid="icon">Icon</span>
      const { container } = render(
        <WidgetCard title="Title" icon={icon}>
          Content
        </WidgetCard>
      )
      const iconContainer = container.querySelector('[aria-hidden="true"]')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Dark Theme Styling', () => {
    it('applies background-card color', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-background-card')
    })

    it('applies border-subtle color', () => {
      const { container } = render(<WidgetCard>Content</WidgetCard>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('border-border-subtle')
    })

    it('applies zinc-100 color to title', () => {
      render(<WidgetCard title="Title">Content</WidgetCard>)
      const title = screen.getByRole('heading')
      expect(title).toHaveClass('text-zinc-100')
    })

    it('applies zinc-400 color to subtitle', () => {
      render(
        <WidgetCard title="Title" subtitle="Subtitle">
          Content
        </WidgetCard>
      )
      const subtitle = screen.getByText('Subtitle')
      expect(subtitle).toHaveClass('text-zinc-400')
    })

    it('applies zinc-400 color to icon', () => {
      const icon = <span data-testid="icon">Icon</span>
      const { container } = render(
        <WidgetCard title="Title" icon={icon}>
          Content
        </WidgetCard>
      )
      const iconContainer = container.querySelector('.text-zinc-400')
      expect(iconContainer).toBeInTheDocument()
    })
  })
})
