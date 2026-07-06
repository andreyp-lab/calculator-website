import type { MetadataRoute } from 'next';

const SITE_URL = 'https://cheshbonai.co.il';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // כלל כללי לכל הבוטים
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/lp/'],
      },
      // כלל מפורש לבוטים של AI – מאפשר גישה לתוכן ול-llms.txt
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'CCBot',
          'Google-Extended',
          'PerplexityBot',
          'Applebot-Extended',
          'YouBot',
        ],
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/lp/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
