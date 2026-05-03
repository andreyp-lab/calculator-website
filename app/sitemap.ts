import type { MetadataRoute } from 'next';

const SITE_URL = 'https://calculator-website-eight.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // עזר ליצירת רשומות
  const make = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
    priority: number = 0.8,
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    // עמודי בית
    make('', 'weekly', 1.0),
    make('/about', 'monthly', 0.7),
    make('/contact', 'monthly', 0.5),

    // ===== קטגוריות =====
    make('/employee-rights', 'weekly', 0.9),
    make('/personal-tax', 'weekly', 0.9),
    make('/real-estate', 'weekly', 0.9),
    make('/self-employed', 'weekly', 0.9),
    make('/investments', 'weekly', 0.9),
    make('/savings', 'weekly', 0.9),
    make('/vehicles', 'weekly', 0.9),
    make('/insurance', 'weekly', 0.9),

    // ===== מחשבונים פיננסי אישי =====
    make('/employee-rights/severance', 'monthly', 0.9),
    make('/employee-rights/recreation-pay', 'monthly', 0.9),
    make('/personal-tax/income-tax', 'monthly', 0.9),
    make('/personal-tax/tax-credits', 'monthly', 0.9),
    make('/real-estate/mortgage', 'monthly', 0.9),
    make('/real-estate/purchase-tax', 'monthly', 0.9),
    make('/self-employed/vat', 'monthly', 0.9),
    make('/self-employed/hourly-rate', 'monthly', 0.9),
    make('/self-employed/employer-cost', 'monthly', 0.9),

    // ===== מחשבוני השקעות =====
    make('/investments/compound-interest', 'monthly', 0.9),
    make('/investments/roi', 'monthly', 0.9),
    make('/investments/retirement', 'monthly', 0.9),

    // ===== מחשבוני חיסכון =====
    make('/savings/family-budget', 'monthly', 0.9),
    make('/savings/loan-repayment', 'monthly', 0.9),

    // ===== מחשבוני רכב =====
    make('/vehicles/fuel-cost', 'monthly', 0.9),
    make('/vehicles/leasing-vs-buying', 'monthly', 0.9),

    // ===== מחשבוני ביטוחים =====
    make('/insurance/pension', 'monthly', 0.9),

    // ===== כלים מקצועיים =====
    make('/tools', 'weekly', 0.85),
    make('/tools/unified', 'monthly', 0.9),
    make('/tools/budget', 'monthly', 0.85),
    make('/tools/cash-flow', 'monthly', 0.85),
    make('/tools/financial-analysis', 'monthly', 0.85),

    // ===== בלוג =====
    make('/blog', 'weekly', 0.7),
    make('/blog/tax-changes-2026', 'monthly', 0.7),

    // ===== משפטי =====
    make('/privacy', 'yearly', 0.3),
    make('/terms', 'yearly', 0.3),
  ];
}
