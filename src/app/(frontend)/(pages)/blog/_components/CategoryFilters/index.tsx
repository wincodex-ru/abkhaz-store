import Link from 'next/link'
import type { Tag } from '@/payload-types'
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
  buildHref: (next: Record<string, string | undefined>) => string
}

const ORDER = ['gorod-', 'tip-', 'besplatno-', 'rekomenduem-', 'vremya-', 'sezon-']

export function sortGroups(groups: TagGroup[]): TagGroup[] {
  return [...groups].sort((a, b) => ORDER.indexOf(a.prefix) - ORDER.indexOf(b.prefix))
}

export function CategoryFilters({ groups, active, buildHref }: Props) {
  const visible = sortGroups(groups).filter((g) => g.tags.length > 0)
  if (visible.length === 0) return null

  return (
    <div className={styles.root}>
      {visible.map((group) => (
        <div key={group.key} className={styles.group}>
          <span className={styles.label}>{group.label}</span>
          <div className={styles.options}>
            {group.tags.map((tag) => {
              const isActive = active[group.key] === tag.slug
              const next = { ...active, [group.key]: isActive ? undefined : tag.slug }
              return (
                <Link
                  key={tag.id}
                  href={buildHref(next)}
                  className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                >
                  {tag.title}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
