# HookLens
**AI-Powered Webhook Debugger**

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-hooklens-181717?style=for-the-badge&logo=github)

HookLens is a modern, developer-first webhook debugging tool that lets you capture, inspect, and replay webhooks from 50+ providers in real-time. Powered by AI, it automatically explains complex payloads in plain English, making debugging faster and easier than ever.

## ✨ Features
- **Instant Webhook Capture**: Intercept webhooks from Stripe, GitHub, Clerk, and 50+ providers with zero configuration
- **AI-Powered Insights**: Get plain-English explanations of complex webhook payloads via Groq/OpenAI integrations
- **One-Click Replay**: Replay any webhook to local or production backends to debug issues quickly
- **Secure by Default**: End-to-end encryption with no unencrypted data storage
- **Full Event History**: Searchable, filterable history of all webhook events by provider, status, or time range
- **Project Management**: Organize webhooks into projects, track event counts, and monitor success/failure rates
- **Developer-First DX**: Clean UI built with Radix UI, Tailwind CSS, and Framer Motion animations

## 🛠 Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI, Framer Motion
- **Backend**: Next.js API Routes, Supabase (Auth, PostgreSQL)
- **AI**: Vercel AI SDK (Groq, OpenAI)
- **Validation**: Zod, React Hook Form
- **Analytics**: Vercel Analytics

## 📋 Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for auth and database)
- API keys for AI features (Groq/OpenAI, optional but recommended)

## 🔧 Environment Variables
Create a `.env.local` file in the root directory with these variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI (Optional, for payload insights)
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key

# Webhook capture authentication
HOOKLENS_API_KEY=your_generated_api_key
```

## 🚀 Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/siddreddy07/hooklens.git
   cd hooklens
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or yarn / pnpm install
   ```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Create required tables:
     - `webhook_events`: (id, user_id, project_id, method, url, headers, body, provider, content_type, raw_body, query, created_at)
     - `projects`: (id, name, slug, color, user_id, total_events_count, successful_count, failed_count)
     - `api_keys`: (api_key, user_id)
   - Enable Supabase Auth (email/password or OAuth)

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📡 Capturing Webhooks
1. Generate an API key in your HookLens dashboard
2. Send webhook requests to your capture endpoint:
   ```bash
   POST https://your-domain.com/api/capture
   Headers:
     x-api-key: your_api_key
     Content-Type: application/json
   Body:
     {"provider": "stripe", "projectId": "your_project_id"}
   ```
3. View captured events in your dashboard

## 📜 Available Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Starts development server with hot-reload |
| `npm run build` | Builds the app for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check code quality |

## 🔌 Supported Providers
Works with 50+ providers out of the box including: Stripe, GitHub, Clerk, Slack, Notion, Meta, Linear, Shopify, Twilio, SendGrid, Discord, Vercel.

## 📂 Project Structure
```
hooklens/
├── app/                  # Next.js app router (pages, API routes, layouts)
│   ├── api/             # API routes (capture, chat, projects)
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── lib/             # Supabase clients and utilities
│   └── components/      # Reusable UI components
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 🔗 Links
- [GitHub Repository](https://github.com/siddreddy07/hooklens)
- [Documentation](https://hooklens-eta.vercel.app/docs) (local: `/docs`)
- [Live Demo](https://hooklens-eta.vercel.app/)

---

Crafted with ❤️ by [Siddharth](https://github.com/siddreddy07)
