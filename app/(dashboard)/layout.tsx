'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      setChecked(true)
    }
  }, [router])
  
  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pt-14 lg:ml-60 lg:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
