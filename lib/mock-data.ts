export type Provider = 'stripe' | 'github' | 'slack' | 'notion' | 'meta' | 'linear' | 'shopify' | 'custom'
export type EventStatus = 'success' | 'failed' | 'replayed'

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  color: string
  created_at: string
  event_count: number
}

export interface WebhookEvent {
  id: string
  provider: Provider
  event_type: string
  status: EventStatus
  payload: Record<string, unknown>
  headers: Record<string, string>
  ai_summary: string
  created_at: string
  replay_count: number
  metadata: Record<string, string>
  project_id: string
}

export const providerColors: Record<Provider, { bg: string; text: string; border: string }> = {
  stripe: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  github: { bg: 'bg-zinc-500/10', text: 'text-zinc-300', border: 'border-zinc-500/30' },
  slack: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  notion: { bg: 'bg-zinc-100/10', text: 'text-zinc-100', border: 'border-zinc-300/30' },
  meta: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  linear: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  shopify: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  custom: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
}

export const statusColors: Record<EventStatus, { bg: string; text: string }> = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400' },
  replayed: { bg: 'bg-primary/10', text: 'text-primary' },
}

const now = new Date()

function minutesAgo(mins: number): string {
  return new Date(now.getTime() - mins * 60 * 1000).toISOString()
}

function hoursAgo(hours: number): string {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString()
}

function daysAgo(days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

export const mockProjects: Project[] = [
  {
    id: 'proj_main',
    name: 'Production API',
    slug: 'production-api',
    description: 'Main production webhook endpoint for all services',
    color: 'emerald',
    created_at: daysAgo(30),
    event_count: 5,
  },
  {
    id: 'proj_staging',
    name: 'Staging Environment',
    slug: 'staging',
    description: 'Testing and QA webhook endpoint',
    color: 'amber',
    created_at: daysAgo(14),
    event_count: 2,
  },
  {
    id: 'proj_marketing',
    name: 'Marketing Integrations',
    slug: 'marketing',
    description: 'Lead gen and campaign tracking webhooks',
    color: 'blue',
    created_at: daysAgo(7),
    event_count: 1,
  },
]

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find(p => p.slug === slug)
}

