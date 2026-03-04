'use client'

import { appointmentStatusStyles, appointmentStatusLabels } from '@/lib/constants'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() || ''
  const style = appointmentStatusStyles[normalizedStatus] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
  const label = appointmentStatusLabels[normalizedStatus] || status

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style} ${className}`}>
      {label}
    </span>
  )
}
