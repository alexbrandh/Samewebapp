import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/discount/',
          '/favicon-for-app/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
