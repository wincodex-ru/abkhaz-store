import Link from 'next/link'
import styles from './index.module.css'

type Props = {
  href: string
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export function LinkButton({ href, variant = 'primary', size = 'md', children }: Props) {
  return (
    <Link href={href} className={`${styles.btn} ${styles[variant]} ${styles[size]}`}>
      {children}
    </Link>
  )
}
