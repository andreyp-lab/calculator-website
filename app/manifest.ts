import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'חשבונאי - 30 מחשבונים פיננסיים בעברית',
    short_name: 'חשבונאי',
    description:
      '30 מחשבונים פיננסיים מקצועיים בעברית: מס הכנסה, משכנתא, השקעות, פיצויים, עצמאיים ועוד. עדכני 2026, בחינם.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: 'he',
    dir: 'rtl',
    categories: ['finance', 'productivity', 'education'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
