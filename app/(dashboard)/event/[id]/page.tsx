'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getProviderUrl, setProviderUrl, getProviderDisplayName } from '@/lib/provider-urls'
import { StatusBadge } from '@/components/status-badge'
import { ProviderBadge } from '@/components/provider-badge'
import { JsonViewer } from '@/components/json-viewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { formatDistanceToNow, format } from 'date-fns'
import {
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  AlertCircle,
  Pencil,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  WifiOff,
  Home,
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { EventChatbot } from '@/components/event-chatbot'

type ReplayResult = {
  status: 'success' | 'error' | 'network_error'
  statusCode?: number
  message: string
  duration: number
  timestamp: Date
} | null

type EventStatus = 'success' | 'failed' | 'replayed'

type WebhookEvent = {
  id: number | string
  provider: string
  event_type: string
  method: string
  url: string
  headers: Record<string, string>
  body: Record<string, unknown> | null
  raw_body: string | null
  status: string
  created_at: string
  replay_count: number
  ai_summary: string | null
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [event, setEvent] = useState<WebhookEvent | null>(null)
  const [providerUrl, setProviderUrlState] = useState('')
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [editUrlValue, setEditUrlValue] = useState('')
  const [urlSaved, setUrlSaved] = useState(false)
  const [idCopied, setIdCopied] = useState(false)
  const [headersOpen, setHeadersOpen] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayResult, setReplayResult] = useState<ReplayResult>(null)
  const [eventStatus, setEventStatus] = useState<EventStatus>('success')
  const [replayCount, setReplayCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndEvent = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setEvent(data as WebhookEvent)
      setEventStatus(data.status === 'failed' ? 'failed' : 'success')
      setReplayCount(data.replay_count || 0)
      const url = await getProviderUrl(data.provider)
      setProviderUrlState(url)
      setEditUrlValue(url)
      setLoading(false)
    }

    fetchUserAndEvent()
  }, [resolvedParams.id, supabase])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(event.id)
    setIdCopied(true)
    setTimeout(() => setIdCopied(false), 1500)
  }

  const handleEditUrl = () => {
    setIsEditingUrl(true)
    setEditUrlValue(providerUrl)
  }

  const handleSaveUrl = async () => {
    await setProviderUrl(event.provider, editUrlValue)
    setProviderUrlState(editUrlValue)
    setIsEditingUrl(false)
    setUrlSaved(true)
    setTimeout(() => setUrlSaved(false), 1500)
  }

  const handleCancelEdit = () => {
    setIsEditingUrl(false)
    setEditUrlValue(providerUrl)
  }

  const handleReplay = async () => {
    if (!providerUrl) return

    setIsReplaying(true)
    setReplayResult(null)

    const startTime = Date.now()
    const newReplayCount = replayCount + 1

    // Build clean headers - only keep essential headers from the original webhook
    const cleanHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-HookLens-Replay': 'true',
      'X-HookLens-Event-ID': String(event.id),
    }

    // Add essential headers from stored event (skip problematic ones)
    const skipHeaders = [
      'content-type',
      'content-length',
      'host',
      'accept',
      'accept-encoding',
      'accept-language',
      'connection',
      'keep-alive',
      'sec-fetch-*',
      'x-forwarded-*',
    ]

    Object.entries(event.headers).forEach(([key, value]) => {
      const keyLower = key.toLowerCase()
      const shouldSkip = skipHeaders.some(
        (skip) => keyLower === skip || keyLower.startsWith(skip.replace('*', ''))
      )
      if (!shouldSkip && value) {
        cleanHeaders[key] = value
      }
    })

    try {
      const response = await fetch(providerUrl, {
        method: event.method || 'POST',
        headers: cleanHeaders,
        body: typeof event.body === 'string' ? event.body : JSON.stringify(event.body),
      })

      const duration = Date.now() - startTime

      if (response.ok) {
        setReplayResult({
          status: 'success',
          statusCode: response.status,
          message: 'OK',
          duration,
          timestamp: new Date(),
        })
        setReplayCount(newReplayCount)
        setEventStatus('replayed')
        
        // Save to database
        await supabase.from('webhook_events').update({
          replay_count: newReplayCount,
          replayed_at: new Date().toISOString(),
        }).eq('id', event.id)
      } else {
        setReplayResult({
          status: 'error',
          statusCode: response.status,
          message: 'Request failed · Check your endpoint',
          duration,
          timestamp: new Date(),
        })
        setReplayCount(newReplayCount)
        setEventStatus('replayed')
        
        // Save to database
        await supabase.from('webhook_events').update({
          replay_count: newReplayCount,
          replayed_at: new Date().toISOString(),
        }).eq('id', event.id)
      }
    } catch {
      const duration = Date.now() - startTime
      setReplayResult({
        status: 'network_error',
        message: 'Could not reach the URL',
        duration,
        timestamp: new Date(),
      })
      setReplayCount(newReplayCount)
      setEventStatus('replayed')
      
      // Save to database even on network error
      await supabase.from('webhook_events').update({
        replay_count: newReplayCount,
        replayed_at: new Date().toISOString(),
      }).eq('id', event.id)
    } finally {
      setIsReplaying(false)
    }
  }

  const hasProviderUrl = providerUrl.length > 0
  const providerName = getProviderDisplayName(event.provider)
  const headerCount = Object.keys(event.headers).length

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 overflow-x-auto">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home size={14} />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono text-xs">{event.event_type}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Section 1: Event Header */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4">
              <code className="text-xl font-semibold font-mono">{event.event_type}</code>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ProviderBadge provider={event.provider} />
              <div className="flex items-center gap-1.5">
                <StatusBadge status={eventStatus} />
                {replayCount > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <RotateCcw size={10} />
                    {replayCount}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <code className="font-mono text-xs">{event.id}</code>
                {idCopied ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            </div>
          </section>

          {/* Section 2: Provider Webhook URL */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">{providerName} Webhook URL</label>
              {urlSaved && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check size={12} />
                  Saved
                </span>
              )}
            </div>

            {isEditingUrl ? (
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={editUrlValue}
                  onChange={(e) => setEditUrlValue(e.target.value)}
                  placeholder={`https://your-backend.com/webhooks/${event.provider}`}
                  className="flex-1 bg-background font-mono text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveUrl}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {hasProviderUrl ? (
                  <code className="flex-1 truncate rounded bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-300">
                    {providerUrl}
                  </code>
                ) : (
                  <div className="flex flex-1 items-center gap-2 rounded border border-dashed border-amber-500/30 bg-amber-500/5 px-3 py-2">
                    <AlertCircle size={14} className="text-amber-400" />
                    <span className="text-sm text-amber-400">
                      No URL configured — add one to enable replay
                    </span>
                  </div>
                )}
                <Button size="sm" variant="ghost" onClick={handleEditUrl} className="shrink-0">
                  <Pencil size={14} className="mr-1" />
                  {hasProviderUrl ? 'Edit' : 'Add URL'}
                </Button>
              </div>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Add your backend's complete webhook URL here. Make sure to enable CORS in your backend to allow replayed events.
            </p>
          </section>

          {/* Section 3: AI Analysis */}
          <section className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="font-medium">AI Analysis</h2>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {event.ai_summary}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {providerName}
              </span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                {event.status === 'failed' ? 'High Risk' : 'Low Risk'}
              </span>
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
                {event.status === 'failed' ? 'Replay Recommended' : 'No Action Needed'}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Powered by Vercel AI SDK
            </div>
          </section>

          {/* Section 4: Replay */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-medium">Replay Event</h2>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      onClick={handleReplay}
                      disabled={!hasProviderUrl || isReplaying}
                      className="gap-2"
                    >
                      {isReplaying ? (
                        <>
                          <Spinner size="sm" />
                          Replaying...
                        </>
                      ) : (
                        <>
                          Replay Event
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!hasProviderUrl && (
                  <TooltipContent>
                    <p>Add a webhook URL above to enable replay</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {/* Replay Result */}
            {replayResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-lg border p-4 ${
                  replayResult.status === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {replayResult.status === 'success' ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : replayResult.status === 'network_error' ? (
                    <WifiOff size={18} className="text-red-400" />
                  ) : (
                    <XCircle size={18} className="text-red-400" />
                  )}
                  <span
                    className={`font-medium ${
                      replayResult.status === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {replayResult.status === 'success'
                      ? `${replayResult.statusCode} OK`
                      : replayResult.status === 'network_error'
                      ? 'Network Error'
                      : `${replayResult.statusCode} Error`}
                  </span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {replayResult.status === 'success'
                      ? `${replayResult.duration}ms`
                      : replayResult.message}
                  </span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    Replayed {formatDistanceToNow(replayResult.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </motion.div>
            )}
          </section>

          {/* Section 5: JSON Payload */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-medium">JSON Payload</h2>
            <JsonViewer data={event.body} />
          </section>

          {/* Section 6: Request Headers */}
          <Collapsible open={headersOpen} onOpenChange={setHeadersOpen}>
            <section className="rounded-lg border border-border bg-card">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between p-6 text-left">
                  <h2 className="font-medium">Headers ({headerCount})</h2>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform ${
                      headersOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-border px-6 pb-6 pt-4">
                  <div className="space-y-2">
                    {Object.entries(event.headers).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start gap-2 font-mono text-sm"
                      >
                        <span className="text-sky-400">{key}:</span>
                        <span className="text-zinc-400 break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </section>
          </Collapsible>
        </div>
        
        <EventChatbot event={event} userId={userId || ''} />
      </motion.div>
    </div>
  )
}
