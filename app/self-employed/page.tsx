import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calculator, LayoutDashboard, Wallet, TrendingUp, BarChart3, LineChart, Target } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { CourseCTA } from '@/components/marketing/CourseCTA';

/** כלים מתקדמים לניהול פיננסי של העסק (B2B) */
const businessTools = [
  { href: '/tools/unified', icon: LayoutDashboard, title: 'מערכת מאוחדת לניהול כספי העסק', description: 'תקציב + תזרים + ניתוח דוחות במקום אחד', badge: 'מומלץ' },
  { href: '/tools/budget-wizard', icon: Target, title: 'אשף תקציב שנתי לעסק', description: '10 שאלות מודרכות → תקציב שנתי מוכן' },
  { href: '/tools/cash-flow', icon: Wallet, title: 'תזרים מזומנים לעסק', description: 'יתרות בנק, תחזיות והתראות גירעון' },
  { href: '/tools/budget', icon: TrendingUp, title: 'תכנון תקציב ורווח והפסד', description: 'P&L, הכנסות, הוצאות ועובדים' },
  { href: '/tools/financial-analysis', icon: BarChart3, title: 'ניתוח דוחות כספיים', description: 'יחסים פיננסיים, Z-Score ודירוג אשראי' },
  { href: '/tools/forecast', icon: LineChart, title: 'חיזוי פיננסי לעסק', description: 'תחזיות הכנסה ותרחישים' },
];

export const metadata: Metadata = {
  alternates: { canonical: '/self-employed' },
  title: 'כלים ומדריכים לעצמאים ועסקים 2026 - מע"מ, ביטוח לאומי ומס',
  description: 'כלים ומדריכים לעצמאים ופרילנסרים: מע״מ, ביטוח לאומי, מקדמות מס הכנסה, תזרים ותמחור שעה, עם הפניות לחישוב אישי במקורות הרשמיים.',
};

