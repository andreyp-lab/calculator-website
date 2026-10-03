import type { MetadataRoute } from 'next';
import { blogPosts } from '@/content/blog/registry';
import { ALL_TERMS } from '@/lib/data/glossary';
import { BUSINESS_TYPES } from '@/lib/data/business-setup/business-types';
import { SALARY_PAGE_AMOUNTS } from '@/lib/data/salary-pages';

const SITE_URL = 'https://cheshbonai.co.il';

// תאריך עדכון תוכן יציב (anchored) — מונע מ-Google לראות את כל הדפים כאילו "עודכנו עכשיו"
// בכל crawl (סיגנל freshness מזויף). מעדכנים ידנית כשמרעננים תוכן בפועל.
const CONTENT_UPDATED = new Date('2026-09-29');
// רענון תוכן ייעודי לעמודים שהורחבו ב-12.6 (בלוק בידול) — סיגנל סריקה-מחדש אמיתי
const FRESH_2026_06_12 = new Date('2026-06-12');

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = CONTENT_UPDATED;

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
    make(`/blog/${post.slug}`, 'monthly', post.featured ? 0.85 : 0.75, new Date(post.updatedDate ?? post.date)),
  );

  return [
    // ===== עמודי בית =====
    make('', 'weekly', 1.0),
    make('/about', 'monthly', 0.6, new Date('2026-06-01')),
    make('/contact', 'monthly', 0.5, new Date('2026-09-29')),
    make('/course', 'monthly', 0.7), // דף נחיתה — קורסי FinSchool
    make('/course/self-employed', 'monthly', 0.8, new Date('2026-10-02')), // דף מכירה קורס עצמאים (משולב)
    make('/course/business', 'monthly', 0.8, new Date('2026-10-02')), // דף מכירה קורס בעלי עסקים (משולב)

    // ===== Hubs קטגוריות =====
    make('/salaried', 'weekly', 0.95),
    make('/salaried/payslip-guide', 'monthly', 0.9), // מדריך קריאת תלוש (pillar)
    make('/self-employed', 'weekly', 0.95, new Date('2026-10-01')),
    make('/loans', 'weekly', 0.95),
    make('/topics', 'weekly', 0.85),
    make('/guides', 'weekly', 0.85),
    make('/tools', 'weekly', 0.90),
    make('/business', 'weekly', 0.90, new Date('2026-09-29')), // hub: כמה עולה להקים עסק
    ...BUSINESS_TYPES.map((b) => make(`/business/${b.slug}`, 'monthly', 0.85, new Date('2026-09-29'))),
    make('/business/profit-and-loss-guide', 'monthly', 0.88, new Date('2026-10-02')),
    make('/business/working-capital-guide', 'monthly', 0.88, new Date('2026-10-02')),
    make('/business/business-credit-preparation', 'monthly', 0.86, new Date('2026-10-02')),

    // ===== קטגוריות משנה =====
    make('/employee-rights', 'weekly', 0.90),
    make('/personal-tax', 'weekly', 0.90),
    make('/real-estate', 'weekly', 0.90),
    make('/investments', 'weekly', 0.90),
    make('/savings', 'weekly', 0.90),
    make('/vehicles', 'weekly', 0.90, new Date('2026-10-02')), // מחיר בנזין 95 עודכן לפרסום אוקטובר
    make('/insurance', 'weekly', 0.85),

    // ===== מחשבונים: שכירים / מסים =====
    make('/personal-tax/salary-net-gross', 'weekly', 0.95, FRESH_2026_06_12),
    make('/salary', 'weekly', 0.9, new Date('2026-10-02')),
    // דפי "שכר X ברוטו כמה נטו" — פרוגרמטיים, נגזרים מאותה רשימת סכומים כמו הדפים עצמם
    ...SALARY_PAGE_AMOUNTS.map((a) => make(`/salary/${a}`, 'monthly', 0.8, new Date('2026-08-15'))),
    make('/personal-tax/tax-refund', 'weekly', 0.95, new Date('2026-10-02')),
    make('/personal-tax/tax-return-full', 'weekly', 0.9, new Date('2026-10-03')),
    make('/personal-tax/income-tax', 'monthly', 0.90),
    make('/personal-tax/tax-credits', 'monthly', 0.90),
    make('/personal-tax/work-value', 'monthly', 0.85),

    // ===== מחשבונים: זכויות עובד =====
    make('/employee-rights/severance', 'monthly', 0.95),
    make('/employee-rights/salary-deductions', 'weekly', 0.95, new Date('2026-07-01')), // מחשבון ניכויים ממשכורת (חדש)
    make('/employee-rights/maternity-benefits', 'monthly', 0.90),
    make('/employee-rights/unemployment-benefits', 'monthly', 0.90, new Date('2026-10-02')),
    make('/employee-rights/reserve-duty-pay', 'monthly', 0.90),
    make('/employee-rights/minimum-wage', 'monthly', 0.90),
    make('/employee-rights/recreation-pay', 'monthly', 0.90),
    make('/employee-rights/annual-leave', 'monthly', 0.85),
    make('/employee-rights/annual-bonus', 'monthly', 0.85),
    make('/employee-rights/sick-pay', 'monthly', 0.85),
    make('/employee-rights/work-grant', 'monthly', 0.90, new Date('2026-10-02')),
    // כוונת "בדיקת זכאות" (~261 חשיפות/חודש) — URL ייעודי, לא טאב בתוך דף המענק.
    make('/employee-rights/work-grant/eligibility', 'monthly', 0.90, new Date('2026-07-30')),
    // כוונת "מענק עבודה שנים קודמות / רטרואקטיבית" — כולל תיקון מיתוס 6 השנים (החוק: שנתיים בלבד).
    make('/employee-rights/work-grant/retroactive', 'monthly', 0.85, new Date('2026-07-30')),

    // ===== מחשבונים: עצמאיים =====
    make('/self-employed/opening-business', 'monthly', 0.92, new Date('2026-10-01')), // רענון מדריך הרישום והקישוריות
    make('/self-employed/first-90-days', 'monthly', 0.90, new Date('2026-10-02')),
    make('/self-employed/business-finance', 'monthly', 0.92, new Date('2026-07-01')), // מדריך ניהול כספים לעסק קטן (pillar חדש)
    make('/self-employed/year-end-tax-simulator', 'weekly', 0.95),
    make('/self-employed/net', 'weekly', 0.95),
    make('/self-employed/social-security', 'monthly', 0.95),
    make('/self-employed/vat', 'monthly', 0.90),
    make('/self-employed/tax-advances', 'monthly', 0.90),
    make('/self-employed/hourly-rate', 'monthly', 0.90, new Date('2026-10-02')),
    make('/self-employed/employer-cost', 'monthly', 0.90),
    make('/self-employed/mandatory-pension', 'monthly', 0.90, new Date('2026-09-28')),
    make('/self-employed/corporation-vs-individual', 'monthly', 0.90, new Date('2026-09-28')),
    make('/self-employed/dividend-vs-salary', 'monthly', 0.90, new Date('2026-09-28')),
    make('/self-employed/allowed-expenses', 'monthly', 0.9, new Date('2026-10-01')),
    make('/self-employed/vat-threshold', 'monthly', 0.9, new Date('2026-10-01')),
    make('/self-employed/invoices', 'monthly', 0.9, new Date('2026-10-01')),
    make('/self-employed/withholding-tax', 'monthly', 0.85, new Date('2026-10-01')),
    make('/self-employed/business-setup-cost', 'monthly', 0.9, new Date('2026-10-02')),
    make('/self-employed/employee-and-self-employed', 'monthly', 0.9, new Date('2026-10-01')),

    // ===== מחשבונים: נדל"ן =====
    make('/real-estate/mortgage', 'weekly', 0.95),
    make('/real-estate/mortgage-optimizer', 'weekly', 0.98), // הדגל
    make('/real-estate/purchase-tax', 'monthly', 0.90),
    make('/real-estate/capital-gains-tax', 'monthly', 0.90),
    make('/real-estate/rental-income-tax', 'monthly', 0.9), // מדריך מיסוי שכר דירה (pillar)

    // ===== מחשבונים: השקעות =====
    make('/investments/compound-interest', 'monthly', 0.95, new Date('2026-09-28')),
    make('/investments/retirement', 'monthly', 0.90, new Date('2026-09-28')),
    make('/investments/fire', 'monthly', 0.90, new Date('2026-09-28')),
    make('/investments/roi', 'monthly', 0.85, new Date('2026-09-28')),
    make('/investments/capital-gains-tax', 'monthly', 0.9, new Date('2026-09-28')),

    // ===== מחשבונים: חיסכון / הלוואות =====
    make('/savings/family-budget', 'monthly', 0.90),
    make('/savings/loan-repayment', 'monthly', 0.90),
    make('/savings/personal-loan', 'monthly', 0.90),

    // ===== מחשבונים: רכב =====
    make('/vehicles/leasing-vs-buying', 'monthly', 0.95),
    make('/vehicles/fuel-cost', 'monthly', 0.90, new Date('2026-10-02')),
    make('/vehicles/company-car-benefit', 'monthly', 0.90),

    // ===== מחשבונים: ביטוחים =====
    make('/insurance/pension', 'monthly', 0.90, new Date('2026-09-28')),

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
    make('/tools/vat-extract', 'monthly', 0.85),

    // ===== עדכוני שוק (ISR) =====
    make('/news', 'weekly', 0.85),
    make('/news/prime-rate', 'weekly', 0.85),
    make('/news/cpi', 'weekly', 0.80),
    make('/news/average-wage', 'monthly', 0.75),
    make('/news/iron-swords', 'weekly', 0.80),

    // ===== בלוג =====
    make('/blog', 'weekly', 0.85),
    ...blogEntries, // 44 פוסטי בלוג מתוך registry

    // ===== דפי השוואה =====
    make('/compare', 'monthly', 0.75, new Date('2026-10-01')),
    make('/compare/osek-patur-vs-murshe', 'monthly', 0.85, new Date('2026-10-01')),
    make('/compare/esek-zeir-vs-osek-patur', 'monthly', 0.85, new Date('2026-10-02')),
    make('/compare/employee-vs-self-employed', 'monthly', 0.85, new Date('2026-09-28')),
    make('/compare/rent-vs-buy', 'monthly', 0.85),
    make('/compare/leasing-mimuni-vs-tifuli', 'monthly', 0.85),
    make('/compare/keren-hishtalmut-vs-pikadon', 'monthly', 0.85),

    // ===== עמודי Pillar (מדריכים מקיפים) =====
    make('/guides/mortgage-complete-guide-2026', 'monthly', 0.98),
    make('/guides/taxes-complete-guide-2026', 'monthly', 0.98, new Date('2026-10-02')),
    make('/guides/employee-rights-complete-guide', 'monthly', 0.98),

    // ===== מילון מונחים =====
    make('/glossary', 'monthly', 0.92),
    // עמודי מונח בודדים — רק מונחים מהותיים (60+ מילים) נכנסים ל-sitemap ולאינדקס.
    // מונחים דקים מקבלים noindex (ראו app/glossary/[slug]/page.tsx) כדי לא לדלל crawl budget.
    ...ALL_TERMS.filter(
      (t) => t.definition.replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean).length >= 60,
    ).map((t) => make(`/glossary/${t.id}`, 'yearly', 0.5)),

    // ===== משפטי =====
    make('/accessibility', 'yearly', 0.3, new Date('2026-06-01')),
    make('/privacy', 'yearly', 0.3, new Date('2026-06-01')),
    make('/terms', 'yearly', 0.3, new Date('2026-06-01')),
  ];
}
