'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Zap,
  RotateCcw,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Code2,
  Webhook,
  BookOpen,
  Github,
  Terminal,
  ChevronRight,
  Activity,
  Search,
  LayoutDashboard,
} from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PiWebhooksLogoFill } from 'react-icons/pi'
import { Menu, X } from 'lucide-react'

// ─── DATA ───────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    tag: '01',
    title: 'Instant Capture',
    description:
      'Intercept webhooks from Stripe, GitHub, Clerk, and 50+ providers in real-time with zero configuration.',
  },
  {
    icon: Sparkles,
    tag: '02',
    title: 'AI-Powered Insights',
    description:
      'Understand complex webhook payloads instantly. Our AI explains what each event means in plain English.',
  },
  {
    icon: RotateCcw,
    tag: '03',
    title: 'One-Click Replay',
    description:
      'Replay any webhook to your local or production backend. Debug faster than ever before.',
  },
  {
    icon: Shield,
    tag: '04',
    title: 'Secure by Default',
    description:
      'End-to-end encryption. Your webhook data never touches our servers unencrypted.',
  },
  {
    icon: Clock,
    tag: '05',
    title: 'Event History',
    description:
      'Full searchable history of all webhook events. Filter by provider, status, or time range.',
  },
  {
    icon: Code2,
    tag: '06',
    title: 'Developer First',
    description:
      'Built by developers, for developers. Clean API, detailed logs, and excellent DX.',
  },
]

const providers = [
  { name: 'Stripe', color: '#635bff' },
  { name: 'GitHub', color: '#e6edf3' },
  { name: 'Clerk', color: '#6c47ff' },
  { name: 'Shopify', color: '#96bf48' },
  { name: 'Twilio', color: '#f22f46' },
  { name: 'SendGrid', color: '#1a82e2' },
  { name: 'Slack', color: '#4a154b' },
  { name: 'Discord', color: '#5865f2' },
  { name: 'Linear', color: '#5e6ad2' },
  { name: 'Vercel', color: '#e6edf3' },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,255,133,0.25) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial fade mask over dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#060709_100%)]" />
      {/* Glow orbs */}
      <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00ff85] opacity-[0.04] blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#00e5ff] opacity-[0.03] blur-[100px]" />
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -60])

  useEffect(() => {
    setMounted(true)
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ email: user.email || '' })
      }
    }
