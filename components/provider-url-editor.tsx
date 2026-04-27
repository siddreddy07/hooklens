'use client'

import { useState, useEffect } from 'react'
import { type Provider } from '@/lib/mock-data'
import { getProviderUrl, setProviderUrl, getProviderDisplayName } from '@/lib/provider-urls'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Pencil, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

interface ProviderUrlEditorProps {
  provider: Provider
  onUrlChange?: (url: string) => void
  className?: string
}

export function ProviderUrlEditor({ provider, onUrlChange, className }: ProviderUrlEditorProps) {
  const [url, setUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    const loadUrl = async () => {
      const storedUrl = await getProviderUrl(provider)
      setUrl(storedUrl)
      setEditValue(storedUrl)
      setLoading(false)
    }
    loadUrl()
  }, [provider])
  
  const handleEdit = () => {
    setIsEditing(true)
    setEditValue(url)
  }
  
  const handleSave = async () => {
    setSaving(true)
    await setProviderUrl(provider, editValue)
    setUrl(editValue)
    setIsEditing(false)
    setSaved(true)
    onUrlChange?.(editValue)
    setSaving(false)
    setTimeout(() => setSaved(false), 1500)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(url)
  }
  
  const providerName = getProviderDisplayName(provider)
  const hasUrl = url.length > 0
  
  if (loading) {
    return (
      <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {providerName} Webhook URL
        </label>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <Check size={12} />
            Saved
          </span>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            type="url"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={`https://your-backend.com/webhooks/${provider}`}
            className="flex-1 bg-background font-mono text-sm"
            autoFocus
          />
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save'}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {hasUrl ? (
            <code className="flex-1 truncate rounded bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-300">
              {url}
            </code>
          ) : (
            <div className="flex flex-1 items-center gap-2 rounded border border-dashed border-amber-500/30 bg-amber-500/5 px-3 py-2">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-sm text-amber-400">
                No URL configured — add one to enable replay
              </span>
            </div>
          )}
          <Button size="sm" variant="ghost" onClick={handleEdit} className="shrink-0">
            <Pencil size={14} className="mr-1" />
            {hasUrl ? 'Edit' : 'Add URL'}
          </Button>
        </div>
      )}
      
      <p className="mt-2 text-xs text-muted-foreground">
        This URL is used for all {providerName} event replays across your workspace
      </p>
    </div>
  )
}