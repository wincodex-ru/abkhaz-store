import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogIndex } from '../../_components/BlogIndex'
import { CategoryFilters, type TagGroup } from '../../_components/CategoryFilters'
import { JsonLd } from '@/components/JsonLd'
import type { Tag } from '@/payload-types'

export const revalidate = 300

const PER_PAGE = 12

const FILTER_KEYS = [
  { key: 'gorod', prefix: 'gorod-', label: 'Город' },
  { key: 'tip', prefix: 'tip-', label: 'Тип места' },
  { key: 'besplatno', prefix: 'besplatno', label: 'Бесплатный вход' },
  { key: 'rekomenduem', prefix: 'rekomenduem', label: 'Рекомендуем' },
  { key: 'sezon', prefix: 'sezon-', label: 'Сезон' },
]

type Props = {
  params: Promise<{ slug: string }>
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

async function getCategory(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params
  const { q } = await searchParams
  const query = q?.trim() || ''

  const category = await getCategory(slug)
  if (!category) return {}

  const title = category.title
  const description = `Статьи об Абхазии в категории «${category.title}».`

  const metadata: any = {
    title,
    description,
    alternates: {
      canonical: `/blog/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/blog/category/${category.slug}`,
    },
  }

  if (query) {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const category = await getCategory(slug)
  if (!category) notFound()

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
    and: [{ status: { equals: 'published' } }, { categories: { in: [category.id] } }],
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

      const baseAnd: any[] = [
        { status: { equals: 'published' } },
        { categories: { in: [category.id] } },
        { tags: { in: [tag.id] } },
      ]
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
    const base = `/blog/category/${category.slug}`
    return qs ? `${base}?${qs}` : base
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.title,
    url: `/blog/category/${category.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: '/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.title,
          item: `/blog/category/${category.slug}`,
        },
      ],
    },
  }

  return (
    <>
      <BlogIndex
        posts={posts}
        categories={categories}
        currentPage={currentPage ?? 1}
        totalPages={totalPages ?? 1}
        query={query}
        activeCategorySlug={category.slug}
        heading={category.title}
        buildHref={buildHref}
        searchAction={`/blog/category/${category.slug}`}
        filters={
          <CategoryFilters
            groups={groups}
            active={active}
            basePath={`/blog/category/${category.slug}`}
            query={query}
          />
        }
      />
      <JsonLd data={jsonLd} />
    </>
  )
}