fetchUser()
  }, [])

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#060709', color: '#eef0f6' }}
    >
      {/* ── BACKGROUND ── */}
      <GridBackground />

      {/* ── NAV ── */}
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        style={{
          height: hasScrolled ? 56 : 68,
          background: hasScrolled ? 'rgba(6,7,9,0.85)' : 'transparent',
          backdropFilter: hasScrolled ? 'blur(16px)' : 'none',
          borderBottom: hasScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          transition: 'all 0.3s',
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <PiWebhooksLogoFill
              className="size-9"
              style={{ color: '#00ff85' }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}
            >
              Hook<span style={{ color: '#00ff85' }}>Lens</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Documentation', 'Features', 'Integration'].map((l) => (
              <Link
                key={l}
                href={l === 'Documentation' ? '/docs' : `#${l.toLowerCase()}`}
                className="text-sm font-medium transition-colors"
                style={{ color: 'rgba(238,240,246,0.45)' }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = 'rgba(238,240,246,1)')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = 'rgba(238,240,246,0.45)')
                }
              >
                {l}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!user && (
              <Link href="/docs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-white/50 hover:text-white"
                  style={{ fontSize: 13 }}
                >
                  <BookOpen size={14} />
                  Docs
                </Button>
              </Link>
            )}
            {user ? (
              <Link href="/dashboard">
                <button
                  style={{
                    background: '#00ff85',
                    color: '#000',
                    border: 'none',
                    borderRadius: 9,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                    boxShadow: '0 0 24px rgba(0,255,133,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 36px rgba(0,255,133,0.4)'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 24px rgba(0,255,133,0.2)'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  }}
                >
                  Dashboard <LayoutDashboard size={13} />
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button
                  style={{
                    background: '#00ff85',
                    color: '#000',
                    border: 'none',
                    borderRadius: 9,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                    boxShadow: '0 0 24px rgba(0,255,133,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 36px rgba(0,255,133,0.4)'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 24px rgba(0,255,133,0.2)'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Get started'} <ArrowRight size={13} />
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center landing-hero-pt"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(38px, 6vw, 78px)',
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-3px',
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          <span style={{ display: 'block', color: '#eef0f6' }}>Debug Webhooks</span>
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(90deg, #00ff85, #00e5ff, #00ff85)',
              backgroundSize: '200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            Like Never Before
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="landing-hero-subtitle"
          style={{
            fontSize: 18,
            color: 'rgba(238,240,246,0.5)',
            maxWidth: 520,
            lineHeight: 1.75,
            marginBottom: 44,
          }}
        >
          Capture. Understand. Replay. The AI-powered webhook debugger that makes
          debugging feel like{' '}
          <span style={{ color: 'rgba(238,240,246,0.85)', fontStyle: 'italic' }}>
            magic.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="landing-cta-row"
          style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}
        >
          {user ? (
            <Link href="/dashboard">
              <button
                style={{
                  background: '#00ff85',
                  color: '#000',
                  border: 'none',
                  borderRadius: 12,
                  padding: '15px 30px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                  boxShadow: '0 8px 40px rgba(0,255,133,0.3)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 16px 60px rgba(0,255,133,0.4)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 8px 40px rgba(0,255,133,0.3)'
                }}
              >
                <Zap size={17} /> Go to Dashboard <ArrowRight size={16} />
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button
                  style={{
                    background: '#00ff85',
                    color: '#000',
                    border: 'none',
                    borderRadius: 12,
                    padding: '15px 30px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    boxShadow: '0 8px 40px rgba(0,255,133,0.3)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 16px 60px rgba(0,255,133,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 8px 40px rgba(0,255,133,0.3)'
                  }}
                >
                  <Zap size={17} /> Start Debugging Free <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/docs">
                <button
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(238,240,246,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: '15px 30px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(255,255,255,0.2)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#eef0f6'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(255,255,255,0.1)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(238,240,246,0.7)'
                  }}
                >
                  <BookOpen size={16} /> Read the Docs
                </button>
              </Link>
            </>
          )}
        </motion.div>
      </motion.section>

      {/* ── PROVIDERS ── */}
      <section
        className="relative z-10 py-14"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <p
            style={{
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(238,240,246,0.25)',
              marginBottom: 36,
            }}
          >
            Works with your stack
          </p>
          <div
            className="landing-provider-gap"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 28px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {providers.map((p, i) => (
              <motion.span
                key={p.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'rgba(238,240,246,0.2)',
                  cursor: 'default',
                  transition: 'color 0.2s',
                  letterSpacing: '-0.3px',
                }}
                whileHover={{ color: 'rgba(238,240,246,0.7)' } as any}
              >
                {p.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 px-6 py-28 landing-section-py">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 60 }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#00ff85',
                marginBottom: 14,
              }}
            >
              // capabilities
            </p>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(36px,5vw,58px)',
                fontWeight: 800,
                letterSpacing: '-2.5px',
                lineHeight: 1.0,
                marginBottom: 16,
                color: '#eef0f6',
              }}
            >
              Everything you need to
              <br />
              <span style={{ color: '#00ff85' }}>debug webhooks.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(238,240,246,0.45)', maxWidth: 440, lineHeight: 1.7 }}>
              Built for the modern development loop. No more print statements or manual testing.
            </p>
          </motion.div>

          {/* 3-col grid with shared borders */}
          <div
            className="landing-features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group landing-features-card-p"
                style={{
                  background: '#0a0c10',
                  padding: '36px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = '#0d1018'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = '#0a0c10'
                }}
              >
                {/* hover top line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, #00ff85, transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                  className="group-hover:opacity-100"
                />
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: 'rgba(0,255,133,0.4)',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    marginBottom: 18,
                  }}
                >
                  {f.tag}
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(0,255,133,0.07)',
                    border: '1px solid rgba(0,255,133,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    color: '#00ff85',
                  }}
                >
                  <f.icon size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    marginBottom: 10,
                    color: '#eef0f6',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(238,240,246,0.4)', lineHeight: 1.7 }}>
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATION ── */}
      <section
        id="integration"
        className="relative z-10 px-6 py-28 landing-section-py"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 landing-integration-grid landing-integration-grid-gap">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(0,255,133,0.07)',
                border: '1px solid rgba(0,255,133,0.18)',
                borderRadius: 100,
                padding: '4px 14px',
                fontSize: 12,
                color: '#00ff85',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 22,
              }}
            >
              <Terminal size={12} /> Quick Integration
            </div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(34px,4.5vw,52px)',
                fontWeight: 800,
                letterSpacing: '-2px',
                lineHeight: 1.05,
                marginBottom: 18,
                color: '#eef0f6',
              }}
            >
              Add to your app
              <br />
              <span style={{ color: '#00ff85' }}>in 2 minutes.</span>
            </h2>
            <p
              style={{ fontSize: 16, color: 'rgba(238,240,246,0.45)', lineHeight: 1.75, marginBottom: 28 }}
            >
              Install HookLens in your app with just one line of code. Start capturing
              webhooks instantly.
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
              {[
                { n: '1', title: 'Install the package', body: 'npm install hooklens-node' },
                { n: '2', title: 'Add one line of middleware', body: 'app.use(hooklens({ provider: "{provider}" }))' },
                { n: '3', title: 'Open your dashboard', body: 'Events stream in live, instantly.' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'rgba(0,255,133,0.08)',
                      border: '1px solid rgba(0,255,133,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#00ff85',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#eef0f6', marginBottom: 2 }}>
                      {s.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: 'rgba(238,240,246,0.35)',
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/docs">
                <button
                  style={{
                    background: '#00ff85',
                    color: '#000',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  View Docs <ChevronRight size={15} />
                </button>
              </Link>
              <a
                href="https://github.com/siddreddy07/hooklens"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  color: 'rgba(238,240,246,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <Github size={15} /> GitHub
              </a>
            </div>
          </motion.div>

          {/* Right: code block */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -16,
                background: 'radial-gradient(ellipse at center, rgba(0,255,133,0.08), transparent 70%)',
                borderRadius: 24,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'relative',
                background: '#070910',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Chrome */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '13px 18px',
                  background: '#060709',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span
                  style={{
                    marginLeft: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  middleware.ts
                </span>
              </div>

              {/* Code */}
              <pre
                className="code-block"
                style={{
                  padding: '20px 18px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                  overflowX: 'auto',
                  margin: 0,
                }}
              >
                <span style={{ color: '#546e7a' }}>{'// .env'}</span>
                {'\n'}
                <span style={{ color: '#80cbc4' }}>HOOKLENS_API_KEY</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>=</span>
                <span style={{ color: '#a8ff78' }}>process.env.HOOKLENS_API_KEY</span>
                {'\n\n'}
                <span style={{ color: '#c792ea' }}>import</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{' { '}</span>
                <span style={{ color: '#82aaff' }}>hooklens</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{' } '}</span>
                <span style={{ color: '#c792ea' }}>from</span>
                <span style={{ color: '#a8ff78' }}>{` 'hooklens-node'`}</span>
                {'\n\n'}
                <span style={{ color: '#c792ea' }}>const</span>
                <span style={{ color: '#82aaff' }}> hooklensClient </span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>= </span>
                <span style={{ color: '#ffcb6b' }}>hooklens</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'({'}</span>
                {'\n'}
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'  '}</span>
                <span style={{ color: '#80cbc4' }}>provider</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
                <span style={{ color: '#a8ff78' }}>{`'{provider}'`}</span>
                {'\n'}
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'})'}</span>
                {'\n\n'}
                <span style={{ color: '#82aaff' }}>app</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>.</span>
                <span style={{ color: '#ffcb6b' }}>use</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>(</span>
                <span style={{ color: '#a8ff78' }}>{`'/webhooks/{provider}'`}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>, </span>
                <span style={{ color: '#82aaff' }}>hooklensClient</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{')'}</span>
              </pre>

              {/* install pill */}
              <div
                style={{
                  margin: '0 22px 22px',
                  padding: '10px 16px',
                  background: 'rgba(0,255,133,0.05)',
                  border: '1px solid rgba(0,255,133,0.12)',
                  borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: 'rgba(238,240,246,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ color: '#00ff85' }}>$</span>
                <span>npm install hooklens-node</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 10,
                    color: '#00ff85',
                    background: 'rgba(0,255,133,0.1)',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  v1.0
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 py-32 text-center landing-section-py">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 700,
            height: 500,
            background: 'radial-gradient(ellipse, rgba(0,255,133,0.06), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-3xl"
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(42px, 6vw, 76px)',
              fontWeight: 800,
              letterSpacing: '-3px',
              lineHeight: 0.96,
              marginBottom: 22,
              color: '#eef0f6',
            }}
          >
            Ready to debug
            <br />
            <span style={{ color: '#00ff85' }}>smarter?</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(238,240,246,0.45)',
              maxWidth: 460,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            {user 
              ? 'View your webhook events and debug faster than ever.' 
              : 'Join thousands of developers who have already transformed their webhook debugging workflow.'}
          </p>
          <div
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}
          >
            {user ? (
              <Link href="/dashboard">
                <button
                  style={{
                    background: '#00ff85',
                    color: '#000',
                    border: 'none',
                    borderRadius: 12,
                    padding: '16px 34px',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    boxShadow: '0 10px 50px rgba(0,255,133,0.3)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 20px 70px rgba(0,255,133,0.45)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 10px 50px rgba(0,255,133,0.3)'
                  }}
                >
                  <Zap size={18} /> Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button
                    style={{
                      background: '#00ff85',
                      color: '#000',
                      border: 'none',
                      borderRadius: 12,
                      padding: '16px 34px',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'inherit',
                      boxShadow: '0 10px 50px rgba(0,255,133,0.3)',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                      ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                        '0 20px 70px rgba(0,255,133,0.45)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                        '0 10px 50px rgba(0,255,133,0.3)'
                    }}
                  >
                    <Zap size={18} /> {user ? 'Go to Dashboard' : 'Get Started Free'}
                  </button>
                </Link>
                <Link href="/docs">
                  <button
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(238,240,246,0.6)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 12,
                      padding: '16px 34px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    Read Documentation
                  </button>
                </Link>
              </>
            )}
          </div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: 'rgba(238,240,246,0.2)',
            }}
          >
            Free plan · No credit card required
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '48px 24px',
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,133,0.02) 100%)',
        }}
      >
        <div
          className="mx-auto max-w-7xl"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
          }}
        >
          {/* Main Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <PiWebhooksLogoFill
              size={36}
              style={{ color: '#00ff85' }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: '#eef0f6',
              }}
            >
              Hook<span style={{ color: '#00ff85' }}>Lens</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {(user ? [
              { name: 'Documentation', href: '/docs', external: false },
              { name: 'Dashboard', href: '/dashboard', external: false },
              { name: 'GitHub', href: 'https://github.com/siddreddy07/hooklens', external: true },
            ] : [
              { name: 'Documentation', href: '/docs', external: false },
              { name: 'Sign In', href: '/login', external: false },
              { name: 'GitHub', href: 'https://github.com/siddreddy07/hooklens', external: true },
            ]).map((l) => (
              l.external ? (
                <a
                  key={l.name}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: 'rgba(238,240,246,0.4)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'JetBrains Mono', monospace" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#00ff85')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(238,240,246,0.4)')}
                >
                  {l.name}
                </a>
              ) : (
                <Link
                  key={l.name}
                  href={l.href}
                  style={{ fontSize: 13, color: 'rgba(238,240,246,0.4)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'JetBrains Mono', monospace" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#00ff85')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(238,240,246,0.4)')}
                >
                  {l.name}
                </Link>
              )
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,255,133,0.3), transparent)',
            }}
          />

          {/* Built for Community */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#eef0f6',
                letterSpacing: '-0.3px',
              }}
            >
              Built for the developer community
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: 'rgba(238,240,246,0.25)',
              }}
            >
              Crafted with ❤️ by Siddharth
            </p>
          </div>

          {/* Version Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00ff85',
                boxShadow: '0 0 8px #00ff85',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: 'rgba(238,240,246,0.3)',
                letterSpacing: '1px',
              }}
            >
              v1.0.0
            </span>
          </div>
        </div>
      </footer>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 133, 0.5); }
          50%       { box-shadow: 0 0 0 6px rgba(0, 255, 133, 0); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 6px; background: #060709; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>
    </div>
  )
}