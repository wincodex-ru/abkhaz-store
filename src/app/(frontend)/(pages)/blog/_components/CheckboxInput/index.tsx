'use client'

import Icon from '@/components/Icon'
import styles from './index.module.css'

type Props = {
  id?: string
  label: string
  checked: boolean
  ariaLabel?: string
  onChange?: (checked: boolean) => void
}

export function CheckboxInput({ id, label, checked, ariaLabel, onChange }: Props) {
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.control}
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        aria-labelledby={id ? `${id}-label` : undefined}
        onClick={() => onChange?.(!checked)}
      >
        <span className={`${styles.box} ${checked ? styles.boxChecked : ''}`}>
          {checked && <Icon name="check" size={12} />}
        </span>
        <span className={styles.text}>{label}</span>
      </button>
    </div>
  )
}
