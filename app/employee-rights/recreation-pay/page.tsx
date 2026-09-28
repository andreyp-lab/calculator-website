import type { Metadata } from 'next';
import Link from 'next/link';
import { VerifiedRecreationPayCalculator } from '@/components/calculators/VerifiedRecreationPayCalculator';

export const metadata: Metadata = {
  title: 'דמי הבראה 2026 — אומדן בסיסי לפי ותק והיקף משרה',
  description: 'אומדן ברוטו לדמי הבראה במגזר הפרטי לפי הצו הכללי; תעריפים ענפיים וציבוריים דורשים בדיקת ההסכם החל.',
  alternates: { canonical: '/employee-rights/recreation-pay' },
};

export default function RecreationPayPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / <Link href="/employee-rights">זכויות עובדים</Link></nav>
      <h1 className="mb-5 text-3xl font-bold md:text-4xl">דמי הבראה — אומדן ברוטו</h1>
      <p className="mb-8 text-lg leading-relaxed">הזכאות לפי הצו הכללי מתגבשת לאחר שנת עבודה. מספר הימים גדל עם הוותק; היקף משרה חלקי מפחית את הסכום יחסית. הסכמים ענפיים, הסכמים קיבוציים והסדרים ציבוריים עשויים לשנות תעריף וימי זכאות. המחשבון מתייחס לתשלום שנתי בסיסי בלבד.</p>
      <VerifiedRecreationPayCalculator />
      <p className="mt-8 leading-relaxed">תעריף של 418 ₪ מופיע במסמכי הממשלה כבסיס במגזר הפרטי. בדקו את ההסכם שחל עליכם ב<a href="https://www.gov.il/he/Departments/DynamicCollectors/extension-orders" target="_blank" rel="noopener noreferrer" className="font-semibold text-gold underline">מאגר צווי ההרחבה של משרד העבודה</a> ואת התלוש. לא נקבע כאן תעריף אחיד למגזר הציבורי או לכל הענפים.</p>
      <p className="mt-4"><Link href="/blog/recreation-pay-2026" className="font-semibold text-gold underline">מדריך קצר לדמי הבראה</Link></p>
    </main>
  );
}
