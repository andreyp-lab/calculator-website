import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintButton } from '@/components/marketing/PrintButton';
import { CourseBanner } from '@/components/marketing/CourseBanner';
import { COURSES } from '@/lib/config/courses';

// מדריך-מתנה — מסופק לאחר השארת מייל. לא לאינדוקס (delivered, not found).
export const metadata: Metadata = {
  title: 'צ׳קליסט פתיחת עסק לעצמאי 2026',
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: 'לפני שמתחילים',
    items: [
      'החלטה על סוג העסק: עוסק פטור / עוסק מורשה / חברה בע״מ',
      'בדיקת תקרת עוסק פטור (120,000 ₪ ב-2026) מול הכנסה צפויה',
      'בדיקה אם המקצוע חייב בעוסק מורשה ללא קשר למחזור',
      'הערכת הוצאות צפויות — האם כדאי לקזז מע״מ תשומות',
    ],
  },
  {
    title: 'רישום מול הרשויות',
    items: [
      'פתיחת תיק במע״מ (בחירת סיווג: פטור / מורשה)',
      'פתיחת תיק במס הכנסה + קביעת מקדמות',
      'רישום כעצמאי בביטוח לאומי',
      'בדיקת זכאות להטבות התחלתיות (עסק חדש, אזורי עדיפות)',
    ],
  },
  {
    title: 'התשתית הפיננסית',
    items: [
      'פתיחת חשבון בנק עסקי נפרד מהאישי',
      'בחירת תוכנה להפקת חשבוניות / קבלות',
      'הסדר עם רואה חשבון / יועץ מס',
      'הקמת שיטה לתיעוד הוצאות וקבלות מהיום הראשון',
    ],
  },
  {
    title: 'אחרי הפתיחה — לא לשכוח',
    items: [
      'הפרשה שוטפת לתשלומי מע״מ ומקדמות (לא להישאר בלי מזומן)',
      'פתיחת קרן פנסיה (חובה לעצמאי) + שקילת קרן השתלמות',
      'מעקב חודשי אחר המחזור מול תקרת עוסק פטור',
      'תזכורת לתיאום מקדמות באמצע השנה אם ההכנסה משתנה',
    ],
  },
];

export default function OpeningBusinessChecklistPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <Link href="/self-employed/opening-business" className="text-sm text-blue-600 hover:text-blue-800">
            ← חזרה למדריך פתיחת עסק
          </Link>
          <PrintButton />
        </div>

        <header className="mb-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            צ׳קליסט פתיחת עסק לעצמאי 2026
          </h1>
          <p className="text-gray-600">כל מה שצריך לסמן ✓ כדי לפתוח עסק נכון — מאת אנדרי פלטונוב, רו״ח</p>
        </header>

        <div className="space-y-8">
          {sections.map((sec, i) => (
            <section key={sec.title} className="border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">{i + 1}.</span> {sec.title}
              </h2>
              <ul className="space-y-3">
                {sec.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 flex-shrink-0 border-2 border-gray-300 rounded" aria-hidden />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="my-10 print:hidden">
          <CourseBanner course={COURSES.selfEmployed} page="resources/opening-business-checklist" variant="hero" />
        </div>
      </article>
    </div>
  );
}
