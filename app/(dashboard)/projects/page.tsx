'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { mockProjects, mockEvents, type Project } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  FolderKanban, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
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

const projectColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', dot: 'bg-violet-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-500' },
}

function getProjectStats(projectId: string) {
  const events = mockEvents.filter(e => e.project_id === projectId)
  const success = events.filter(e => e.status === 'success').length
  const failed = events.filter(e => e.status === 'failed').length
  return { total: events.length, success, failed }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState('emerald')

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return
    
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectName,
      slug: newProjectName.toLowerCase().replace(/\s+/g, '-'),
      description: newProjectDescription,
      color: selectedColor,
      created_at: new Date().toISOString(),
      event_count: 0,
    }
    
    setProjects([newProject, ...projects])
    setNewProjectName('')
    setNewProjectDescription('')
    setSelectedColor('emerald')
    setIsCreateOpen(false)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId))
  }

  return (
    <div className="mx-auto max-w-5xl">
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
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="mt-1 text-muted-foreground">
              Organize your webhook events into separate projects
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Project Name</label>
                  <Input
                    placeholder="e.g., Production API"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Description</label>
                  <Input
                    placeholder="Brief description of this project"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Color</label>
                  <div className="flex gap-2">
                    {Object.keys(projectColors).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`size-8 rounded-full transition-all ${projectColors[color].dot} ${
                          selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => {
              const colors = projectColors[project.color] || projectColors.emerald
              const stats = getProjectStats(project.id)
              
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`group relative rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${colors.border}`}
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${colors.bg}`}>
                        <FolderKanban size={20} className={colors.text} />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-xs text-muted-foreground">{project.slug}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard?project=${project.id}`}>
                            <ExternalLink size={14} className="mr-2" />
                            View Events
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity size={14} />
                      <span>{stats.total} events</span>
                    </div>
                    {stats.success > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 size={14} />
                        <span>{stats.success}</span>
                      </div>
                    )}
                    {stats.failed > 0 && (
                      <div className="flex items-center gap-1.5 text-red-400">
                        <XCircle size={14} />
                        <span>{stats.failed}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Created {formatDate(project.created_at)}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                      <Link href={`/dashboard?project=${project.id}`}>
                        View
                        <ExternalLink size={12} className="ml-1.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Color indicator */}
                  <div className={`absolute left-0 top-4 h-8 w-1 rounded-r-full ${colors.dot}`} />
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Empty state for create */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsCreateOpen(true)}
            className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-5 transition-colors hover:border-primary/30 hover:bg-card"
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Plus size={24} className="text-primary" />
            </div>
            <p className="mb-1 font-medium">Create a Project</p>
            <p className="text-center text-sm text-muted-foreground">
              Organize your webhooks into separate projects
            </p>
          </motion.button>
        </div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6"
        >
          <h3 className="mb-2 font-medium text-primary">About Projects</h3>
          <p className="text-sm text-muted-foreground">
            Projects help you organize webhook events from different applications or environments. 
            Each project gets its own unique endpoint URL. Events are automatically categorized 
            based on which endpoint receives them, making it easy to filter and analyze webhooks 
            from different sources.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
