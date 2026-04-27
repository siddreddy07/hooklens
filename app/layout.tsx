import type { Metadata } from 'next'
import { JetBrains_Mono, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });
const _firaCode = Fira_Code({ subsets: ["latin"], variable: '--font-code' });

export const metadata: Metadata = {
  title: 'hooklens — AI-Powered Webhook Debugging',
  description: 'Debug webhooks with AI. Capture every event, understand it instantly, replay it anywhere.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-mono antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
