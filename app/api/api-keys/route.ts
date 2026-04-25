import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Generate a unique API key
function generateApiKey(): string {
  const prefix = 'hlk_'
  const randomBytes = crypto.randomBytes(24).toString('hex')
  return `${prefix}${randomBytes}`
}

// GET - Fetch user's API key
export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, api_key, created_at, last_used_at')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ apiKey: data || null })
}

// POST - Generate new API key
export async function POST() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user already has an API key
  const { data: existing } = await supabase
    .from('api_keys')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (existing) {
    return NextResponse.json(
      { error: 'You already have an API key. Delete it first to generate a new one.' },
      { status: 400 }
    )
  }
  
  const apiKey = generateApiKey()
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      api_key: apiKey,
    })
    .select('id, api_key, created_at')
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ apiKey: data })
}

// DELETE - Delete user's API key
export async function DELETE() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('user_id', user.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
