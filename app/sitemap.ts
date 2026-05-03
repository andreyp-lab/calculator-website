import type { MetadataRoute } from 'next';

const SITE_URL = 'https://calculator-website-eight.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // דפי בית וקטגוריות (priority גבוה)
  const mainPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // דפי קטגוריה
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/employee-rights`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/personal-tax`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // מחשבונים (priority גבוה - תוכן עיקרי)
  const calculatorPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/employee-rights/severance`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/employee-rights/recreation-pay`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/personal-tax/income-tax`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // בלוג ומאמרים
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${SITE_URL}/blog/tax-changes-2026`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // דפים משפטיים (priority נמוך)
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [...mainPages, ...categoryPages, ...calculatorPages, ...blogPages, ...legalPages];
}
