import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Category, Media, User } from '@/payload-types'
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

  const title = post.seo?.title || `${post.title} — Apsgram`
  const description = post.seo?.description || post.excerpt || undefined
  const seoImage = typeof post.seo?.image === 'object' ? (post.seo.image as Media) : null
  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const ogImage = seoImage?.url || cover?.url || undefined

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const author = typeof post.author === 'object' ? (post.author as User) : null
  const cover = typeof post.cover === 'object' ? (post.cover as Media) : null
  const categories = Array.isArray(post.categories)
    ? post.categories.filter((c): c is Category => typeof c === 'object')
    : []

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seo?.description || undefined,
    image: cover?.url || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt,
    author: author?.email ? { '@type': 'Person', name: author.email } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Apsgram',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: '/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `/blog/${post.slug}`,
        },
      ],
    },
  }

  return (
    <article className={styles.root}>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span> / </span>
        <Link href="/blog">Блог</Link>
        {categories.length > 0 && (
          <>
            <span> / </span>
            <Link href={`/blog/category/${categories[0].slug}`}>{categories[0].title}</Link>
          </>
        )}
      </nav>

      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.meta}>
        {author?.email && <span>{author.email}</span>}
        {date && <time dateTime={post.publishedAt || undefined}>{date}</time>}
        {post.readingTime && <span>· {post.readingTime} мин</span>}
      </div>

      {categories.length > 0 && (
        <div className={styles.categories}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/blog/category/${cat.slug}`} className={styles.category}>
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {cover?.url && (
        <Image
          src={cover.url}
          alt={cover.alt || post.title}
          width={cover.width || 1200}
          height={cover.height || 675}
          className={styles.cover}
          priority
        />
      )}

      <div className={styles.content}>
        <RichText data={post.content} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  )
}
