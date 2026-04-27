'use client'

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, ChevronDown, Radio, FolderKanban, X, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Loader2 } from 'lucide-react'

type Provider = 'stripe' | 'github' | 'slack' | 'notion' | 'meta' | 'linear' | 'shopify' | 'custom'

interface Project {
  id: string
  name: string
  slug: string
  color: string
}

interface WebhookEvent {
  id: number
  user_id: string | null
  project_id: string | null
  method: string
  url: string
  headers: Record<string, string>
  body: Record<string, unknown> | null
  provider: Provider | null
  content_type: string | null
  raw_body: string | null
  query: Record<string, string>
  created_at: string
}

const ITEMS_PER_PAGE = 20

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectFilter = searchParams.get('project')
  const supabase = createClient()
  
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  
  const [search, setSearch] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [selectedProject, setSelectedProject] = useState<string>(projectFilter || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  
  const fetchData = useCallback(async () => {
    try {
setLoading(true)
      setError(null)
      
      const { data: { user }, error: sessionError } = await supabase.auth.getUser()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
      }
      
      if (!user) {
        setError('Please login first')
        setLoading(false)
        return
      }
      
      const userId = user.id
      
      if (!userId) {
        setError('Please login first')
        setLoading(false)
        return
      }

      let query = supabase
        .from('webhook_events')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
      
      if (selectedProject !== 'all') {
        query = query.eq('project_id', selectedProject)
      }
      
      if (selectedProviders.length > 0) {
        query = query.in('provider', selectedProviders)
      }
      
      const { data: eventsData, error: eventsError, count } = await query
      
      const projectsRes = await supabase
        .from('projects')
        .select('id, name, slug, color')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (eventsError) {
        console.error('Events fetch error:', eventsError.message)
        setError('Failed to load events')
      } else {
        setEvents(eventsData || [])
        setTotalCount(count || 0)
      }
      
      if (projectsRes.error) {
        console.error('Projects fetch error:', projectsRes.error.message)
      } else {
        setProjects(projectsRes.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedProject, selectedProviders, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedProject, selectedProviders])

  const toggleProvider = (provider: Provider) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    )
  }

  const activeProject = useMemo(() => {
    if (!projectFilter) return null
    return projects.find(p => p.id === projectFilter) || null
  }, [projectFilter, projects])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const providers = ['stripe', 'github', 'slack', 'notion', 'meta', 'linear', 'shopify', 'custom']

  if (loading && events.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Webhook Events</h1>
              {activeProject && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <FolderKanban size={12} />
                  {activeProject.name}
                  <X size={12} />
                </Link>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalCount} events total
              {activeProject && ` in ${activeProject.name}`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
            <Radio size={14} className="animate-pulse" />
            Listening
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card pl-9"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-card">
                Providers
                {selectedProviders.length > 0 && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                    {selectedProviders.length}
                  </span>
                )}
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {providers.map(provider => (
                <DropdownMenuCheckboxItem
                  key={provider}
                  checked={selectedProviders.includes(provider as Provider)}
                  onCheckedChange={() => toggleProvider(provider as Provider)}
                >
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Select
            value={selectedProject}
            onValueChange={(value) => setSelectedProject(value)}
          >
            <SelectTrigger className="w-40 gap-2 bg-card">
              <FolderKanban size={14} className="text-muted-foreground" />
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedProviders.length > 0 || selectedProject !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProviders([])
                setSelectedProject('all')
              }}
              className="text-muted-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>
        
        {error ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">URL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {events.map((event) => (
                    <tr 
                      key={event.id} 
                      className="transition-colors cursor-pointer"
                      onClick={() => router.push(`/event/${event.id}`)}
                    >
                      <td className="px-4 py-3 text-sm font-mono">{event.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs capitalize">
                          {event.provider || 'unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-mono ${
                          event.method === 'POST' ? 'text-emerald-400' :
                          event.method === 'GET' ? 'text-blue-400' :
                          event.method === 'PUT' ? 'text-amber-400' :
                          event.method === 'DELETE' ? 'text-red-400' : ''
                        }`}>
                          {event.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm max-w-md truncate font-mono">
                        {event.url}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-800">
              <Search size={20} className="text-zinc-400" />
            </div>
            <h3 className="mb-1 font-medium">No events found</h3>
            <p className="text-sm text-muted-foreground">
              Send a webhook to your capture endpoint to see events here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}