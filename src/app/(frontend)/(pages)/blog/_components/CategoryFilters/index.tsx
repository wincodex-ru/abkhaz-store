'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Tag } from '@/payload-types'
import { Select, type SelectOption } from '@/components/Select'
import { CheckboxInput } from '@/components/CheckboxInput'
import { LinkButton } from '@/components/LinkButton'
import Icon from '@/components/Icon'
import styles from './index.module.css'

export type TagGroup = {
  key: string
  prefix: string
  label: string
  tags: Tag[]
}

type Props = {
  groups: TagGroup[]
  active: Record<string, string | undefined>
  basePath: string
  query?: string
}

const ORDER = ['gorod-', 'tip-', 'sezon-', 'besplatno', 'rekomenduem']

export function sortGroups(groups: TagGroup[]): TagGroup[] {
  return [...groups].sort((a, b) => ORDER.indexOf(a.prefix) - ORDER.indexOf(b.prefix))
}

function buildHref(
  basePath: string,
  query: string | undefined,
  next: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  Object.entries(next).forEach(([k, v]) => {
    if (v) params.set(k, v)
  })
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function CategoryFilters({ groups, active, basePath, query }: Props) {
  const visible = sortGroups(groups).filter((g) => g.tags.length > 0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (visible.length === 0) return null

  const hasActive = Object.values(active).some(Boolean)
  const href = (next: Record<string, string | undefined>) => buildHref(basePath, query, next)

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Фильтры"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="filter" size={16} />
        {hasActive && <span className={styles.dot} aria-hidden />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08, ease: 'linear' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label="Фильтры"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.head}>
                <span className={styles.headTitle}>Фильтры</span>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                >
                  <Icon name="cross" size={18} />
                </button>
              </div>

              <div className={styles.body}>
                {visible.map((group) => {
                  const isCheckbox = group.prefix === 'besplatno' || group.prefix === 'rekomenduem'
                  const targetSlug = group.prefix === 'besplatno' ? 'besplatno' : 'rekomenduem'

                  if (isCheckbox) {
                    const isChecked = active[group.key] === targetSlug
                    const next = { ...active, [group.key]: isChecked ? undefined : targetSlug }
                    return (
                      <div key={group.key} className={styles.field}>
                        <CheckboxInput
                          id={`filter-${group.key}`}
                          label={group.label}
                          href={href(next)}
                          checked={isChecked}
                          ariaLabel={group.label}
                          onNavigate={() => setOpen(false)}
                        />
                      </div>
                    )
                  }

                  const options: SelectOption[] = [
                    { label: 'Все', href: href({ ...active, [group.key]: undefined }) },
                    ...group.tags.map((tag) => ({
                      value: tag.slug,
                      label: tag.title,
                      href: href({
                        ...active,
                        [group.key]: active[group.key] === tag.slug ? undefined : tag.slug,
                      }),
                    })),
                  ]

                  return (
                    <div key={group.key} className={styles.field}>
                      <Select
                        id={`filter-${group.key}`}
                        label={group.label}
                        options={options}
                        value={active[group.key]}
                        placeholder="Все"
                        ariaLabel={group.label}
                        onNavigate={() => setOpen(false)}
                      />
                    </div>
                  )
                })}
              </div>

              {hasActive && (
                <div className={styles.foot} onClick={() => setOpen(false)}>
                  <LinkButton variant="ghost" href={href({})}>
                    Сбросить
                  </LinkButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
