import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    const contentType = req.headers.get('content-type') || ''
    let body: Record<string, unknown> | null = null
    let rawBody: string | null = null

    if (contentType.includes('application/json')) {
      body = await req.json()
      rawBody = JSON.stringify(body)
    } else {
      rawBody = await req.text()
    }

    const url = new URL(req.url)
    const query: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      query[key] = value
    })

    const apiKey = req.headers.get('x-api-key')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
    }

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('api_key', apiKey)
      .single()

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const provider = body?.provider as string | undefined
    const projectId = body?.projectId as string | undefined

    const { data: event, error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        user_id: apiKeyData.user_id,
        method: req.method,
        url: req.url,
        headers: headers,
        body: body,
        provider: provider || null,
        project_id: projectId || null,
        content_type: contentType || null,
        raw_body: rawBody,
        query: query,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to store webhook event:', insertError)
      return NextResponse.json({ error: 'Failed to store event' }, { status: 500 })
    }

    // Update project counts if project_id exists
    if (projectId) {
      const tenDaysAgo = new Date()
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

      // Get counts for last 10 days
      const { data: eventsData } = await supabase
        .from('webhook_events')
        .select('provider')
        .eq('project_id', projectId)
        .gte('created_at', tenDaysAgo.toISOString())

      const totalEvents = eventsData?.length || 0
      const successfulCount = eventsData?.filter(e => e.provider === 'success').length || 0
      const failedCount = eventsData?.filter(e => e.provider === 'failed').length || 0

      // Update project counts
      await supabase
        .from('projects')
        .update({
          total_events_count: totalEvents,
          successful_count: successfulCount,
          failed_count: failedCount
        })
        .eq('id', projectId)
    }

    return NextResponse.json({ 
      success: true, 
      event_id: event.id 
    })
  } catch (error) {
    console.error('Capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}