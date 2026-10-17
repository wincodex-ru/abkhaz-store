import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Category, Media, User } from '@/payload-types'
import Icon from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import styles from './index.module.css'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')
  const year = d.getFullYear()
  return `${day} ${month}. ${year}`
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

  const date = post.publishedAt ? formatDate(post.publishedAt) : null

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
        ...(categories.length > 0
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: categories[0].title,
                item: `/blog/category/${categories[0].slug}`,
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: categories.length > 0 ? 4 : 3,
          name: post.title,
          item: `/blog/${post.slug}`,
        },
      ],
    },
  }

  return (
    <article className={styles.root}>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Блог', href: '/blog' },
          ...(categories.length > 0
            ? [{ label: categories[0].title, href: `/blog/category/${categories[0].slug}` }]
            : []),
          { label: post.title },
        ]}
      />

      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.metaRow}>
        <div className={styles.authorMeta}>
          <span className={styles.avatar}></span>
          <span>{author?.name || 'Автор'}</span>
          {date && (
            <>
              <span className={styles.dot}>·</span>
              <time dateTime={post.publishedAt || undefined} className={styles.publishedAt}>
                {date}
              </time>
            </>
          )}
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            <Icon name="clock" size={16} />
            {post.readingTime || 1} мин
          </span>
        </div>
      </div>

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

      <JsonLd data={jsonLd} />
    </article>
  )
}
