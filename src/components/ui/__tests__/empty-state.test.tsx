import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmptyState } from '../empty-state'

describe('EmptyState', () => {
  describe('Basic Rendering', () => {
    it('renders message text', () => {
      render(<EmptyState message="No data available" />)
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('renders message as heading', () => {
      render(<EmptyState message="No habits yet" />)
      const heading = screen.getByRole('heading', { name: /no habits yet/i })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H3')
    })

    it('renders without icon', () => {
      const { container } = render(<EmptyState message="Test message" />)
      const icon = container.querySelector('.text-zinc-500')
      expect(icon).not.toBeInTheDocument()
    })

    it('renders without description', () => {
      render(<EmptyState message="Test message" />)
      expect(screen.queryByText(/./)).toBeInTheDocument()
      // Only message should be visible
      expect(screen.getAllByText(/./)).toHaveLength(1)
    })

    it('renders without action button', () => {
      render(<EmptyState message="Test message" />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Icon Rendering', () => {
    it('renders custom icon element', () => {
      const icon = <span data-testid="custom-icon">📝</span>
      render(<EmptyState message="Test message" icon={icon} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('applies correct styling to icon container', () => {
      const icon = <span data-testid="test-icon">Icon</span>
      const { container } = render(
        <EmptyState message="Test message" icon={icon} />
      )
      const iconContainer = container.querySelector('.text-zinc-500')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass('mb-4')
    })
  })

  describe('Description Rendering', () => {
    it('renders description text', () => {
      render(
        <EmptyState
          message="No habits"
          description="Start tracking your first habit"
        />
      )
      expect(
        screen.getByText('Start tracking your first habit')
      ).toBeInTheDocument()
    })

    it('applies correct styling to description', () => {
      render(<EmptyState message="Test" description="Test description" />)
      const description = screen.getByText('Test description')
      expect(description).toHaveClass('text-sm', 'text-zinc-400', 'mb-6')
    })

    it('constrains description width', () => {
      render(<EmptyState message="Test" description="Test description" />)
      const description = screen.getByText('Test description')
      expect(description).toHaveClass('max-w-sm')
    })
  })

  describe('Action Button', () => {
    it('renders action button with label', () => {
      const action = {
        label: 'Create Habit',
        onClick: vi.fn(),
      }
      render(<EmptyState message="No habits" action={action} />)
      expect(
        screen.getByRole('button', { name: /create habit/i })
      ).toBeInTheDocument()
    })

    it('calls onClick handler when button is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      const action = {
        label: 'Add Item',
        onClick: handleClick,
      }

      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button', { name: /add item/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders primary button variant by default', () => {
      const action = {
        label: 'Add Item',
        onClick: vi.fn(),
      }
      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button', { name: /add item/i })
      expect(button).toHaveClass('bg-primary-500', 'hover:bg-primary-600')
    })

    it('renders secondary button variant when specified', () => {
      const action = {
        label: 'Add Item',
        onClick: vi.fn(),
        variant: 'secondary' as const,
      }
      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button', { name: /add item/i })
      expect(button).toHaveClass('bg-zinc-800', 'hover:bg-zinc-700')
    })

    it('has proper button styling', () => {
      const action = {
        label: 'Test',
        onClick: vi.fn(),
      }
      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'px-4',
        'py-2',
        'rounded-lg',
        'font-medium',
        'transition-colors',
        'duration-200'
      )
    })

    it('supports multiple clicks', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      const action = {
        label: 'Click Me',
        onClick: handleClick,
      }

      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button')

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Variant Sizing', () => {
    it('applies default variant padding by default', () => {
      const { container } = render(<EmptyState message="Test" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('py-12')
    })

    it('applies default variant padding when explicitly specified', () => {
      const { container } = render(
        <EmptyState message="Test" variant="default" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('py-12')
    })

    it('applies compact variant padding', () => {
      const { container } = render(
        <EmptyState message="Test" variant="compact" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('py-8')
    })

    it('applies consistent layout classes regardless of variant', () => {
      const { container: container1 } = render(
        <EmptyState message="Test" variant="default" />
      )
      const { container: container2 } = render(
        <EmptyState message="Test" variant="compact" />
      )

      const wrapper1 = container1.firstChild as HTMLElement
      const wrapper2 = container2.firstChild as HTMLElement

      expect(wrapper1).toHaveClass('flex', 'flex-col', 'items-center')
      expect(wrapper2).toHaveClass('flex', 'flex-col', 'items-center')
    })
  })

  describe('Accessibility', () => {
    it('has role="status" attribute', () => {
      render(<EmptyState message="No data" />)
      const element = screen.getByRole('status')
      expect(element).toBeInTheDocument()
    })

    it('has aria-label matching message', () => {
      render(<EmptyState message="No habits yet" />)
      const element = screen.getByLabelText('No habits yet')
      expect(element).toBeInTheDocument()
    })

    it('button has accessible label', () => {
      const action = {
        label: 'Create New',
        onClick: vi.fn(),
      }
      render(<EmptyState message="Empty" action={action} />)
      const button = screen.getByRole('button', { name: /create new/i })
      expect(button).toHaveAttribute('aria-label', 'Create New')
    })

    it('heading is properly structured in document', () => {
      render(<EmptyState message="Test Heading" />)
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Test Heading')
    })
  })

  describe('Complete Examples', () => {
    it('renders complete empty state with all props', () => {
      const icon = <span data-testid="icon">📋</span>
      const action = {
        label: 'Get Started',
        onClick: vi.fn(),
        variant: 'secondary' as const,
      }

      render(
        <EmptyState
          icon={icon}
          message="No journal entries"
          description="Start documenting your journey today"
          action={action}
          variant="compact"
        />
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('No journal entries')).toBeInTheDocument()
      expect(
        screen.getByText('Start documenting your journey today')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /get started/i })
      ).toBeInTheDocument()
    })

    it('renders minimal empty state with only message', () => {
      const { container } = render(<EmptyState message="No data" />)

      expect(screen.getByText('No data')).toBeInTheDocument()
      expect(container.querySelector('.text-zinc-500')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Dark Theme Styling', () => {
    it('applies zinc-100 color to message heading', () => {
      render(<EmptyState message="Test" />)
      const heading = screen.getByRole('heading')
      expect(heading).toHaveClass('text-zinc-100')
    })

    it('applies zinc-400 color to description', () => {
      render(<EmptyState message="Test" description="Description text" />)
      const description = screen.getByText('Description text')
      expect(description).toHaveClass('text-zinc-400')
    })

    it('applies zinc-500 color to icon container', () => {
      const icon = <span data-testid="icon">Icon</span>
      const { container } = render(<EmptyState message="Test" icon={icon} />)
      const iconContainer = container.querySelector('.text-zinc-500')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Layout and Alignment', () => {
    it('centers content horizontally and vertically', () => {
      const { container } = render(<EmptyState message="Test" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      )
    })

    it('centers text content', () => {
      const { container } = render(<EmptyState message="Test" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('text-center')
    })
  })
})
