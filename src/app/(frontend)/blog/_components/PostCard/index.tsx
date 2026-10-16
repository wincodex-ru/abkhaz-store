import Link from 'next/link'
import Image from 'next/image'
import type { Post, Category, Media } from '@/payload-types'
import styles from './index.module.css'

type Props = {
  post: Post
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')
  const year = d.getFullYear()
  return `${day} ${month}. ${year}`
}

export function PostCard({ post }: Props) {
  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const categories = Array.isArray(post.categories)
    ? post.categories.filter((c): c is Category => typeof c === 'object')
    : []

  const date = post.publishedAt ? formatDate(post.publishedAt) : null

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      {cover?.url && (
        <Image
          src={cover.url}
          alt={cover.alt || post.title}
          width={cover.width || 800}
          height={cover.height || 450}
          className={styles.cover}
        />
      )}
      <div className={styles.body}>
        {categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map((cat) => (
              <span key={cat.id} className={styles.category}>
                {cat.title}
              </span>
            ))}
          </div>
        )}
        <h2 className={styles.title}>{post.title}</h2>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        <div className={styles.meta}>
          {date && <time dateTime={post.publishedAt || undefined}>{date}</time>}
          {post.readingTime && (
            <>
              <span className={styles.dot}>·</span>
              <span>{post.readingTime} мин чтения</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
