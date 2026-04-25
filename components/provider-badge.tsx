'use client'

import { cn } from '@/lib/utils'
import { type Provider, providerColors } from '@/lib/mock-data'
import { getProviderDisplayName } from '@/lib/provider-urls'
import {
  CreditCard,
  Github,
  MessageSquare,
  FileText,
  Facebook,
  Boxes,
  ShoppingBag,
  Webhook,
} from 'lucide-react'

const providerIcons: Record<Provider, React.ElementType> = {
  stripe: CreditCard,
  github: Github,
  slack: MessageSquare,
  notion: FileText,
  meta: Facebook,
  linear: Boxes,
  shopify: ShoppingBag,
  custom: Webhook,
}

interface ProviderBadgeProps {
  provider: Provider
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ProviderBadge({ provider, className, showLabel = true, size = 'md' }: ProviderBadgeProps) {
  const colors = providerColors[provider]
  const Icon = providerIcons[provider]
  
  const iconSize = size === 'sm' ? 12 : 14
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium',
        size === 'sm' ? 'text-xs' : 'text-xs',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      <Icon size={iconSize} />
      {showLabel && getProviderDisplayName(provider)}
    </span>
  )
}

export function ProviderIcon({ provider, className }: { provider: Provider; className?: string }) {
  const Icon = providerIcons[provider]
  const colors = providerColors[provider]
  
  return <Icon className={cn('size-5', colors.text, className)} />
}
