import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, serviceKey)

export async function sendRequestLog(payload) {
  const { error } = await supabase.from('webhook_events').insert([
    {
      method: payload.method,
      url: payload.url,
      headers: payload.headers,
      body: payload.body,
      provider: payload.provider,
      project_name: payload.projectName,
      content_type: payload.contentType,
      raw_body: payload.rawBody,
      query: payload.query,
    },
  ])

  if (error) {
    console.error('Failed to log request:', error)
  }
}