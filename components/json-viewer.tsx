'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JsonViewerProps {
  data: Record<string, unknown>
  className?: string
  maxHeight?: string
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-400' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-400' // key
        } else {
          cls = 'text-emerald-400' // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-violet-400' // boolean
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500' // null
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

export function JsonViewer({ data, className, maxHeight = '320px' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)
  
  const jsonString = JSON.stringify(data, null, 2)
  const highlighted = syntaxHighlight(jsonString)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  
  return (
    <div className={cn('relative rounded-lg border border-border bg-zinc-950', className)}>
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1.5 text-xs text-zinc-400 hover:text-zinc-100"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </Button>
      </div>
      <div
        className="overflow-auto p-4 font-mono text-sm"
        style={{ maxHeight }}
      >
        <pre
          className="text-zinc-300"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  )
}
