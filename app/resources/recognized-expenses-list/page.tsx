import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintButton } from '@/components/marketing/PrintButton';
import { CourseBanner } from '@/components/marketing/CourseBanner';
import { COURSES } from '@/lib/config/courses';

export const metadata: Metadata = {
  title: '20 הוצאות מוכרות שעצמאים מפספסים 2026',
  robots: { index: false, follow: false },
};

const expenses = [
  'שכירות משרד / חלק יחסי ממשרד בבית (ארנונה, חשמל, אינטרנט)',
  'טלפון נייד — חלק עסקי',
  'הוצאות רכב (דלק, ביטוח, טיפולים) — בהכרה חלקית',
  'פחת על ציוד: מחשב, ריהוט, מכשור מקצועי',
  'תוכנות ומנויים מקצועיים (SaaS, אחסון, כלים)',
  'שכר טרחת רואה חשבון / יועץ מס',
  'ייעוץ משפטי הקשור לעסק',
  'השתלמויות, קורסים וכנסים מקצועיים',
  'ספרות וחומר מקצועי',
  'פרסום ושיווק דיגיטלי (קמפיינים, אתר, עיצוב)',
  'עמלות סליקה ואשראי',
  'דמי ניהול חשבון בנק עסקי',
  'ביטוח אחריות מקצועית / ביטוח עסק',
  'ציוד מתכלה וחומרי גלם',
  'דואר, משלוחים ושירותי שליחויות',
  'כיבוד במקום העסק (בתקרה)',
  'אש״ל ונסיעות עסקיות (בכפוף לכללים)',
  'דמי חבר באיגוד מקצועי / רישיונות',
  'הפקדות לקרן השתלמות (ניכוי מוכר עד תקרה)',
  'חלק מוכר מהפקדות לפנסיה של עצמאי',
];

export default function RecognizedExpensesListPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <Link href="/self-employed/recognized-expenses" className="text-sm text-blue-600 hover:text-blue-800">
            ← חזרה למדריך הוצאות מוכרות
          </Link>
          <PrintButton />
        </div>

        <header className="mb-8 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            20 הוצאות מוכרות שעצמאים מפספסים
          </h1>
          <p className="text-gray-600">
            כל שורה כאן יכולה להקטין את המס שלך — מאת אנדרי פלטונוב, רו״ח
          </p>
        </header>

        <ol className="space-y-3 mb-6">
          {expenses.map((e, i) => (
            <li key={e} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-gray-800 pt-0.5">{e}</span>
            </li>
          ))}
        </ol>

        <p className="text-xs text-gray-500 mb-8">
          * שיעורי ההכרה המדויקים נקבעים על ידי רשות המסים ותלויים בנסיבות. אין לראות במסמך זה
          ייעוץ מס. מומלץ להיוועץ ברואה חשבון.
        </p>

        <div className="my-10 print:hidden">
          <CourseBanner course={COURSES.selfEmployed} page="resources/recognized-expenses-list" variant="hero" />
        </div>
      </article>
    </div>
  );
}