const calculators = [
  {
    stage: 'start',
    title: 'בעל עסק זעיר או עוסק פטור — מה ההבדל?',
    description: 'מסלול במס הכנסה מול סיווג במע״מ, והמצבים שבהם אפשר להיות בשניהם במקביל',
    href: '/compare/esek-zeir-vs-osek-patur',
    available: true,
  },
  {
    stage: 'start',
    title: 'עוסק פטור או עוסק מורשה — מה ההבדל?',
    description: 'השוואה בין המעמדות במע״מ: גבייה, מס תשומות, מסמכים ודיווחים, וההבדל ממסלול בעל עסק זעיר.',
    href: '/compare/osek-patur-vs-murshe',
    available: true,
  },
  {
    stage: 'start',
    title: '📘 מדריך פתיחת עסק — עוסק פטור או מורשה?',
    description: 'רישום מול הרשויות, מסמכים להכנה ומה עושים אחרי שהתיק נפתח',
    href: '/self-employed/opening-business',
    available: true,
  },
  {
    stage: 'start',
    title: '90 הימים הראשונים אחרי פתיחת עוסק',
    description: 'סדר פעולות מעשי לחשבוניות, תיעוד, דיווחים, מקדמות ובדיקת החיובים הראשונים',
    href: '/self-employed/first-90-days',
    available: true,
  },
  {
    stage: 'start',
    title: '🏗️ כמה עולה להקים עסק? מדריך לתקציב פתיחה',
    description: 'רכיבי ההשקעה וההוצאות שיש לאסוף לקראת תכנון תקציב, עם קישורים לאגרות הרשמיות',
    href: '/self-employed/business-setup-cost',
    available: true,
  },
  {
    stage: 'growth',
    title: '📗 מדריך ניהול כספים לעסק קטן',
    description: 'השיטה המלאה: הפרדת חשבון עסקי-פרטי, תזרים מזומנים 13 שבועות, תכנון מס ומקדמות, דוח רווח והפסד ומתי לשכור רו"ח',
    href: '/self-employed/business-finance',
    available: true,
  },
  {
    stage: 'tax',
    title: 'בדיקת נתונים לקראת דוח סוף שנה',
    description: 'אילו אסמכתאות לאסוף כדי לבדוק הכנסות, הוצאות, הפקדות ומקדמות מול השומה',
    href: '/self-employed/year-end-tax-simulator',
    available: true,
  },
  {
    stage: 'tax',
    title: '💰 בדיקת הכנסה פנויה לעצמאי',
    description: 'אילו נתונים צריך לאסוף כדי להעריך רווח, מסים ותזרים בלי להניח שיעור הוצאה אחיד',
    href: '/self-employed/net',
    available: true,
  },
  {
    stage: 'daily',
    title: 'מחשבון מע"מ',
    description: 'הוספת או חילוץ מע"מ (18% ב-2026)',
    href: '/self-employed/vat',
    available: true,
  },
  {
    stage: 'start',
    title: 'תקרת עוסק פטור — מדריך',
    description: 'בדקו את המחזור מול תקרת 2026 ואת שלבי העדכון מול רשות המסים',
    href: '/self-employed/vat-threshold',
    available: true,
  },
  {
    stage: 'daily',
    title: 'הוצאות מוכרות לעצמאי — מה בודקים?',
    description: 'הוצאות עסקיות ומעורבות, תיעוד, פחת וההבדל בין מס הכנסה למע״מ',
    href: '/self-employed/allowed-expenses',
    available: true,
  },
  {
    stage: 'start',
    title: 'שכיר ועצמאי במקביל',
    description: 'אילו נתונים להכין לבדיקת מס הכנסה ודמי ביטוח כשיש גם משכורת וגם עסק',
    href: '/self-employed/employee-and-self-employed',
    available: true,
  },
  {
    stage: 'daily',
    title: 'חשבונית מס, חשבונית עסקה או קבלה?',
    description: 'המדריך המלא לסוגי המסמכים — מה מוציאים, מתי, וההבדלים בין עוסק פטור למורשה',
    href: '/self-employed/invoices',
    available: true,
  },
  {
    stage: 'daily',
    title: 'ניכוי מס במקור ואישור ניהול ספרים',
    description: 'מה שולחים ללקוח, איך בודקים אישור ואילו אסמכתאות שומרים כשהלקוח מנכה מס',
    href: '/self-employed/withholding-tax',
    available: true,
  },
  {
    stage: 'tax',
    title: 'ביטוח לאומי לעצמאי — הסבר ומחשבון רשמי',
    description: 'שיעורי 2026, הסבר על בסיס החיוב וקישור למחשבון הביטוח הלאומי',
    href: '/self-employed/social-security',
    available: true,
  },
  {
    stage: 'tax',
    title: 'בדיקת מקדמות ותיקון חיובים',
    description: 'איך לבדוק תשלומי מס הכנסה וביטוח לאומי בנפרד ולבקש תיקון לפי ההכנסה',
    href: '/self-employed/tax-advances',
    available: true,
  },
  {
    stage: 'tax',
    title: 'פנסיה חובה לעצמאי — מה צריך לבדוק?',
    description: 'תנאי החובה, נתוני הכנסה והפקדות להכנה לפני בדיקה אישית',
    href: '/self-employed/mandatory-pension',
    available: true,
  },
  {
    stage: 'growth',
    title: 'כלי לתכנון יעד הכנסה לשעת חיוב',
    description: 'חלוקת יעד הכנסות בשעות חיוב צפויות, לאחר איסוף עלויות ובדיקת מס אישית',
    href: '/self-employed/hourly-rate',
    available: true,
  },
  {
    stage: 'growth',
    title: 'עלות מעסיק — רכיבים לבדיקה',
    description: 'מה צריך לכלול בתקציב העסקה לפני חישוב אישי עם חשב שכר',
    href: '/self-employed/employer-cost',
    available: true,
  },
  {
    stage: 'growth',
    title: 'חברה בע"מ vs עוסק מורשה',
    description: 'שיקולים לבחירת מבנה העסק לפי הנתונים האישיים',
    href: '/self-employed/corporation-vs-individual',
    available: true,
  },
  {
    stage: 'growth',
    title: 'דיבידנד vs משכורת',
    description: 'מה לבדוק לפני בחירה בדרך למשיכת כסף מחברה',
    href: '/self-employed/dividend-vs-salary',
    available: true,
  },
];

