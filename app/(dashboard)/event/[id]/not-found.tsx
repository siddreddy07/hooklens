'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function EventNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-zinc-800">
        <FileQuestion size={32} className="text-zinc-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">Event Not Found</h2>
      <p className="mb-6 text-muted-foreground">
        The webhook event you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <Link href="/dashboard">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
