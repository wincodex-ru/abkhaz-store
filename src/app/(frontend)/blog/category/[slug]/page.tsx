import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogIndex } from '../../_components/BlogIndex'

export const revalidate = 300

const PER_PAGE = 12

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; q?: string }>
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  const title = `${category.title} — Apsgram`
  const description = `Статьи об Абхазии в категории «${category.title}».`

  return {
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
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam, q } = await searchParams

  const category = await getCategory(slug)
  if (!category) notFound()

  const page = Math.max(1, Number(pageParam) || 1)
  const query = q?.trim() || ''

  const payload = await getPayload({ config })

  const where: any = {
    and: [{ status: { equals: 'published' } }, { categories: { in: [category.id] } }],
  }
  if (query) {
    where.and.push({ title: { contains: query } })
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

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (p > 1) params.set('page', String(p))
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
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
