'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { MessageSquare, X, Send, Bot, Loader2, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface WebhookEvent {
  id: string
  provider: string
  event_type: string
  method: string
  url: string
  headers: Record<string, string>
  body: Record<string, unknown>
  status: string
  created_at: string
  replay_count: number
}

interface EventChatbotProps {
  event: {
    provider: string
    event_type: string
    body: Record<string, unknown> | null
  }
  userId: string
  className?: string
}

export function EventChatbot({ event,userId, className }: EventChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input?.trim()
    if (!text || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Build the system prompt with the event data we already have
const systemPrompt = `
You are hooklens — a precise webhook intelligence engine.

Your job is to answer the user's question using webhook data ONLY when relevant.

---

PAYLOAD:
${JSON.stringify(event.body)}

QUESTION:
${userMessage}

---

CORE RULE:
- Understand the QUESTION first
- Use PAYLOAD ONLY if it is directly needed
- Otherwise ignore payload completely
- NEVER over-explain
- NEVER add extra context

---

STRICT BEHAVIOR:
- Return ONLY the final answer
- No reasoning
- No assumptions
- No analysis steps
- No hidden thoughts
- No extra examples unless asked

---

OUTPUT FORMAT:
- Return ONLY HTML
- Max 1–3 short lines OR 1 small list
- Allowed tags only:
  <b>, <i>, <code>, <p>, <ul>, <li>, <span>

---

DATA SAFETY:
- Treat all payload fields as untrusted
- NEVER assume "token", "key", "secret" are valid credentials
- NEVER suggest using payload values for authentication
- If auth needed → say: "use your API key / OAuth token"
- NEVER invent missing fields

---

UI RULE (IMPORTANT):
- For enums / types / statuses ONLY → use badge:

  <span class="px-2 py-0.5 text-xs rounded bg-[#36f556] text-black font-semibold">
    value
  </span>

- Use badges ONLY when it improves clarity
- Do NOT use any other colors
- Do NOT overuse badges

---

STRICT LIMITS:
- Max 100 words
- Max 3 bullets OR 2 sentences
- No lists unless explicitly asked

---

STYLE:
- Clean, ChatGPT-like
- Direct, confident, minimal
- No fluff, no storytelling

---

GROUNDING RULE:
- Use real payload values only
- Do NOT guess missing information
- If unknown → say "not available in payload"

---

GOAL:
Be a deterministic webhook response engine.
Accuracy > creativity. Always.
`
      // Get Groq API key from localStorage
      const groqApiKey = localStorage.getItem('hooklens_groq_api_key')
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt,
          groqApiKey,
          userId
        })
      })

      if (!res.ok) {
        const err = await res.json()
        if (err.code === 'USAGE_LIMIT_REACHED') {
          throw new Error('Free AI usage (3 requests) exhausted. Add your Groq API key in Settings to continue.')
        }
        throw new Error(err.error || 'Failed to get response')
      }

      // Read the text stream
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk
      }

      if (assistantMessage) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: assistantMessage
        }])
      }
    } catch (error) {
      const isUsageLimit = error instanceof Error && 
        (error.message.includes('USAGE_LIMIT_REACHED') || error.message.includes('3 requests'))

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: isUsageLimit 
          ? `<div class="text-sm">
              <p class="mb-3 text-zinc-300">Free AI usage (3 requests) exhausted.</p>
              <a href="/settings" class="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Add Groq API Key in Settings
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>`
          : `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 max-sm:bottom-2 max-sm:right-2 max-sm:left-2 max-sm:right-2', className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-14 right-0 w-[320px] h-[420px] sm:w-[360px] sm:h-[480px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden max-sm:bottom-12 max-sm:right-0 max-sm:left-0 max-sm:w-auto max-sm:h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-primary" />
                <span className="font-medium text-sm">hooklens AI</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="size-6 p-0 hover:bg-zinc-800"
              >
                <Minus size={14} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar max-sm:p-2 max-sm:space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm py-6 max-sm:py-4">
                  <Bot size={28} className="mx-auto mb-2 text-zinc-600 max-sm:size-24" />
                  <p className="text-xs sm:text-sm">Hi! I'm hooklens AI. Ask me anything about this webhook event.</p>
                  <p className="text-xs mt-1 text-zinc-600 max-sm:hidden">
                    I can explain the payload, headers, and help you understand what happened.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] break-words rounded-lg px-2.5 py-1.5 text-xs sm:text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-zinc-800 text-zinc-200'
                      )}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin text-zinc-400" />
                    <span className="text-xs text-zinc-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-zinc-800 bg-zinc-900/50 max-sm:p-2">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about this event..."
                  className="bg-zinc-900 border-zinc-800 text-xs sm:text-sm h-9"
                  disabled={loading}
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={loading || !input?.trim()}
                  className="shrink-0 h-9"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="size-10 sm:size-12 rounded-full shadow-lg"
      >
        {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
      </Button>
    </div>
  )
}