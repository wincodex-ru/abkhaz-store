import React from 'react'
import { Onest } from 'next/font/google'
import { Layout } from '@/components/Layout'
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
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}