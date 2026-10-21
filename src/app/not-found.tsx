import Link from 'next/link'
import type { Metadata } from 'next'
import { Onest } from 'next/font/google'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div
      className={onest.className}
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '76px',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-4px',
            background: 'linear-gradient(135deg, #0070f3 0%, #00c2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: '#0e0e0e',
            letterSpacing: '-0.3px',
          }}
        >
          Страница не найдена
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            lineHeight: 1.5,
            color: '#4d4d4d',
          }}
        >
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>

        <Link
          href="/blog"
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            height: '40px',
            padding: '0 24px',
            borderRadius: '9999px',
            background: '#0070f3',
            color: '#ffffff',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.15s ease',
          }}
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
