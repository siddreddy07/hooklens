'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Settings, Sparkles, Bell, Shield, Palette, Zap, Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const upcomingFeatures = [
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'AI-powered alerts that learn which failures matter most to your team',
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Two-factor authentication, SSO integration, and audit logs',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    description: 'Personalize your dashboard with custom color schemes',
  },
  {
    icon: Zap,
    title: 'Workflow Automations',
    description: 'Auto-retry failed webhooks with custom rules and conditions',
  },
]

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
          className="relative mb-8"
        >
          <div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-card">
            <Settings size={36} className="text-muted-foreground" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-primary"
          >
            <Sparkles size={16} className="text-primary-foreground" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3 text-3xl font-semibold"
        >
          Settings Coming Soon
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 max-w-md text-muted-foreground"
        >
          We&apos;re crafting powerful customization options to make HookLens 
          truly yours. Here&apos;s what&apos;s on the horizon.
        </motion.p>

        {/* Upcoming features grid */}
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group rounded-xl border border-border bg-card/50 p-5 text-left transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="mb-1 font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Newsletter hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-6 py-4"
        >
          <p className="text-sm text-primary">
            Want to be notified when settings go live? We&apos;ll keep you posted.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
