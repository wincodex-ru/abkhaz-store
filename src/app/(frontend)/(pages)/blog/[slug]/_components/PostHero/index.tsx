import Image from 'next/image'
import Icon from '@/components/Icon'
import type { Media, User } from '@/payload-types'
import styles from './index.module.css'

type Props = {
  title: string
  cover: Media | null
  author: User | null
  date: string | null
  publishedAt: string | null
  readingTime: number | null
  location?: { lat?: number | null; lng?: number | null } | null
}

export function PostHero({
  title,
  cover,
  author,
  date,
  publishedAt,
  readingTime,
  location,
}: Props) {
  const lat = location?.lat
  const lng = location?.lng
  const hasCoords = typeof lat === 'number' && typeof lng === 'number'
  const mapUrl = hasCoords ? `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map` : null

  return (
    <div className={styles.hero}>
      {cover?.url && (
        <Image
          src={cover.url}
          alt={cover.alt || title}
          width={cover.width || 1200}
          height={cover.height || 600}
          className={styles.image}
          priority
        />
      )}
      <div className={styles.overlay} />

      {mapUrl && (
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapButton}>
          <Icon name="mapPin" size={16} />
          Маршрут
        </a>
      )}

      <div className={styles.body}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.meta}>
          <span className={styles.metaItem}>{author?.name}</span>
          {date && (
            <>
              <span className={styles.dot}>·</span>
              <time className={styles.metaItem} dateTime={publishedAt || undefined}>
                {date}
              </time>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
