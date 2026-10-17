import type { Metadata } from 'next'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LogoutButton } from './_components/LogoutButton'
import styles from './index.module.css'

export const metadata: Metadata = {
  title: 'Профиль — Apsgram',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/sign-in')

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Профиль</h1>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>Имя</dt>
          <dd>{(user as any).name || '—'}</dd>
        </div>
        <div className={styles.row}>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
      <LogoutButton />
    </div>
  )
}
