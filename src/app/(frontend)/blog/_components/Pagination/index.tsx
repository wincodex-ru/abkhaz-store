import Link from 'next/link'
import Icon from '@/components/Icon'
import styles from './index.module.css'

type Props = {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

function getPages(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'dots')[] = [1]

  if (current > 3) pages.push('dots')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('dots')

  pages.push(total)

  return pages
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  const pages = getPages(currentPage, totalPages)
  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <nav className={styles.root} aria-label="Пагинация">
      <Link
        href={buildHref(currentPage - 1)}
        className={`${styles.page} ${prevDisabled ? styles.disabled : ''}`}
        aria-disabled={prevDisabled}
        rel="prev"
        aria-label="Предыдущая страница"
      >
        <Icon name="chevronLeft" size={18} />
      </Link>

      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} className={styles.dots}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`${styles.page} ${p === currentPage ? styles.active : ''}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(currentPage + 1)}
        className={`${styles.page} ${nextDisabled ? styles.disabled : ''}`}
        aria-disabled={nextDisabled}
        rel="next"
        aria-label="Следующая страница"
      >
        <Icon name="chevronRight" size={18} />
      </Link>
    </nav>
  )
}
