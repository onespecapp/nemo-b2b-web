import type { MetadataRoute } from 'next'

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://onespec.io').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/signup']

  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))

  entries.push({
    url: `${baseUrl}/tools/appointment-reminder-template`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  })

  return entries
}
