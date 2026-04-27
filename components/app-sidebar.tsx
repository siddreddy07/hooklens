'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { HookLensLogo } from '@/components/logo'
import { 
  LayoutDashboard, 
  Webhook, 
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  FolderKanban,
  Key
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiApps2AiLine } from 'react-icons/ri'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/providers', label: 'Providers', icon: RiApps2AiLine },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/docs', label: 'Documentation', icon: BookOpen },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setMobileOpen(false)
    
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ email: user.email || '' })
      }
    }
    fetchUser()
  }, [pathname])
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  
  const userEmail = user?.email || ''
  const userName = userEmail.split('@')[0] || ''
  const userInitial = userName.charAt(0).toUpperCase() || 'U'
  
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-6 transition-opacity hover:opacity-80">
        <HookLensLogo />
        <span className="font-mono text-lg font-bold tracking-tight">
          <span className="text-foreground">Hook</span>
          <span className="text-primary">Lens</span>
        </span>
      </Link>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          {mounted && user ? (
            <>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {userInitial}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </>
          ) : (
            <>
              <div className="size-9 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-16 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  )
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r border-border bg-card lg:block">
        {sidebarContent}
      </aside>
      
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <HookLensLogo />
          <span className="font-mono text-lg font-bold tracking-tight">
            <span className="text-foreground">Hook</span>
            <span className="text-primary">Lens</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </header>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-60 border-r border-border bg-card lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
