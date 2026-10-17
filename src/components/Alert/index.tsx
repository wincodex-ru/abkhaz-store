'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '@/components/Icon'
import styles from './index.module.css'

type Kind = 'error' | 'success'

type AlertItem = {
  id: number
  kind: Kind
  message: string
}

type AlertContextValue = {
  error: (message: string) => void
  success: (message: string) => void
}

const AlertContext = createContext<AlertContextValue | null>(null)

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<AlertItem | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const push = useCallback((kind: Kind, message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setItem({ id: Date.now() + Math.random(), kind, message })
    timerRef.current = setTimeout(() => setItem(null), 4000)
  }, [])

  const value: AlertContextValue = {
    error: (m) => push('error', m),
    success: (m) => push('success', m),
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          {item && (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className={styles.alert}
            >
              <Icon
                name={item.kind === 'error' ? 'cross' : 'check'}
                size={18}
                className={item.kind === 'error' ? styles.iconError : styles.iconSuccess}
              />
              <span className={styles.text}>{item.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  )
}
