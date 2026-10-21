'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '@/components/Icon'
import styles from './index.module.css'

export type SelectOption = {
  value?: string
  label: string
}

type Props = {
  id?: string
  label?: string
  options: SelectOption[]
  value?: string
  placeholder?: string
  ariaLabel?: string
  onSelect?: (value: string | undefined) => void
}

export function Select({
  id,
  label,
  options,
  value,
  placeholder = 'Все',
  ariaLabel,
  onSelect,
}: Props) {
  const uid = useId()
  const triggerId = id || `select-${uid}`
  const listId = `${triggerId}-list`
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const display = selected?.label ?? placeholder

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.triggerWrap}>
        <button
          id={triggerId}
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={ariaLabel || label}
          data-filled={selected ? 'true' : 'false'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.triggerText} ${selected ? '' : styles.triggerPlaceholder}`}>
            {display}
          </span>
          <Icon name="chevronUpDown" size={14} className={styles.triggerIcon} />
        </button>
        {label && (
          <label htmlFor={triggerId} className={styles.label}>
            {label}
          </label>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            className={styles.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05, ease: 'linear' }}
          >
            {options.map((opt, i) => {
              const isActive = opt.value === value
              return (
                <li key={`${opt.value ?? 'all'}-${i}`} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                    onClick={() => {
                      setOpen(false)
                      onSelect?.(opt.value)
                    }}
                  >
                    <span className={styles.optionLabel}>{opt.label}</span>
                    {isActive && <Icon name="check" size={14} className={styles.optionCheck} />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
