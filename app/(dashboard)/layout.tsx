'use client'

import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
