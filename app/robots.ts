import type { MetadataRoute } from 'next';

const SITE_URL = 'https://cheshbonai.co.il';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // כלל כללי לכל הבוטים
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      // כלל מפורש לבוטים של AI – מאפשר גישה לתוכן ול-llms.txt
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'anthropic-ai',
          'CCBot',
          'Googlebot-Extended',
          'PerplexityBot',
        ],
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
