'use client'

import { cn } from '@/lib/utils'
import { type EventStatus, statusColors } from '@/lib/mock-data'

interface StatusBadgeProps {
  status: EventStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = statusColors[status]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        colors.bg,
        colors.text,
        className
      )}
    >
      {status}
    </span>
  )
}
