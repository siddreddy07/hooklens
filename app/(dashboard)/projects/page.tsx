'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  Home,
  Loader2,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
  total_events_count_count?: number
  successful_count?: number
  failed_count?: number
}

const projectColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', dot: 'bg-violet-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-500' },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/projects')
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProjects(data.projects || [])
      }
    } catch {
      setError('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProject() {
    if (!newProjectName.trim()) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          color: selectedColor,
        }),
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProjects([data.project, ...projects])
        resetCreateForm()
        setIsCreateOpen(false)
      }
    } catch {
      setError('Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateProject() {
    if (!editingProject || !newProjectName.trim()) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          color: selectedColor,
        }),
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProjects(projects.map(p => p.id === data.project.id ? data.project : p))
        resetCreateForm()
        setIsEditOpen(false)
        setEditingProject(null)
      }
    } catch {
      setError('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProject(projectId: string) {
    setDeleting(projectId)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch {
      setError('Failed to delete project')
    } finally {
      setDeleting(null)
    }
  }

  function openEditDialog(project: Project) {
    setEditingProject(project)
    setNewProjectName(project.name)
    setNewProjectDescription(project.description || '')
    setSelectedColor(project.color)
    setIsEditOpen(true)
  }

  function resetCreateForm() {
    setNewProjectName('')
    setNewProjectDescription('')
    setSelectedColor('blue')
  }

  async function copyProjectId(projectId: string) {
    await navigator.clipboard.writeText(projectId)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Breadcrumb className="mb-6 overflow-x-auto">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home size={14} />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="mt-1 text-muted-foreground">
              Organize your webhook events into separate projects (max 5)
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) resetCreateForm()
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={projects.length >= 5}>
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
                  <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetCreateForm() }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!newProjectName.trim() || saving}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Create Project'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle size={16} />
              {error}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => {
                const colors = projectColors[project.color] || projectColors.blue
                
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
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-lg ${colors.bg}`}>
                          <FolderKanban size={20} className={colors.text} />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-xs text-muted-foreground">{project.slug}</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyProjectId(project.id)}
                            className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Copy project ID"
                          >
                            {copiedId === project.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span className="max-w-[60px] truncate">{project.id}</span>
                          </button>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 transition-opacity"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(project)}>
                            <Pencil size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard?project=${project.id}`}>
                              <ExternalLink size={14} className="mr-2" />
                              View Events
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{project.name}" and all associated data. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleting === project.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    'Delete'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {project.description || 'No description'}
                    </p>

                    <div className="mb-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Activity size={14} />
                        <span>{project?.total_events_count || 0} events</span>
                      </div>
                      {(project.successful_count || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 size={14} />
                          <span>{project.successful_count}</span>
                        </div>
                      )}
                      {(project.failed_count || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-red-400">
                          <XCircle size={14} />
                          <span>{project.failed_count}</span>
                        </div>
                      )}
                    </div>

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

                    <div className={`absolute left-0 top-4 h-8 w-1 rounded-r-full ${colors.dot}`} />
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {projects.length < 5 && (
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
                  {projects.length === 0 ? 'Organize your webhooks' : `${5 - projects.length} more allowed`}
                </p>
              </motion.button>
            )}
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) {
            resetCreateForm()
            setEditingProject(null)
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
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
                <Button variant="outline" onClick={() => { setIsEditOpen(false); resetCreateForm(); setEditingProject(null) }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProject} disabled={!newProjectName.trim() || saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6"
        >
          <h3 className="mb-2 font-medium text-primary">About Projects</h3>
          <p className="text-sm text-muted-foreground">
            Projects help you organize webhook events from different applications or environments. 
            Each project has its own stats calculated from the last 10 days of events. 
            You can create up to 5 projects.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}