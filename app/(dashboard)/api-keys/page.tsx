'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  AlertTriangle,
  Home,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ApiKeyData {
  id: string
  api_key: string
  created_at: string
  last_used_at: string | null
}

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState<ApiKeyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApiKey = async () => {
    try {
      const res = await fetch('/api/api-keys')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setApiKey(data.apiKey)
      }
    } catch {
      setError('Failed to fetch API key')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiKey()
  }, [])

  const generateKey = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/api-keys', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setApiKey(data.apiKey)
        setShowKey(true) // Show the new key immediately
      }
    } catch {
      setError('Failed to generate API key')
    } finally {
      setGenerating(false)
    }
  }

  const deleteKey = async () => {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/api-keys', { method: 'DELETE' })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setApiKey(null)
        setShowKey(false)
      }
    } catch {
      setError('Failed to delete API key')
    } finally {
      setDeleting(false)
    }
  }

  const copyToClipboard = async () => {
    if (!apiKey) return
    await navigator.clipboard.writeText(apiKey.api_key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskApiKey = (key: string) => {
    return key.slice(0, 8) + '••••••••••••••••••••••••' + key.slice(-4)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
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
              <BreadcrumbPage>API Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your API key for the hooklens middleware
          </p>
        </div>

        {/* Info card */}
        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex gap-3">
            <Shield size={20} className="mt-0.5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-primary">Keep your API key secure</p>
              <p className="mt-1 text-muted-foreground">
                Your API key grants access to send webhook events to your hooklens dashboard. 
                Never share it publicly or commit it to version control.
              </p>
            </div>
          </div>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
            >
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle size={16} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : apiKey ? (
          /* API Key exists */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Key size={18} className="text-primary" />
              <span className="font-medium">Your API Key</span>
            </div>

            {/* Key display */}
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-background p-3 font-mono text-sm">
              <span className="flex-1 break-all">
                {showKey ? apiKey.api_key : maskApiKey(apiKey.api_key)}
              </span>
              <button
                onClick={() => setShowKey(!showKey)}
                className="shrink-0 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={copyToClipboard}
                className="shrink-0 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={16} className="text-primary" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Metadata */}
            <div className="mb-6 text-sm text-muted-foreground">
              <p>Created: {formatDate(apiKey.created_at)}</p>
            </div>

            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 size={16} />
                  Delete API Key
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your existing integrations using this 
                    API key will stop working immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteKey}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        ) : (
          /* No API Key - generate one */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Key size={24} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No API Key</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Generate an API key to start capturing webhook events
            </p>
            <Button onClick={generateKey} disabled={generating} className="gap-2">
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Generate API Key
            </Button>
          </motion.div>
        )}

        {/* Usage example */}
        <div className="mt-8">
          <h3 className="mb-3 font-medium">Quick Start</h3>
          <div className="rounded-lg border border-border bg-zinc-950 p-4">
            <pre className="overflow-x-auto text-sm">
              <code>
                <span className="text-gray-500"># Add to your .env file</span>
                {'\n'}
                <span className="text-blue-400">HOOKLENS_API_KEY</span>
                <span className="text-gray-400">=</span>
                <span className="text-emerald-400">{apiKey?.api_key || 'hlk_your_api_key_here'}</span>
              </code>
            </pre>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            See the{' '}
            <Link href="/docs" className="text-primary hover:underline">
              documentation
            </Link>
            {' '}for full integration guide.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
