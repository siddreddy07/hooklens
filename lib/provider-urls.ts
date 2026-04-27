'use client'

import { createClient } from '@/lib/supabase/client'
import type { Provider } from './mock-data'

export type ProviderUrls = Record<Provider, string>

export async function getProviderUrls(): Promise<ProviderUrls> {
  const supabase = createClient()
  const defaultUrls: ProviderUrls = {
    stripe: '',
    github: '',
    slack: '',
    notion: '',
    meta: '',
    linear: '',
    shopify: '',
    custom: '',
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return defaultUrls

    const { data, error } = await supabase
      .from('provider_urls')
      .select('provider, url')
      .eq('user_id', user.id)

    if (error || !data) return defaultUrls

    const urls: ProviderUrls = { ...defaultUrls }
    data.forEach((row: { provider: Provider; url: string }) => {
      if (row.provider && row.url) {
        urls[row.provider] = row.url
      }
    })

    return urls
  } catch {
    return defaultUrls
  }
}

export async function getProviderUrl(provider: Provider): Promise<string> {
  const urls = await getProviderUrls()
  return urls[provider] || ''
}

export async function setProviderUrl(provider: Provider, url: string): Promise<void> {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('provider_urls')
      .upsert({
        user_id: user.id,
        provider,
        url,
      }, {
        onConflict: 'user_id,provider',
      })
  } catch {
    // Silently fail
  }
}

export function getAllProviders(): Provider[] {
  return ['stripe', 'github', 'slack', 'notion', 'meta', 'linear', 'shopify', 'custom']
}

export function getProviderDisplayName(provider: Provider): string {
  const names: Record<Provider, string> = {
    stripe: 'Stripe',
    github: 'GitHub',
    slack: 'Slack',
    notion: 'Notion',
    meta: 'Meta',
    linear: 'Linear',
    shopify: 'Shopify',
    custom: 'Custom',
  }
  return names[provider]
}