import { CheckCircle2, Star } from 'lucide-react'

interface FeatureItemProps {
  type: 'core' | 'pro'
  text: string
}

export function FeatureItem({ type, text }: FeatureItemProps) {
  const Icon = type === 'core' ? CheckCircle2 : Star
  const iconClass =
    type === 'core'
      ? 'text-[var(--mv-color-success)]'
      : 'text-[var(--mv-accent-cyan)]'

  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${iconClass} flex-shrink-0`} />
      <span className="text-[var(--mv-color-text)]">{text}</span>
    </div>
  )
}
