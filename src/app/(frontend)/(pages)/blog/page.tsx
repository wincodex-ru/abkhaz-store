import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogIndex } from './_components/BlogIndex'
import { CategoryFilters, type TagGroup } from './_components/CategoryFilters'
import { JsonLd } from '@/components/JsonLd'
import type { Tag } from '@/payload-types'

export const revalidate = 60

const PER_PAGE = 12

const FILTER_KEYS = [
  { key: 'gorod', prefix: 'gorod-', label: 'Город' },
  { key: 'tip', prefix: 'tip-', label: 'Тип места' },
  { key: 'besplatno', prefix: 'besplatno', label: 'Бесплатный вход' },
  { key: 'rekomenduem', prefix: 'rekomenduem', label: 'Рекомендуем' },
  { key: 'sezon', prefix: 'sezon-', label: 'Сезон' },
]

type Props = {
  searchParams: Promise<{
    page?: string
    q?: string
    gorod?: string
    tip?: string
    besplatno?: string
    rekomenduem?: string
    sezon?: string
  }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const metadata: any = {
    title: 'Блог — Abkhaz Store',
    description: 'Статьи об Абхазии',
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title: 'Блог — Abkhaz Store',
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
    gorod: sp.gorod,
    tip: sp.tip,
    besplatno: sp.besplatno,
    rekomenduem: sp.rekomenduem,
    sezon: sp.sezon,
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
    let allowedIds: number[] | null = null
    let broken = false

    for (const slug of activeSlugs) {
      const { docs: tagDocs } = await payload.find({
        collection: 'tags',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      const tag = tagDocs[0]
      if (!tag) {
        broken = true
        break
      }

      const baseAnd: any[] = [{ status: { equals: 'published' } }, { tags: { in: [tag.id] } }]
      if (allowedIds) baseAnd.push({ id: { in: allowedIds } })

      const { docs: postDocs } = await payload.find({
        collection: 'posts',
        where: { and: baseAnd },
        limit: 1000,
        depth: 0,
        pagination: false,
      })

      allowedIds = postDocs.map((p) => p.id)
      if (allowedIds.length === 0) break
    }

    where.and.push({ id: { in: broken ? [] : (allowedIds ?? []) } })
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
    name: 'Блог — Abkhaz Store',
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
        filters={<CategoryFilters groups={groups} active={active} basePath="/blog" query={query} />}
      />
      <JsonLd data={jsonLd} />
    </>
  )
}