export const mockEvents: WebhookEvent[] = [
  {
    id: 'evt_1a2b3c4d5e6f7g8h',
    provider: 'stripe',
    event_type: 'payment_intent.succeeded',
    status: 'success',
    metadata: { amount: '$149.00', customer: 'cus_Nk2xP9' },
    payload: {
      id: 'pi_3OxYz1234567890',
      object: 'payment_intent',
      amount: 14900,
      currency: 'usd',
      status: 'succeeded',
      customer: 'cus_Nk2xP9',
      payment_method: 'pm_1234567890',
      description: 'Subscription payment for Pro plan',
      metadata: {
        order_id: 'order_12345',
        product: 'pro_monthly',
      },
      created: 1710000000,
      livemode: true,
    },
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': 't=1710000000,v1=abc123def456...',
      'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'Stripe-Version': '2023-10-16',
      'X-Request-Id': 'req_abc123',
      'Content-Length': '1234',
      'Accept': '*/*',
    },
    ai_summary: 'A successful payment of $149.00 was processed for customer cus_Nk2xP9. This appears to be a subscription payment for the Pro monthly plan. The payment method used was a card ending in the customer\'s default payment method. No action required - this is a routine successful transaction.',
    created_at: minutesAgo(2),
    replay_count: 0,
    project_id: 'proj_main',
  },
  {
    id: 'evt_2b3c4d5e6f7g8h9i',
    provider: 'github',
    event_type: 'push',
    status: 'success',
    metadata: { repo: 'acme/backend', branch: 'main' },
    payload: {
      ref: 'refs/heads/main',
      before: '6dcb09b5b57875f334f61aebed695e2e4193db5e',
      after: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      repository: {
        id: 123456789,
        name: 'backend',
        full_name: 'acme/backend',
        private: true,
      },
      pusher: {
        name: 'johndoe',
        email: 'john@acme.com',
      },
      commits: [
        {
          id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
          message: 'feat: add new API endpoint for user preferences',
          author: { name: 'John Doe', email: 'john@acme.com' },
        },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': 'abc123-def456-ghi789',
      'X-Hub-Signature-256': 'sha256=abc123...',
      'User-Agent': 'GitHub-Hookshot/abc123',
      'X-GitHub-Hook-ID': '123456789',
      'X-GitHub-Hook-Installation-Target-Type': 'repository',
    },
    ai_summary: 'A push event was triggered on the main branch of acme/backend repository. Developer John Doe committed a new feature adding an API endpoint for user preferences. This is a routine development activity with no immediate concerns.',
    created_at: minutesAgo(8),
    replay_count: 0,
    project_id: 'proj_main',
  },
  {
    id: 'evt_3c4d5e6f7g8h9i0j',
    provider: 'slack',
    event_type: 'message.posted',
    status: 'failed',
    metadata: { channel: '#deployments', user: 'john.doe' },
    payload: {
      type: 'message',
      channel: 'C1234567890',
      user: 'U1234567890',
      text: 'Deployment to production completed successfully :rocket:',
      ts: '1710000000.000000',
      team: 'T1234567890',
      event_ts: '1710000000.000000',
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Slack-Signature': 'v0=abc123...',
      'X-Slack-Request-Timestamp': '1710000000',
      'User-Agent': 'Slackbot 1.0 (+https://api.slack.com/robots)',
      'X-Slack-Retry-Num': '2',
      'X-Slack-Retry-Reason': 'http_timeout',
      'Accept': 'application/json,*/*',
    },
    ai_summary: 'This webhook delivery failed after 2 retry attempts due to an HTTP timeout. The message was posted in the #deployments channel by john.doe announcing a successful production deployment. The failure is likely due to your endpoint not responding within Slack\'s timeout window. Consider investigating your server\'s response times.',
    created_at: minutesAgo(15),
    replay_count: 0,
    project_id: 'proj_staging',
  },
  {
    id: 'evt_4d5e6f7g8h9i0j1k',
    provider: 'stripe',
    event_type: 'customer.subscription.deleted',
    status: 'failed',
    metadata: { plan: 'Pro', customer: 'cus_Mk8zQ2' },
    payload: {
      id: 'sub_1234567890',
      object: 'subscription',
      customer: 'cus_Mk8zQ2',
      status: 'canceled',
      cancel_at_period_end: false,
      canceled_at: 1710000000,
      items: {
        data: [
          {
            price: {
              id: 'price_pro_monthly',
              product: 'prod_pro',
              unit_amount: 4900,
              currency: 'usd',
            },
          },
        ],
      },
      metadata: {
        reason: 'customer_request',
      },
    },
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': 't=1710000000,v1=xyz789abc123...',
      'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'Stripe-Version': '2023-10-16',
      'X-Request-Id': 'req_xyz789',
      'Content-Length': '2048',
      'Accept': '*/*',
    },
    ai_summary: 'A Pro subscription was canceled for customer cus_Mk8zQ2. The webhook delivery failed, which means your system may not have processed this cancellation. This is critical - the customer should lose access to Pro features but your database may not reflect this. Immediate replay is recommended to ensure data consistency.',
    created_at: minutesAgo(32),
    replay_count: 0,
    project_id: 'proj_main',
  },
  {
    id: 'evt_5e6f7g8h9i0j1k2l',
    provider: 'notion',
    event_type: 'page.updated',
    status: 'success',
    metadata: { page: 'Q4 Roadmap' },
    payload: {
      object: 'page',
      id: 'abc123-def456-ghi789',
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-03-10T12:00:00.000Z',
      parent: {
        type: 'workspace',
        workspace: true,
      },
      properties: {
        title: {
          type: 'title',
          title: [{ text: { content: 'Q4 Roadmap' } }],
        },
      },
    },
    headers: {
      'Content-Type': 'application/json',
      'Notion-Signature': 'sha256=abc123...',
      'User-Agent': 'Notion-Webhooks/1.0',
      'X-Notion-Workspace-ID': 'ws_123456',
      'X-Request-ID': 'req_notion_123',
      'Accept': 'application/json',
      'X-Notion-API-Version': '2022-06-28',
    },
    ai_summary: 'The "Q4 Roadmap" page was updated in your Notion workspace. This is a routine content update notification. The webhook was delivered successfully and your integration should have processed the changes.',
    created_at: hoursAgo(1),
    replay_count: 0,
    project_id: 'proj_staging',
  },
  {
    id: 'evt_6f7g8h9i0j1k2l3m',
    provider: 'meta',
    event_type: 'lead_gen_form.submitted',
    status: 'replayed',
    metadata: { form: 'Summer Campaign' },
    payload: {
      object: 'page',
      entry: [
        {
          id: '123456789',
          time: 1710000000,
          changes: [
            {
              field: 'leadgen',
              value: {
                form_id: 'form_summer_2024',
                leadgen_id: 'lead_abc123',
                page_id: 'page_123456',
                created_time: 1710000000,
              },
            },
          ],
        },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature-256': 'sha256=meta123...',
      'User-Agent': 'Facebook-Webhooks/1.0',
      'X-FB-HTTP-Protocol': 'h2c',
      'Accept': '*/*',
      'X-FB-Request-ID': 'fb_req_123',
      'X-FB-Trace-ID': 'trace_abc123',
    },
    ai_summary: 'A new lead was submitted through your "Summer Campaign" lead generation form on Meta. This event was previously replayed, indicating there may have been an initial delivery issue that was resolved. The lead data should now be in your CRM.',
    created_at: hoursAgo(2),
    replay_count: 1,
    project_id: 'proj_marketing',
  },
  {
    id: 'evt_7g8h9i0j1k2l3m4n',
    provider: 'github',
    event_type: 'pull_request.opened',
    status: 'success',
    metadata: { pr: '#42 "Fix auth flow"' },
    payload: {
      action: 'opened',
      number: 42,
      pull_request: {
        id: 987654321,
        number: 42,
        title: 'Fix auth flow',
        state: 'open',
        user: {
          login: 'janedoe',
          id: 12345,
        },
        head: {
          ref: 'fix/auth-flow',
          sha: 'abc123def456',
        },
        base: {
          ref: 'main',
          sha: 'xyz789abc123',
        },
        body: 'This PR fixes the authentication flow issue where users were being logged out unexpectedly.',
      },
      repository: {
        id: 123456789,
        name: 'backend',
        full_name: 'acme/backend',
      },
    },
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'pull_request',
      'X-GitHub-Delivery': 'pr123-def456-ghi789',
      'X-Hub-Signature-256': 'sha256=ghpr123...',
      'User-Agent': 'GitHub-Hookshot/pr123',
      'X-GitHub-Hook-ID': '987654321',
      'X-GitHub-Hook-Installation-Target-Type': 'repository',
    },
    ai_summary: 'A new pull request #42 titled "Fix auth flow" was opened by janedoe on the acme/backend repository. The PR addresses an authentication issue where users were being unexpectedly logged out. This is a routine development notification.',
    created_at: hoursAgo(3),
    replay_count: 0,
    project_id: 'proj_main',
  },
  {
    id: 'evt_8h9i0j1k2l3m4n5o',
    provider: 'linear',
    event_type: 'issue.created',
    status: 'success',
    metadata: { issue: 'ENG-291 API timeout' },
    payload: {
      action: 'create',
      type: 'Issue',
      data: {
        id: 'issue_abc123',
        identifier: 'ENG-291',
        title: 'API timeout',
        description: 'Users are experiencing timeouts when calling the /api/users endpoint during peak hours.',
        state: {
          name: 'Todo',
          type: 'unstarted',
        },
        priority: 2,
        team: {
          id: 'team_eng',
          name: 'Engineering',
        },
        creator: {
          id: 'user_123',
          name: 'Sarah Chen',
        },
      },
    },
    headers: {
      'Content-Type': 'application/json',
      'Linear-Signature': 'sha256=linear123...',
      'User-Agent': 'Linear-Webhooks/1.0',
      'X-Linear-Delivery': 'delivery_abc123',
      'X-Linear-Event': 'Issue',
      'Accept': 'application/json',
      'X-Request-ID': 'linear_req_123',
    },
    ai_summary: 'A new issue ENG-291 "API timeout" was created in the Engineering team on Linear. The issue reports that users are experiencing timeouts on the /api/users endpoint during peak hours. Priority level is 2 (high). This may require immediate attention from the engineering team.',
    created_at: hoursAgo(5),
    replay_count: 0,
    project_id: 'proj_main',
  },
]

export function getEventById(id: string): WebhookEvent | undefined {
  return mockEvents.find(event => event.id === id)
}
