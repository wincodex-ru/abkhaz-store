import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
    payload.find({
      collection: 'categories',
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${serverUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${serverUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.docs.map((c) => ({
    url: `${serverUrl}/blog/category/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const postUrls: MetadataRoute.Sitemap = posts.docs.map((p) => ({
    url: `${serverUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticUrls, ...categoryUrls, ...postUrls]
}
