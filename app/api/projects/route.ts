import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      throw error
    }

    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

    const projectIds = projects?.map(p => p.id) || []

    if (projectIds.length > 0) {
      const { data: eventsStats } = await supabase
        .from('webhook_events')
        .select('project_id, status')
        .in('project_id', projectIds)
        .gte('created_at', tenDaysAgo.toISOString())

      const statsMap: Record<string, { total: number; success: number; failed: number }> = {}
      
      eventsStats?.forEach(event => {
        if (!statsMap[event.project_id]) {
          statsMap[event.project_id] = { total: 0, success: 0, failed: 0 }
        }
        statsMap[event.project_id].total++
        if (event.status === 'success' || event.status === 'replayed') {
          statsMap[event.project_id].success++
        } else if (event.status === 'failed') {
          statsMap[event.project_id].failed++
        }
      })

      const projectsWithStats = projects?.map(project => ({
        ...project,
        total_events: statsMap[project.id]?.total || 0,
        success_count: statsMap[project.id]?.success || 0,
        failed_count: statsMap[project.id]?.failed || 0,
      }))

      return NextResponse.json({ projects: projectsWithStats })
    }

    return NextResponse.json({ projects: projects || [] })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)

    if (existingProjects && existingProjects.length >= 5) {
      return NextResponse.json({ error: 'Maximum 5 projects allowed' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, color } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        color: color || 'blue',
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A project with this name already exists' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}