const stages = [
  { id: 'start', title: 'פתיחת עסק ובחירת מסלול', description: 'עוד לפני העסקה הראשונה: בוחרים מעמד, מכינים מסמכים ומתכננים את עלויות הפתיחה.' },
  { id: 'daily', title: 'חשבוניות, הוצאות וקבלת תשלום', description: 'ניהול העבודה השוטפת: איזה מסמך להפיק, איך לתעד הוצאות ומה לשלוח ללקוח שמבקש אישורים.' },
  { id: 'tax', title: 'מסים, ביטוח לאומי וסוף השנה', description: 'אוספים נתונים לבדיקת חיובים והפקדות, בלי לבלבל בין מחזור, רווח והכסף שנשאר בבנק.' },
  { id: 'growth', title: 'תמחור, תזרים וצמיחת העסק', description: 'מתקדמים מתכנון ההכנסה לניהול כספים, העסקת עובדים ובדיקת מבנה העסק.' },
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
            {'// מרכז עצמאיים ✦'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-cream mb-3">מדריכים וכלים לעצמאים ובעלי עסקים</h1>
          <p className="text-cream/70 text-lg mb-0">
            מדריכים וכלים לעצמאים: בחירת סוג העוסק, רישום העסק, חשבוניות, מסים ותכנון התזרים
          </p>
        </div>

        <nav aria-label="מדריכים לפי שלב בעסק" className="mb-10 flex flex-wrap gap-3">
          {stages.map((stage) => (
            <a key={stage.id} href={`#${stage.id}`} className="border border-ink/20 bg-paper px-4 py-3 text-sm text-ink underline-offset-4 hover:underline">
              {stage.title}
            </a>
          ))}
        </nav>

        {stages.map((stage) => (
          <section key={stage.id} id={stage.id} aria-labelledby={`${stage.id}-heading`} className="mb-12 scroll-mt-40">
            <h2 id={`${stage.id}-heading`} className="mb-2 text-2xl font-bold text-ink">{stage.title}</h2>
            <p className="mb-5 text-ink/70">{stage.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
          {calculators.filter((calc) => calc.stage === stage.id).map((calc) =>
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
                  <p className="text-sm text-ink/70">{calc.description}</p>
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
                  <h3 className="font-bold text-ink/70 mb-1">{calc.title}</h3>
                  <p className="text-sm text-ink/70">{calc.description}</p>
                  <span className="inline-block mt-2 text-xs bg-ink/10 text-ink/70 px-2 py-1 font-mono uppercase tracking-[0.1em]">
                    בקרוב
                  </span>
                </div>
              </div>
            )
          )}
            </div>
          </section>
        ))}

        {/* כלים מתקדמים לניהול העסק (B2B) */}
        <section className="mt-14">
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-2">
              ✦ כלים מתקדמים לניהול העסק
            </p>
            <h2 className="text-2xl font-bold text-ink">
              מעבר למחשבונים — <span className="font-serif italic font-normal text-gold">מערכת ניהול פיננסי מלאה</span>
            </h2>
            <p className="text-ink/70 mt-2 max-w-2xl">
              תקציב שנתי, תזרים מזומנים, ניתוח דוחות וחיזוי — הכלים שבנינו לניהול הכספים של העסק,
              בלי אקסלים מסורבלים. הנתונים נשמרים מקומית אצלך.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group bg-ink border border-ink/15 p-5 text-cream transition hover:bg-ink-deep flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6 text-gold-light" />
                    {tool.badge && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] bg-gold text-ink px-2 py-0.5">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-cream mb-1 group-hover:text-gold-light transition">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-cream/60 flex-1">{tool.description}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-mono uppercase tracking-[0.1em] text-gold-light">
                    פתח <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <Link href="/tools" className="font-mono text-xs uppercase tracking-[0.12em] text-gold hover:text-gold-2">
              לכל הכלים העסקיים ←
            </Link>
          </div>
        </section>
        <CourseCTA />
      </div>
    </div>
  );
}
