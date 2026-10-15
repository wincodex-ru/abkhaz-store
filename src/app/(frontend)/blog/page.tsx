import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import styles from './index.module.css'

export const revalidate = 60

export const metadata = {
  title: 'Блог — Apsgram',
}

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
  })

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Блог</h1>
      {posts.length === 0 ? (
        <p className={styles.empty}>Пока нет статей</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.item}>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                <h2 className={styles.itemTitle}>{post.title}</h2>
                {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
