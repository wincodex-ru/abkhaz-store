import React from 'react'
import { Layout } from '@/components/Layout'
import './styles/globals.css'

export const metadata = {
  description: 'Открой для себя Абхазию',
  title: 'Apsgram',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
