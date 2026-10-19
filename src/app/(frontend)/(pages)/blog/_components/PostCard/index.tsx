import Link from 'next/link'
import Image from 'next/image'
import type { Post, Media, User } from '@/payload-types'
import Icon from '@/components/Icon'
import styles from './index.module.css'

type Props = {
  post: Post
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleDateString('ru-RU', { month: 'long' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function PostCard({ post }: Props) {
  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const author = typeof post.author === 'object' ? (post.author as User) : null

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
        <div className={styles.authorMeta}>
          <span>{author?.name}</span>
          {date && (
            <>
              <span className={styles.dot}>·</span>
              <time dateTime={post.publishedAt || undefined}>{date}</time>
            </>
          )}
        </div>

        <h2 className={styles.title}>{post.title}</h2>

        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </div>
    </Link>
  )
}
