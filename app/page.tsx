'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Search, 
  RotateCcw, 
  ArrowRight, 
  Terminal, 
  Shield, 
  Clock, 
  Sparkles,
  Code2,
  Webhook,
  ChevronRight,
  BookOpen,
  Github
} from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

const features = [
  {
    icon: Zap,
    title: 'Instant Capture',
    description: 'Intercept webhooks from Stripe, GitHub, Clerk, and 50+ providers in real-time with zero configuration.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Understand complex webhook payloads instantly. Our AI explains what each event means in plain English.',
  },
  {
    icon: RotateCcw,
    title: 'One-Click Replay',
    description: 'Replay any webhook to your local or production backend. Debug faster than ever before.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'End-to-end encryption. Your webhook data never touches our servers unencrypted.',
  },
  {
    icon: Clock,
    title: 'Event History',
    description: 'Full searchable history of all webhook events. Filter by provider, status, or time range.',
  },
  {
    icon: Code2,
    title: 'Developer First',
    description: 'Built by developers, for developers. Clean API, detailed logs, and excellent DX.',
  },
]

const codeExample = `import { HookLens } from 'hooklens'

const hooks = HookLens({
  projectName: 'my-app',
  provider: 'stripe'
})

app.use('/webhooks', hooks.capture())`

const providers = [
  'Stripe', 'GitHub', 'Clerk', 'Shopify', 'Twilio', 
  'SendGrid', 'Slack', 'Discord', 'Linear', 'Vercel'
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const [showNav, setShowNav] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50])
  
  // Track scroll position and footer visibility
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Intersection observer for footer
  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide nav when footer is visible, show when it's not
        setShowNav(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated grid background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(34_197_94/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(34_197_94/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>
      
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-primary/30"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Fixed Header */}
      <motion.header 
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
          hasScrolled ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
        initial={{ y: 0 }}
        animate={{ y: showNav ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div 
              className="relative flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={22} className="text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary opacity-0 blur-md transition-opacity group-hover:opacity-50" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight">HookLens</span>
          </Link>
          
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Documentation
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#integration" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Integration
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/docs" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-2">
                <BookOpen size={16} />
                Docs
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-2 shadow-lg shadow-primary/25">
                Get Started
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>
      
      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-20">
        
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="flex flex-1 flex-col items-center justify-center pb-20 pt-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div 
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Now supporting 50+ webhook providers
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="mx-auto max-w-5xl text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block">Debug Webhooks</span>
              <span className="mt-2 block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Capture. Understand. Replay. The AI-powered webhook debugger 
              that makes debugging feel like magic.
            </p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/login">
                <Button size="lg" className="h-14 gap-3 px-8 text-base shadow-xl shadow-primary/30">
                  <Zap size={20} />
                  Start Debugging Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="h-14 gap-3 px-8 text-base">
                  <BookOpen size={20} />
                  Read the Docs
                </Button>
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Webhook size={16} className="text-primary" />
                <span>50+ Providers</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
      
      {/* Providers Section */}
      <section className="relative border-y border-border/50 bg-card/30 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Works with your favorite providers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {providers.map((provider, i) => (
              <motion.span
                key={provider}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {provider}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need to
              <span className="text-primary"> debug webhooks</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Built for modern development workflows. No more print statements or manual testing.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y--8 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                
                <div className="relative">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon size={26} className="text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Integration Section */}
      <section id="integration" className="relative border-y border-border/50 bg-card/30 py-32 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Terminal size={14} />
                Quick Integration
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Add to your app in
                <span className="text-primary"> 2 minutes</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Install our lightweight middleware package, add a single line of code, 
                and start capturing webhooks instantly. Works with Express, Next.js, 
                Fastify, and any Node.js framework.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/docs">
                  <Button size="lg" className="gap-2">
                    View Documentation
                    <ChevronRight size={18} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Github size={18} />
                  View on GitHub
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/10 blur-xl" />
              <div className="relative overflow-hidden rounded-xl border border-border bg-[#0d1117] p-6 font-mono text-sm shadow-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-muted-foreground">middleware.ts</span>
                </div>
                <pre className="overflow-x-auto">
                  <code className="text-[13px] leading-relaxed">
                    <span className="text-gray-500">{'// .env'}</span>
                    {'\n'}
                    <span className="text-blue-300">HOOK_LENS_API_KEY</span>
                    <span className="text-gray-300">=</span>
                    <span className="text-emerald-300">hlk_xxxxxxxxxxxx</span>
                    {'\n\n'}
                    <span className="text-purple-400">import</span>
                    <span className="text-gray-300">{' { '}</span>
                    <span className="text-blue-300">HookLens</span>
                    <span className="text-gray-300">{' } '}</span>
                    <span className="text-purple-400">from</span>
                    <span className="text-emerald-300">{` 'hooklens'`}</span>
                    {'\n\n'}
                    <span className="text-purple-400">const</span>
                    <span className="text-blue-300"> hooks </span>
                    <span className="text-gray-300">= </span>
                    <span className="text-yellow-300">HookLens</span>
                    <span className="text-gray-300">{'({'}</span>
                    {'\n'}
                    <span className="text-gray-300">{'  '}</span>
                    <span className="text-blue-300">projectName</span>
                    <span className="text-gray-300">: </span>
                    <span className="text-emerald-300">{`'my-app'`}</span>
                    <span className="text-gray-300">,</span>
                    {'\n'}
                    <span className="text-gray-300">{'  '}</span>
                    <span className="text-blue-300">provider</span>
                    <span className="text-gray-300">: </span>
                    <span className="text-emerald-300">{`'stripe'`}</span>
                    {'\n'}
                    <span className="text-gray-300">{'})'}</span>
                    {'\n\n'}
                    <span className="text-blue-300">app</span>
                    <span className="text-gray-300">.</span>
                    <span className="text-yellow-300">use</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-emerald-300">{`'/webhooks'`}</span>
                    <span className="text-gray-300">, </span>
                    <span className="text-blue-300">hooks</span>
                    <span className="text-gray-300">.</span>
                    <span className="text-yellow-300">capture</span>
                    <span className="text-gray-300">{'())'}</span>
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to debug smarter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Join thousands of developers who have already transformed their webhook debugging workflow.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button size="lg" className="h-14 gap-3 px-10 text-base shadow-xl shadow-primary/30">
                  <Zap size={20} />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="h-14 gap-3 px-10 text-base">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer ref={footerRef} className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Zap size={16} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">HookLens</span>
            </Link>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground">Documentation</Link>
              <Link href="/login" className="hover:text-foreground">Sign In</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for the developer community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
