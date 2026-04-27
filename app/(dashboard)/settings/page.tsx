'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Trash2, Key, Check, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface ApiKey {
  id: string
  api_key: string
  created_at: string
  last_used_at: string | null
}

const GROQ_API_KEY_STORAGE = 'hooklens_groq_api_key'

export default function SettingsPage() {
  const supabase = createClient()
  const [apiKey, setApiKey] = useState<ApiKey | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Groq API Key state
  const [groqApiKey, setGroqApiKey] = useState('')
  const [groqKeySaved, setGroqKeySaved] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)

  useEffect(() => {
    fetchApiKey()
    loadGroqApiKey()
  }, [])

  async function fetchApiKey() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setApiKey(data)
        // Save API key to localStorage for chatbot usage tracking
        if (typeof window !== 'undefined') {
          localStorage.setItem('hooklens_user_api_key', data.api_key)
        }
      }
    } catch (err) {
      console.error('Failed to fetch API key:', err)
      setError('Failed to load API key')
    } finally {
      setLoading(false)
    }
  }

  async function generateApiKey() {
    setCreating(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const generatedKey = `hooklens_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`

      if (apiKey) {
        const { error } = await supabase
          .from('api_keys')
          .update({ api_key: generatedKey })
          .eq('id', apiKey.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            api_key: generatedKey,
          })

        if (error) throw error
      }

      await fetchApiKey()
    } catch (err: unknown) {
      console.error('Failed to create API key:', err)
      setError(err instanceof Error ? err.message : 'Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  async function deleteApiKey() {
    if (!apiKey) return
    setDeleting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', apiKey.id)

      if (error) throw error

      setApiKey(null)
    } catch (err: unknown) {
      console.error('Failed to delete API key:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete API key')
    } finally {
      setDeleting(false)
    }
  }

  async function copyApiKey() {
    if (!apiKey) return
    
    await navigator.clipboard.writeText(apiKey.api_key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Groq API Key functions
  function loadGroqApiKey() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(GROQ_API_KEY_STORAGE)
      if (stored) {
        setGroqApiKey(stored)
      }
    }
  }

  function saveGroqApiKey() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GROQ_API_KEY_STORAGE, groqApiKey)
      setGroqKeySaved(true)
      setTimeout(() => setGroqKeySaved(false), 2000)
    }
  }

  function clearGroqApiKey() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GROQ_API_KEY_STORAGE)
      setGroqApiKey('')
    }
  }

  function formatDate(date: string | null): string {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1.5">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mb-2 text-2xl font-semibold">API Settings</h1>
        <p className="mb-8 text-muted-foreground">
          Manage your API key for integrating hooklens with your services.
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* API Key Section */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Key size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium">API Key</h2>
              <p className="text-sm text-muted-foreground">
                Use this key to authenticate your webhook endpoints
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : apiKey ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={apiKey.api_key}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyApiKey}
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Created: {formatDate(apiKey.created_at)}</span>
                <span>Last used: {formatDate(apiKey.last_used_at)}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                <div>
                  <p className="text-sm font-medium text-amber-400">Regenerate Warning</p>
                  <p className="text-xs text-amber-400/80">
                    Regenerating will invalidate your current API key. Update your integrations immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateApiKey}
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Regenerate Key'
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteApiKey}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No API key generated yet. Generate one to start capturing webhooks.
              </p>
              <Button
                onClick={generateApiKey}
                disabled={creating}
                className="w-full"
              >
                {creating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key size={16} className="mr-2" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Groq API Key Section */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium">AI Chatbot API Key</h2>
              <p className="text-sm text-muted-foreground">
                Add your Groq API key for the AI chatbot feature
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGroqKey ? 'text' : 'password'}
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                  className="font-mono text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showGroqKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button
                onClick={saveGroqApiKey}
                disabled={!groqApiKey.trim()}
                className="shrink-0"
              >
                {groqKeySaved ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Saved
                  </>
                ) : (
                  'Save'
                )}
              </Button>
              {groqApiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearGroqApiKey}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-200/80">
                Get your free API key from{' '}
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-300"
                >
                  console.groq.com/keys
                </a>
                . The key is stored locally in your browser only.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-medium">How to Use</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Send webhook requests to your capture endpoint:</p>
            <div className="rounded-lg bg-muted p-3 font-mono text-xs">
              <p>POST /api/capture</p>
              <p>Content-Type: application/json</p>
              <p>x-api-key: {apiKey?.api_key || 'your_api_key'}</p>
            </div>
            <p>Example with fetch:</p>
            <div className="rounded-lg bg-muted p-3 font-mono text-xs">
              <p>{`fetch('/api/capture', {`}</p>
              <p>&nbsp;&nbsp;method: 'POST',</p>
              <p>&nbsp;&nbsp;headers: {'{'}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json',</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;'x-api-key': '{apiKey?.api_key || 'your_api_key'}'</p>
              <p>&nbsp;&nbsp;{'}'},</p>
              <p>&nbsp;&nbsp;body: JSON.stringify(data)</p>
              <p>{`})`}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}