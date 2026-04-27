'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DiNpm } from 'react-icons/di'
import {
  Zap,
  Copy,
  Check,
  ChevronRight,
  Package,
  Key,
  AlertCircle,
  Monitor,
  Code2,
  Rocket,
  Sparkles,
  Home
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-[#0d1117]">
      {filename && (
        <div className="flex items-center justify-between border-b border-border/50 bg-[#161b22] px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-yellow-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-muted-foreground">{filename}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className="text-[13px] leading-relaxed text-gray-300">{code}</code>
      </pre>
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
      {children}
    </code>
  )
}

const providers = [
  'stripe', 'github', 'slack', 'shopify', 'twilio',
  'sendgrid', 'notion', 'linear', 'discord', 'meta'
]

type TabType = 'dashboard' | 'sdk'

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(34_197_94/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(34_197_94/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Breadcrumb>
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
                <BreadcrumbPage>Documentation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link href="/dashboard">
            <Button size="sm" className="gap-2">
              Dashboard
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Documentation
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to capture and debug webhooks
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-xl border border-border bg-card p-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`relative flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all ${activeTab === 'dashboard'
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {activeTab === 'dashboard' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <Monitor size={18} className="relative z-10" />
                <span className="relative z-10">Web Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('sdk')}
                className={`relative flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all ${activeTab === 'sdk'
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {activeTab === 'sdk' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <Code2 size={18} className="relative z-10" />
                <span className="relative z-10">SDK</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Dashboard Content */}
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Feature Cards */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="text-primary" size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">AI-Powered Analysis</h3>
                    <p className="text-muted-foreground">
                      Every webhook event is automatically analyzed by AI to provide
                      human-readable summaries and actionable insights.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Monitor className="text-primary" size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Real-time Events</h3>
                    <p className="text-muted-foreground">
                      Watch webhook events stream in real-time. Filter by provider,
                      project, or status to find exactly what you need.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Rocket className="text-primary" size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">One-Click Replay</h3>
                    <p className="text-muted-foreground">
                      Replay any event to your endpoint with a single click.
                      Perfect for debugging failed webhooks or testing changes.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Package className="text-primary" size={24} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Project Organization</h3>
                    <p className="text-muted-foreground">
                      Organize webhooks by project. Each project gets its own
                      event stream, making multi-app debugging a breeze.
                    </p>
                  </div>
                </div>

                {/* Getting Started */}
                <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
                  <h3 className="mb-4 text-2xl font-bold">Getting Started</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Sign in to hooklens</h4>
                        <p className="text-sm text-muted-foreground">
                          Use the demo credentials or create your account
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Create a Project</h4>
                        <p className="text-sm text-muted-foreground">
                          Organize your webhooks by project for better management
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Configure Providers</h4>
                        <p className="text-sm text-muted-foreground">
                          Add your webhook provider URLs for replay functionality
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="/login" className="mt-6 inline-block">
                    <Button className="gap-2">
                      Open Dashboard
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sdk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Node.js SDK Content */}
                <div className="space-y-10">
                  {/* Installation */}
                  <section>
                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                      <Package className="text-primary" size={24} />
                      Installation
                    </h2>
                    <CodeBlock
                      filename="Terminal"
                      code={`npm install hooklens-node`}
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">View on</span>
                      <a
                        href="https://www.npmjs.com/package/hooklens-node"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <DiNpm size={32} />
                        npm
                      </a>
                    </div>
                  </section>

                  {/* Setup */}
                  <section>
                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                      <Zap className="text-primary" size={24} />
                      Quick Setup
                    </h2>

                    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-500" />
                        <div className="text-sm text-amber-200/80">
                          Get your API key and Project ID from the hooklens dashboard. Configure HOOKLENS_BASE_URL in your env for CORS.
                          <br />
                          <a href="https://hooklens-eta.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-100">Visit hooklens →</a>
                        </div>
                      </div>
                    </div>

                    <CodeBlock
                      filename=".env"
                      code={`HOOKLENS_API_KEY=hlk_your_api_key_here
HOOKLENS_PROJECT_ID=your-project-id-here
HOOKLENS_BASE_URL=https://hooklens-eta.vercel.app`}
                    />
                  </section>

                  {/* Basic Usage */}
                  <section>
                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                      <Code2 className="text-primary" size={24} />
                      Usage
                    </h2>

                    <CodeBlock
                      filename="server.js"
                      code={`import express from 'express'
import { hooklens } from 'hooklens-node'

const app = express()

app.use('/webhooks/{provider}', hooklens({ provider: '{provider}' }))

app.listen(3000)`}
                    />
                  </section>

{/* CORS Setup */}
                  <section>
                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                      <Code2 className="text-primary" size={24} />
                      CORS Setup
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                      Add the hooklens origin to your CORS to enable webhook replay:
                    </p>

                    <CodeBlock
                      filename="server.js"
                      code={`import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: process.env.HOOKLENS_BASE_URL,
  credentials: true
}))

app.use(express.json())
app.use('/webhooks/{provider}', hooklens({ provider: '{provider}' }))

app.listen(3000)`}
                    />
                  </section>

                  {/* Supported Providers */}
                  <section>
                    <h3 className="mb-4 text-xl font-semibold">Supported Providers</h3>
                    <div className="flex flex-wrap gap-2">
                      {providers.map((provider) => (
                        <span
                          key={provider}
                          className="rounded-full border border-border bg-card px-3 py-1 text-sm capitalize"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
    <p className="text-sm text-muted-foreground">
  Need help? Open an issue on{" "}
  <a
    href="https://github.com/siddreddy07/hooklens"
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:text-foreground"
  >
    GitHub
  </a>
</p>
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="gap-2 hover:text-[#36f556] border-2 hover:border-green-600 cursor-pointer">
                Go to Dashboard
                <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
