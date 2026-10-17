import React from 'react'
import { Onest } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { AlertProvider } from '@/components/Alert'
import './styles/globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
})

export const metadata = {
  description: 'Открой для себя Абхазию',
  title: 'Apsgram',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <AlertProvider>
          <Layout>{children}</Layout>
        </AlertProvider>
      </body>
    </html>
  )
}
