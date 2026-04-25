'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { mockEvents, mockProjects, getProjectById, type Provider, type EventStatus } from '@/lib/mock-data'
import { getProviderDisplayName, getAllProviders } from '@/lib/provider-urls'
import { EventTable } from '@/components/event-table'
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
import { Search, ChevronDown, Radio, FolderKanban, X, Home } from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const projectFilter = searchParams.get('project')
  const activeProject = projectFilter ? getProjectById(projectFilter) : null
  
  const [search, setSearch] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all')
  const [selectedProject, setSelectedProject] = useState<string | 'all'>(projectFilter || 'all')
  
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      // Project filter
      if (selectedProject !== 'all' && event.project_id !== selectedProject) {
        return false
      }
      
      // Search filter
      if (search && !event.event_type.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      
      // Provider filter
      if (selectedProviders.length > 0 && !selectedProviders.includes(event.provider)) {
        return false
      }
      
      // Status filter
      if (selectedStatus !== 'all' && event.status !== selectedStatus) {
        return false
      }
      
      return true
    })
  }, [search, selectedProviders, selectedStatus, selectedProject])
  
  const toggleProvider = (provider: Provider) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    )
  }
  
  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Webhook Events</h1>
              {activeProject && (
                <Link
                  href="/dashboard"
                  onClick={() => setSelectedProject('all')}
                  className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <FolderKanban size={12} />
                  {activeProject.name}
                  <X size={12} />
                </Link>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredEvents.length} events captured
              {activeProject && ` in ${activeProject.name}`}
            </p>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
            <Radio size={14} className="animate-pulse" />
            Listening
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search event types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card pl-9"
            />
          </div>
          
          {/* Provider filter */}
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
              {getAllProviders().map(provider => (
                <DropdownMenuCheckboxItem
                  key={provider}
                  checked={selectedProviders.includes(provider)}
                  onCheckedChange={() => toggleProvider(provider)}
                >
                  {getProviderDisplayName(provider)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Project filter */}
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
              {mockProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as EventStatus | 'all')}
          >
            <SelectTrigger className="w-32 bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="replayed">Replayed</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Clear filters */}
          {(search || selectedProviders.length > 0 || selectedStatus !== 'all' || selectedProject !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setSelectedProviders([])
                setSelectedStatus('all')
                setSelectedProject('all')
              }}
              className="text-muted-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>
        
        {/* Events table */}
        {filteredEvents.length > 0 ? (
          <EventTable events={filteredEvents} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-800">
              <Search size={20} className="text-zinc-400" />
            </div>
            <h3 className="mb-1 font-medium">No events found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
