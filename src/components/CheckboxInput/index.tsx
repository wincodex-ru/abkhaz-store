'use client'

import Link from 'next/link'
import Icon from '@/components/Icon'
import styles from './index.module.css'

type Props = {
  id?: string
  label: string
  href: string
  checked: boolean
  ariaLabel?: string
  onNavigate?: () => void
}

export function CheckboxInput({ id, label, href, checked, ariaLabel, onNavigate }: Props) {
  return (
    <div className={styles.root}>
      <Link
        href={href}
        className={styles.control}
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        aria-labelledby={id ? `${id}-label` : undefined}
        onClick={() => onNavigate?.()}
      >
        <span className={`${styles.box} ${checked ? styles.boxChecked : ''}`}>
          {checked && <Icon name="check" size={12} />}
        </span>
        <span className={styles.text}>{label}</span>
      </Link>
    </div>
  )
}
