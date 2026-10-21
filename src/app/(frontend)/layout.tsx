import React from 'react'
import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { AlertProvider } from '@/components/Alert'
import { JsonLd } from '@/components/JsonLd'
import './styles/globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
})

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(serverUrl),
  title: {
    default: 'Abkhaz Store',
    template: '%s — Abkhaz Store',
  },
  description: 'Открой для себя Абхазию: города, места, пляжи, маршруты и статьи.',
  applicationName: 'Abkhaz Store',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Abkhaz Store',
    locale: 'ru_RU',
    url: '/',
    title: 'Abkhaz Store',
    description: 'Открой для себя Абхазию: города, места, пляжи, маршруты и статьи.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const siteLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${serverUrl}/#organization`,
      name: 'Abkhaz Store',
      url: serverUrl,
      logo: `${serverUrl}/favicon.ico`,
    },
    {
      '@type': 'WebSite',
      '@id': `${serverUrl}/#website`,
      url: serverUrl,
      name: 'Abkhaz Store',
      inLanguage: 'ru',
      publisher: { '@id': `${serverUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${serverUrl}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <AlertProvider>
          <Layout>{children}</Layout>
        </AlertProvider>
        <JsonLd data={siteLd} />
      </body>
    </html>
  )
}
