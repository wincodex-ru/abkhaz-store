'use client'

import { useState } from 'react'
import Icon from '@/components/Icon'
import styles from './index.module.css'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, id, type, className = '', ...rest }: Props) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const actualType = isPassword && revealed ? 'text' : type

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrap}>
        <input
          id={id}
          type={actualType}
          {...rest}
          suppressHydrationWarning
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Скрыть пароль' : 'Показать пароль'}
            tabIndex={-1}
          >
            <Icon name={revealed ? 'eyeOff' : 'eye'} size={16} />
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
