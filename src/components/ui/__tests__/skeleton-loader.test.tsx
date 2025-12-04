import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SkeletonLoader } from '../skeleton-loader'

describe('SkeletonLoader', () => {
  describe('Variants', () => {
    it('renders dashboard-widget variant with correct structure', () => {
      const { container } = render(
        <SkeletonLoader variant="dashboard-widget" />
      )

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have skeleton with p-6 and space-y-4
      const skeleton = container.querySelector('.p-6.space-y-4')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('bg-zinc-800', 'rounded-lg', 'animate-pulse')

      // Should have header, content, and footer lines
      const headerLine = container.querySelector('.h-6')
      expect(headerLine).toBeInTheDocument()
    })

    it('renders habit-card variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="habit-card" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have icon skeleton (rounded-full)
      const iconSkeleton = container.querySelector('.h-10.w-10')
      expect(iconSkeleton).toBeInTheDocument()
      expect(iconSkeleton).toHaveClass('bg-zinc-700', 'rounded-full')
    })

    it('renders chart variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="chart" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have h-64 chart container
      const chartContainer = container.querySelector('.h-64')
      expect(chartContainer).toBeInTheDocument()
    })

    it('renders analytics variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="analytics" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have p-6 space-y-4
      const skeleton = container.querySelector('.p-6.space-y-4')
      expect(skeleton).toBeInTheDocument()
    })

    it('renders list-item variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="list-item" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have avatar skeleton
      const avatarSkeleton = container.querySelector('.h-8.w-8')
      expect(avatarSkeleton).toBeInTheDocument()
      expect(avatarSkeleton).toHaveClass('rounded-full')
    })

    it('renders avatar variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="avatar" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should be circular with h-10 w-10
      const avatar = container.querySelector('.h-10.w-10.rounded-full')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveClass('bg-zinc-800', 'animate-pulse')
    })

    it('renders text-line variant with correct structure', () => {
      const { container } = render(<SkeletonLoader variant="text-line" />)

      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should be a single line with h-4
      const textLine = container.querySelector('.h-4.w-full')
      expect(textLine).toBeInTheDocument()
      expect(textLine).toHaveClass('bg-zinc-800', 'rounded-lg')
    })
  })

  describe('Count Prop', () => {
    it('renders single skeleton by default', () => {
      const { container } = render(<SkeletonLoader variant="text-line" />)
      // Only one wrapper with role="status"
      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()
      // Should have one skeleton element
      const skeletons = container.querySelectorAll('.h-4.w-full')
      expect(skeletons).toHaveLength(1)
    })

    it('renders multiple skeletons when count is specified', () => {
      const { container } = render(
        <SkeletonLoader variant="text-line" count={3} />
      )
      // Still only one wrapper with role="status"
      const wrappers = container.querySelectorAll('[role="status"]')
      expect(wrappers).toHaveLength(1)
      // But should have 3 skeleton elements
      const skeletons = container.querySelectorAll('.h-4.w-full')
      expect(skeletons).toHaveLength(3)
    })

    it('renders correct number of skeletons with count=5', () => {
      const { container } = render(
        <SkeletonLoader variant="text-line" count={5} />
      )
      const skeletons = container.querySelectorAll('.h-4.w-full')
      expect(skeletons).toHaveLength(5)
    })

    it('renders spacing between multiple skeletons', () => {
      const { container } = render(
        <SkeletonLoader variant="list-item" count={2} />
      )
      // Check for mb-4 class on skeleton wrappers
      const wrappers = container.querySelectorAll('.mb-4')
      expect(wrappers.length).toBeGreaterThan(0)
    })
  })

  describe('Animate Prop', () => {
    it('applies animate-pulse class by default', () => {
      const { container } = render(<SkeletonLoader variant="text-line" />)
      const skeleton = container.querySelector('.h-4.w-full')
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('applies animate-pulse when animate is true', () => {
      const { container } = render(
        <SkeletonLoader variant="text-line" animate={true} />
      )
      const skeleton = container.querySelector('.h-4.w-full')
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('removes animate-pulse when animate is false', () => {
      const { container } = render(
        <SkeletonLoader variant="text-line" animate={false} />
      )
      const skeleton = container.querySelector('.h-4.w-full')
      expect(skeleton).not.toHaveClass('animate-pulse')
    })
  })

  describe('Accessibility', () => {
    it('has role="status" attribute', () => {
      render(<SkeletonLoader variant="dashboard-widget" />)
      const skeleton = screen.getByRole('status')
      expect(skeleton).toBeInTheDocument()
    })

    it('has aria-live="polite" attribute', () => {
      const { container } = render(
        <SkeletonLoader variant="dashboard-widget" />
      )
      const skeleton = container.querySelector('[aria-live="polite"]')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for dashboard-widget', () => {
      render(<SkeletonLoader variant="dashboard-widget" />)
      const skeleton = screen.getByLabelText('Loading dashboard widget')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for habit-card', () => {
      render(<SkeletonLoader variant="habit-card" />)
      const skeleton = screen.getByLabelText('Loading habit card')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for chart', () => {
      render(<SkeletonLoader variant="chart" />)
      const skeleton = screen.getByLabelText('Loading chart')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for analytics', () => {
      render(<SkeletonLoader variant="analytics" />)
      const skeleton = screen.getByLabelText('Loading analytics')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for list-item', () => {
      render(<SkeletonLoader variant="list-item" />)
      const skeleton = screen.getByLabelText('Loading list item')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for avatar', () => {
      render(<SkeletonLoader variant="avatar" />)
      const skeleton = screen.getByLabelText('Loading avatar')
      expect(skeleton).toBeInTheDocument()
    })

    it('has descriptive aria-label for text-line', () => {
      render(<SkeletonLoader variant="text-line" />)
      const skeleton = screen.getByLabelText('Loading text line')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Dark Theme Styling', () => {
    it('applies zinc-800 background color', () => {
      const { container } = render(<SkeletonLoader variant="text-line" />)
      const skeleton = container.querySelector('.bg-zinc-800')
      expect(skeleton).toBeInTheDocument()
    })

    it('applies rounded corners to elements', () => {
      const { container } = render(
        <SkeletonLoader variant="dashboard-widget" />
      )
      const roundedElements = container.querySelectorAll('.rounded-lg')
      expect(roundedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles count=0 gracefully', () => {
      const { container } = render(
        <SkeletonLoader variant="text-line" count={0} />
      )
      // With count=0, Array(0) creates empty array, so no skeletons rendered
      const skeletons = container.querySelectorAll('.h-4.w-full')
      expect(skeletons).toHaveLength(0)
    })

    it('handles count=1 same as default', () => {
      const { container: container1 } = render(
        <SkeletonLoader variant="text-line" />
      )
      const { container: container2 } = render(
        <SkeletonLoader variant="text-line" count={1} />
      )

      // Both should render exactly one skeleton element
      const skeletons1 = container1.querySelectorAll('.h-4.w-full')
      const skeletons2 = container2.querySelectorAll('.h-4.w-full')

      expect(skeletons1).toHaveLength(1)
      expect(skeletons2).toHaveLength(1)
    })

    it('renders correctly without animate prop', () => {
      const { container } = render(<SkeletonLoader variant="text-line" />)
      const wrapper = container.querySelector('[role="status"]')
      expect(wrapper).toBeInTheDocument()

      // Should have animate-pulse by default
      const skeleton = container.querySelector('.h-4.w-full')
      expect(skeleton).toHaveClass('animate-pulse')
    })
  })
})
