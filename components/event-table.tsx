'use client'

import { useRouter } from 'next/navigation'
import { type WebhookEvent } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'
import { ProviderBadge } from './provider-badge'
import { formatDistanceToNow } from 'date-fns'
import { ChevronRight, RotateCcw } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface EventTableProps {
  events: WebhookEvent[]
}

export function EventTable({ events }: EventTableProps) {
  const router = useRouter()
  
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px]">Timestamp</TableHead>
            <TableHead className="w-[120px]">Provider</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="max-w-[300px]">AI Summary</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => router.push(`/event/${event.id}`)}
            >
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <ProviderBadge provider={event.provider} size="sm" />
              </TableCell>
              <TableCell>
                <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
                  {event.event_type}
                </code>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={event.status} />
                  {event.replay_count > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-violet-400">
                      <RotateCcw size={10} />
                      {event.replay_count}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <p className="truncate text-sm text-muted-foreground">
                  {event.ai_summary}
                </p>
              </TableCell>
              <TableCell>
                <ChevronRight size={16} className="text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
