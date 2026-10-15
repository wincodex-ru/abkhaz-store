import Link from 'next/link'
import { LinkButton } from '@/components/LinkButton'
import styles from './index.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        apsgram
      </Link>
      <div className={styles.actions}>
        <LinkButton href="/login" size="sm">
          Войти
        </LinkButton>
      </div>
    </header>
  )
}
