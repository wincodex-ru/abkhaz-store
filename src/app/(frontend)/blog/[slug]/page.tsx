import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import styles from './index.module.css'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.seo?.title || `${post.title} — Apsgram`,
    description: post.seo?.description || post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const author = typeof post.author === 'object' ? post.author : null
  const cover = typeof post.cover === 'object' ? post.cover : null

  return (
    <article className={styles.root}>
      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.meta}>
        {author?.email && <span>{author.email}</span>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
          </time>
        )}
      </div>

      {cover?.url && <img src={cover.url} alt={cover.alt || post.title} className={styles.cover} />}

      <div className={styles.content}>
        <RichText data={post.content} />
      </div>
    </article>
  )
}
