import Link from 'next/link'
import Image from 'next/image'
import type { Post, Media, User } from '@/payload-types'
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

function lexicalToPlainText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(lexicalToPlainText).join(' ')
  let text = ''
  if (node.text) text += node.text + ' '
  if (node.children) text += lexicalToPlainText(node.children)
  return text
}

function getPreview(content: any, limit = 160): string {
  const text = lexicalToPlainText(content?.root).replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  return text.slice(0, limit).replace(/\s+\S*$/, '') + '…'
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

        {post.content && <p className={styles.excerpt}>{getPreview(post.content)}</p>}
      </div>
    </Link>
  )
}
