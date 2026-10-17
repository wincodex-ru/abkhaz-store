'use client'

import styles from './index.module.css'

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export function Form({ onSubmit, children }: Props) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {children}
    </form>
  )
}
