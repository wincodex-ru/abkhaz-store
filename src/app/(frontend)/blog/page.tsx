import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogIndex } from './_components/BlogIndex'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 60

const PER_PAGE = 12

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>
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
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const query = q?.trim() || ''

  const payload = await getPayload({ config })

  const where: any = {
    status: { equals: 'published' },
  }
  if (query) {
    where.title = { contains: query }
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
      />
      <JsonLd data={jsonLd} />
    </>
  )
}
