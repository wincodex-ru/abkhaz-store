import Link from 'next/link'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LinkButton } from '@/components/LinkButton'
import styles from './index.module.css'

export async function Header() {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        apsgram
      </Link>
      <nav className={styles.center}>
        <LinkButton href="/blog" variant="plain">
          Блог
        </LinkButton>
      </nav>
      <div className={styles.actions}>
        {user ? (
          <LinkButton href="/profile" size="sm">
            Профиль
          </LinkButton>
        ) : (
          <LinkButton href="/sign-in" size="sm">
            Войти
          </LinkButton>
        )}
      </div>
    </header>
  )
}
