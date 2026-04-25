import type { Provider } from './mock-data'

const STORAGE_KEY = 'hooklens_provider_urls'

export type ProviderUrls = Record<Provider, string>

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

export function getProviderUrls(): ProviderUrls {
  if (typeof window === 'undefined') return defaultUrls
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultUrls, ...JSON.parse(stored) }
    }
  } catch {
    // Ignore parse errors
  }
  
  return defaultUrls
}

export function getProviderUrl(provider: Provider): string {
  const urls = getProviderUrls()
  return urls[provider] || ''
}

export function setProviderUrl(provider: Provider, url: string): void {
  if (typeof window === 'undefined') return
  
  const urls = getProviderUrls()
  urls[provider] = url
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
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
