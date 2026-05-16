import type { MetadataRoute } from 'next';
import { blogPosts } from '@/content/blog/registry';

const SITE_URL = 'https://cheshbonai.co.il';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // עזר ליצירת רשומות
  const make = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
    priority: number = 0.8,
    lastMod: Date = lastModified,
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastMod,
    changeFrequency,
    priority,
  });

  // אוטומטית מ-Registry
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) =>
    make(`/blog/${post.slug}`, 'monthly', post.featured ? 0.85 : 0.75, new Date(post.date)),
  );

  return [
    // ===== עמודי בית =====
    make('', 'weekly', 1.0),
    make('/about', 'monthly', 0.6),
    make('/contact', 'monthly', 0.5),

    // ===== Hubs קטגוריות =====
    make('/salaried', 'weekly', 0.95),
    make('/self-employed', 'weekly', 0.95),
    make('/loans', 'weekly', 0.95),
    make('/topics', 'weekly', 0.85),
    make('/tools', 'weekly', 0.90),

    // ===== קטגוריות משנה =====
    make('/employee-rights', 'weekly', 0.90),
    make('/personal-tax', 'weekly', 0.90),
    make('/real-estate', 'weekly', 0.90),
    make('/investments', 'weekly', 0.90),
    make('/savings', 'weekly', 0.90),
    make('/vehicles', 'weekly', 0.90),
    make('/insurance', 'weekly', 0.85),

    // ===== מחשבונים: שכירים / מסים =====
    make('/personal-tax/salary-net-gross', 'weekly', 0.95),
    make('/personal-tax/tax-refund', 'weekly', 0.95),
    make('/personal-tax/income-tax', 'monthly', 0.90),
    make('/personal-tax/tax-credits', 'monthly', 0.90),
    make('/personal-tax/work-value', 'monthly', 0.85),

    // ===== מחשבונים: זכויות עובד =====
    make('/employee-rights/severance', 'monthly', 0.95),
    make('/employee-rights/maternity-benefits', 'monthly', 0.90),
    make('/employee-rights/unemployment-benefits', 'monthly', 0.90),
    make('/employee-rights/reserve-duty-pay', 'monthly', 0.90),
    make('/employee-rights/minimum-wage', 'monthly', 0.90),
    make('/employee-rights/recreation-pay', 'monthly', 0.90),
    make('/employee-rights/annual-leave', 'monthly', 0.85),
    make('/employee-rights/annual-bonus', 'monthly', 0.85),
    make('/employee-rights/sick-pay', 'monthly', 0.85),
    make('/employee-rights/work-grant', 'monthly', 0.90),

    // ===== מחשבונים: עצמאיים =====
    make('/self-employed/year-end-tax-simulator', 'weekly', 0.95),
    make('/self-employed/net', 'weekly', 0.95),
    make('/self-employed/social-security', 'monthly', 0.95),
    make('/self-employed/vat', 'monthly', 0.90),
    make('/self-employed/tax-advances', 'monthly', 0.90),
    make('/self-employed/hourly-rate', 'monthly', 0.90),
    make('/self-employed/employer-cost', 'monthly', 0.90),
    make('/self-employed/mandatory-pension', 'monthly', 0.90),
    make('/self-employed/corporation-vs-individual', 'monthly', 0.90),
    make('/self-employed/dividend-vs-salary', 'monthly', 0.90),

    // ===== מחשבונים: נדל"ן =====
    make('/real-estate/mortgage', 'weekly', 0.95),
    make('/real-estate/mortgage-optimizer', 'weekly', 0.98), // הדגל
    make('/real-estate/purchase-tax', 'monthly', 0.90),
    make('/real-estate/capital-gains-tax', 'monthly', 0.90),

    // ===== מחשבונים: השקעות =====
    make('/investments/compound-interest', 'monthly', 0.95),
    make('/investments/retirement', 'monthly', 0.90),
    make('/investments/fire', 'monthly', 0.90),
    make('/investments/roi', 'monthly', 0.85),

    // ===== מחשבונים: חיסכון / הלוואות =====
    make('/savings/family-budget', 'monthly', 0.90),
    make('/savings/loan-repayment', 'monthly', 0.90),
    make('/savings/personal-loan', 'monthly', 0.90),

    // ===== מחשבונים: רכב =====
    make('/vehicles/leasing-vs-buying', 'monthly', 0.95),
    make('/vehicles/fuel-cost', 'monthly', 0.90),
    make('/vehicles/company-car-benefit', 'monthly', 0.90),

    // ===== מחשבונים: ביטוחים =====
    make('/insurance/pension', 'monthly', 0.90),

    // ===== כלים מקצועיים =====
    make('/tools/unified', 'monthly', 0.90),
    make('/tools/start', 'monthly', 0.85),
    make('/tools/budget', 'monthly', 0.85),
    make('/tools/budget-wizard', 'monthly', 0.85),
    make('/tools/cash-flow', 'monthly', 0.85),
    make('/tools/cashflow-solo', 'monthly', 0.85),
    make('/tools/forecast', 'monthly', 0.85),
    make('/tools/financial-analysis', 'monthly', 0.85),
    make('/tools/loan-eligibility', 'monthly', 0.85),
    make('/tools/break-even', 'monthly', 0.85),
    make('/tools/business-valuation', 'monthly', 0.85),
    make('/tools/customer-lifetime-value', 'monthly', 0.85),
    make('/tools/capital', 'monthly', 0.85),

    // ===== בלוג =====
    make('/blog', 'daily', 0.85),
    ...blogEntries, // 44 פוסטי בלוג מתוך registry

    // ===== דפי השוואה =====
    make('/compare/employee-vs-self-employed', 'monthly', 0.85),
    make('/compare/rent-vs-buy', 'monthly', 0.85),
    make('/compare/leasing-vs-buying-comparison', 'monthly', 0.85),

    // ===== עמודי Pillar (מדריכים מקיפים) =====
    make('/guides/mortgage-complete-guide-2026', 'monthly', 0.98),
    make('/guides/taxes-complete-guide-2026', 'monthly', 0.98),
    make('/guides/employee-rights-complete-guide', 'monthly', 0.98),

    // ===== מילון מונחים =====
    make('/glossary', 'monthly', 0.92),

    // ===== משפטי =====
    make('/privacy', 'yearly', 0.3),
    make('/terms', 'yearly', 0.3),
  ];
}
