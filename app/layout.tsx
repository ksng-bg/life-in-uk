import './globals.css'
import type { Metadata, Viewport } from 'next'
import VersionInfo from './components/VersionInfo'
import AnalyticsWrapper from './components/AnalyticsWrapper'
import AboutFlap from './components/AboutFlap'
import './utils/errorSuppression'

export const metadata: Metadata = {
  title: 'Life in the UK Test',
  description: 'Practice Life in the UK citizenship test questions',
  // Keep this site out of Google / AI / any search index — only people with the link should find it
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%232f6bff"/><stop offset="1" stop-color="%231e40af"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23k)"/><text x="60" y="64" text-anchor="middle" dominant-baseline="central" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="56" letter-spacing="-3" fill="white">KS</text></svg>',
        type: 'image/svg+xml',
      },
    ],
    shortcut: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%232f6bff"/><stop offset="1" stop-color="%231e40af"/></linearGradient></defs><rect width="120" height="120" rx="28" fill="url(%23k)"/><text x="60" y="64" text-anchor="middle" dominant-baseline="central" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="56" letter-spacing="-3" fill="white">KS</text></svg>',
    apple: '/icon.svg',
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || ''
  
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AnalyticsWrapper gaId={GA_MEASUREMENT_ID} />
        {children}
        <AboutFlap />
        <VersionInfo />
      </body>
    </html>
  )
}
