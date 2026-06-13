import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  alternates: { canonical: '/self-employed' },
  title: 'מחשבונים לעצמאים ועסקים 2026 - מע"מ, ב.ל., מס ונטו',
  description: 'מחשבונים מקצועיים לעצמאיים ופרילנסרים 2026: מע"מ 18%, ביטוח לאומי, מקדמות מס הכנסה, נטו, תמחור שעה ועוד. גלה כמה נשאר לך ביד — חינמי ומדויק.',
};

const calculators = [
  {
    title: '📘 מדריך פתיחת עסק — עוסק פטור או מורשה?',
    description: 'מתחילים עסק? המדריך המלא לבחירה בין עוסק פטור למורשה, רישום מול הרשויות, תקרת 122,833 ₪ וטעויות נפוצות',
    href: '/self-employed/opening-business',
    available: true,
  },
  {
    title: '⭐ סימולטור הערכת מס לסוף שנה',
    description: 'הכלי המקיף ביותר: הכנסות + הוצאות + פנסיה + ב.ל. + מקדמות - הערכת חבות מס מלאה לסוף השנה',
    href: '/self-employed/year-end-tax-simulator',
    available: true,
  },
  {
    title: '💰 מחשבון נטו לעצמאי',
    description: 'כמה כסף נשאר ביד בסוף החודש? המרה מהירה ממחזור לנטו אחרי מס, ב.ל., מע"מ ופנסיה',
    href: '/self-employed/net',
    available: true,
  },
  {
    title: 'מחשבון מע"מ',
    description: 'הוספת או חילוץ מע"מ (18% ב-2026)',
    href: '/self-employed/vat',
    available: true,
  },
  {
    title: '🆕 מחשבון תקרת עוסק פטור',
    description: 'בדוק אם חצית את תקרת 122,833 ₪ — מה קורה בחריגה ומתי חובה לעבור לעוסק מורשה',
    href: '/self-employed/vat-threshold',
    available: true,
  },
  {
    title: '🆕 מחשבון הוצאות מוכרות לעצמאי',
    description: 'אילו הוצאות מוכרות במס וכמה — רכב 45%, טלפון, חדר עבודה, כיבוד 80% ועוד',
    href: '/self-employed/allowed-expenses',
    available: true,
  },
  {
    title: '🆕 מחשבון שכיר + עצמאי',
    description: 'עובד גם כשכיר וגם כפרילנסר? כמה באמת נשאר מההכנסה המשולבת אחרי מס וב.ל.',
    href: '/self-employed/employee-and-self-employed',
    available: true,
  },
  {
    title: '🆕 כמה עולה לפתוח עסק?',
    description: 'כל עלויות פתיחת העסק בשקלים — אגרות, רו"ח, ביטוחים וציוד',
    href: '/self-employed/business-setup-cost',
    available: true,
  },
  {
    title: '🆕 חשבונית מס, חשבונית עסקה או קבלה?',
    description: 'המדריך המלא לסוגי המסמכים — מה מוציאים, מתי, וההבדלים בין עוסק פטור למורשה',
    href: '/self-employed/invoices',
    available: true,
  },
  {
    title: 'מחשבון ביטוח לאומי לעצמאי',
    description: 'חישוב ב.ל. + בריאות, השוואה לשכיר, הטבת מס 52%, תיאום שנתי וזכויות',
    href: '/self-employed/social-security',
    available: true,
  },
  {
    title: 'מחשבון מקדמות מס',
    description: 'מקדמות מס הכנסה + ב.ל. + מע"מ - חישוב מלא, תזרים מזומנים, תיאום אמצע שנה',
    href: '/self-employed/tax-advances',
    available: true,
  },
  {
    title: 'מחשבון תמחור שעת עבודה',
    description: 'חישוב מחיר שעה לפרילנסר/יועץ - שכר רצוי + הוצאות + רווח',
    href: '/self-employed/hourly-rate',
    available: true,
  },
  {
    title: 'מחשבון עלות מעסיק',
    description: 'כמה עולה להעסיק עובד - שכר + ביטוח לאומי + פנסיה + הטבות',
    href: '/self-employed/employer-cost',
    available: true,
  },
  {
    title: 'חברה בע"מ vs עוסק מורשה',
    description: 'השוואת מס מצרפי - איזה מבנה עסקי משתלם יותר',
    href: '/self-employed/corporation-vs-individual',
    available: true,
  },
  {
    title: 'דיבידנד vs משכורת',
    description: 'אופטימיזציית מס לבעל חברה - מציאת המיקס האופטימלי',
    href: '/self-employed/dividend-vs-salary',
    available: true,
  },
];

export default function SelfEmployedPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'עצמאיים' }]} />
        </div>

        {/* Hero */}
        <div className="bg-ink-deep border border-cream/15 p-6 md:p-10 text-cream mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-3">
            // מרכז עצמאיים ✦
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-cream mb-3">מחשבונים לעצמאיים</h1>
          <p className="text-cream/70 text-lg mb-0">
            מחשבונים מקצועיים לעצמאיים, פרילנסרים ובעלי עסקים קטנים
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {calculators.map((calc) =>
            calc.available ? (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-paper border border-ink/15 hover:bg-paper-hover transition p-6 flex items-start gap-4"
              >
                <Calculator className="w-6 h-6 text-ink-mid flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink mb-1 group-hover:text-gold transition">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-ink/60">{calc.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gold mt-2 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ) : (
              <div
                key={calc.href}
                className="bg-cream-2 border border-ink/10 p-6 flex items-start gap-4 opacity-60"
              >
                <Calculator className="w-6 h-6 text-ink/30 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-ink/60 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/40">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/50 px-2 py-1 font-mono uppercase tracking-[0.1em]">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
