'use client'

import { callOutcomeStyles, callOutcomeLabels } from '@/lib/constants'

interface CallOutcomeBadgeProps {
  outcome: string | null
  className?: string
}

export default function CallOutcomeBadge({ outcome, className = '' }: CallOutcomeBadgeProps) {
  const key = outcome || ''
  const style = callOutcomeStyles[key] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
  const label = callOutcomeLabels[key] || outcome || 'Pending'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${style} ${className}`}>
      {label}
    </span>
  )
}
