import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogIndex } from './_components/BlogIndex'
import { CategoryFilters, type TagGroup } from './_components/CategoryFilters'
import { JsonLd } from '@/components/JsonLd'
import type { Tag } from '@/payload-types'

export const revalidate = 60

const PER_PAGE = 12

const FILTER_KEYS = [
  { key: 'city', prefix: 'gorod-', label: 'Город' },
  { key: 'type', prefix: 'tip-', label: 'Тип места' },
  { key: 'free', prefix: 'besplatno-', label: 'Бесплатный вход' },
  { key: 'rec', prefix: 'rekomenduem-', label: 'Рекомендуем' },
  { key: 'time', prefix: 'vremya-', label: 'Время на посещение' },
  { key: 'season', prefix: 'sezon-', label: 'Сезон' },
]

type Props = {
  searchParams: Promise<{
    page?: string
    q?: string
    city?: string
    type?: string
    free?: string
    rec?: string
    time?: string
    season?: string
  }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const metadata: any = {
    title: 'Блог — Apsgram',
    description: 'Статьи об Абхазии',
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title: 'Блог — Apsgram',
      description: 'Статьи об Абхазии',
      type: 'website',
      url: '/blog',
    },
  }

  if (query) {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const query = sp.q?.trim() || ''

  const active: Record<string, string | undefined> = {
    city: sp.city,
    type: sp.type,
    free: sp.free,
    rec: sp.rec,
    time: sp.time,
    season: sp.season,
  }

  const payload = await getPayload({ config })

  const where: any = {
    and: [{ status: { equals: 'published' } }],
  }
  if (query) {
    where.and.push({ title: { contains: query } })
  }

  const activeSlugs = Object.values(active).filter((v): v is string => !!v)
  if (activeSlugs.length > 0) {
    const { docs: selectedTags } = await payload.find({
      collection: 'tags',
      where: { slug: { in: activeSlugs } },
      limit: 100,
    })
    if (selectedTags.length > 0) {
      selectedTags.forEach((t) => {
        where.and.push({ tags: { in: [t.id] } })
      })
    }
  }

  const {
    docs: posts,
    totalPages,
    page: currentPage,
  } = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: PER_PAGE,
    page,
    depth: 2,
  })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })

  const { docs: allTags } = await payload.find({
    collection: 'tags',
    limit: 500,
  })

  const groups: TagGroup[] = FILTER_KEYS.map(({ key, prefix, label }) => ({
    key,
    prefix,
    label,
    tags: (allTags as Tag[]).filter((t) => t.slug.startsWith(prefix)),
  }))

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (p > 1) params.set('page', String(p))
    Object.entries(active).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  const buildFilterHref = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Блог — Apsgram',
    url: '/blog',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  }

  return (
    <>
      <BlogIndex
        posts={posts}
        categories={categories}
        currentPage={currentPage ?? 1}
        totalPages={totalPages ?? 1}
        query={query}
        heading="Все категории"
        buildHref={buildHref}
        searchAction="/blog"
        filters={<CategoryFilters groups={groups} active={active} buildHref={buildFilterHref} />}
      />
      <JsonLd data={jsonLd} />
    </>
  )
}
