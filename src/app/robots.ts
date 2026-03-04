import type { MetadataRoute } from 'next'

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://onespec.io').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
