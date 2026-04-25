'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { type Provider, providerColors } from '@/lib/mock-data'
import { getProviderUrls, setProviderUrl, getAllProviders, getProviderDisplayName } from '@/lib/provider-urls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProviderIcon } from '@/components/provider-badge'
import { Check, Home } from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface ProviderCardProps {
  provider: Provider
  url: string
  onSave: (provider: Provider, url: string) => void
}

function ProviderCard({ provider, url, onSave }: ProviderCardProps) {
  const [value, setValue] = useState(url)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  useEffect(() => {
    setValue(url)
  }, [url])
  
  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave(provider, value)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  
  const isConfigured = url.length > 0
  const hasChanges = value !== url
  const colors = providerColors[provider]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border bg-card p-5',
        isConfigured ? 'border-border' : 'border-dashed border-zinc-700'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.bg)}>
            <ProviderIcon provider={provider} />
          </div>
          <div>
            <h3 className="font-medium">{getProviderDisplayName(provider)}</h3>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-2 rounded-full',
                  isConfigured ? 'bg-emerald-500' : 'bg-zinc-600'
                )}
              />
              <span className="text-xs text-muted-foreground">
                {isConfigured ? 'Configured' : 'Not configured'}
              </span>
            </div>
          </div>
        </div>
        
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <Check size={12} />
            Saved
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`https://your-backend.com/webhooks/${provider}`}
          className="flex-1 bg-background font-mono text-sm"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="min-w-[60px]"
        >
          {saving ? (
            <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </motion.div>
  )
}

export default function ProvidersPage() {
  const [urls, setUrls] = useState<Record<Provider, string>>({
    stripe: '',
    github: '',
    slack: '',
    notion: '',
    meta: '',
    linear: '',
    shopify: '',
    custom: '',
  })
  
  useEffect(() => {
    setUrls(getProviderUrls())
  }, [])
  
  const handleSave = (provider: Provider, url: string) => {
    setProviderUrl(provider, url)
    setUrls(prev => ({ ...prev, [provider]: url }))
  }
  
  const configuredCount = Object.values(urls).filter(url => url.length > 0).length
  
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1.5">
                  <Home size={14} />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Providers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Provider Webhook URLs</h1>
          <p className="mt-1 text-muted-foreground">
            Configure where HookLens should replay events for each provider.
            {configuredCount > 0 && (
              <span className="ml-1 text-emerald-400">
                {configuredCount} of {getAllProviders().length} configured
              </span>
            )}
          </p>
        </div>
        
        {/* Provider cards grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {getAllProviders().map((provider, index) => (
            <motion.div
              key={provider}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProviderCard
                provider={provider}
                url={urls[provider]}
                onSave={handleSave}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
