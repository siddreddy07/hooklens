import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const maxDuration = 60

const GLOBAL_GROQ_API_KEY = process.env.GROQ_API_KEY
const MAX_FREE_USAGE = 3

export async function POST(req: Request) {
  let body: { messages: Array<{ role: string; content: string }>; systemPrompt: string; groqApiKey?: string; userId?: string }

  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { messages, systemPrompt, groqApiKey, userId } = body

  if (!systemPrompt) {
    return Response.json({ error: 'System prompt required' }, { status: 400 })
  }

  if (groqApiKey && groqApiKey.trim()) {
    const result = streamText({
      model: groq('qwen/qwen3-32b', { apiKey: groqApiKey.trim() }),
      system: systemPrompt,
      messages: messages.filter(m => m.role === 'user'),
    })

    const stream = new ReadableStream({
      async start(controller) {
        for await (const delta of result.fullStream) {
          if (delta.type === 'text-delta') {
            controller.enqueue(new TextEncoder().encode(delta.text))
          } else if (delta.type === 'error') {
            controller.enqueue(new TextEncoder().encode(`Error: ${delta.error}`))
          }
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }

  if (!userId) {
    return Response.json({
      error: 'Free usage limit reached. Please add your own Groq API key in Settings.',
      code: 'USAGE_LIMIT_REACHED'
    }, { status: 403 })
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('ai_api_key_usage')
    .eq('user_id', userId)
    .single()

  console.log('keyData:', keyData, 'keyError:', keyError)

  if (keyError || !keyData) {
    return Response.json({
      error: 'Free usage limit reached. Please add your own Groq API key in Settings.',
      code: 'USAGE_LIMIT_REACHED'
    }, { status: 403 })
  }

  const usageCount = keyData.ai_api_key_usage || 0

  if (usageCount >= MAX_FREE_USAGE) {
    return Response.json({
      error: 'Free usage limit reached. Please add your own Groq API key in Settings.',
      code: 'USAGE_LIMIT_REACHED'
    }, { status: 403 })
  }

  if (!GLOBAL_GROQ_API_KEY) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('api_keys')
    .update({ ai_api_key_usage: usageCount + 1 })
    .eq('user_id', userId)

  console.log('Update result - new value:', usageCount + 1, 'error:', updateError)

  const result = streamText({
    model: groq('qwen/qwen3-32b', { apiKey: GLOBAL_GROQ_API_KEY }),
    system: systemPrompt,
    messages: messages.filter(m => m.role === 'user'),
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const delta of result.fullStream) {
        if (delta.type === 'text-delta') {
          controller.enqueue(new TextEncoder().encode(delta.text))
        } else if (delta.type === 'error') {
          controller.enqueue(new TextEncoder().encode(`Error: ${delta.error}`))
        }
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}