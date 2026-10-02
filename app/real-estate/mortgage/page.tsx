import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';

export const metadata: Metadata = {
  title: 'מחשבון משכנתא 2026 — שפיצר וקרן שווה',
  description: 'אומדן החזר למסלול אחד בריבית קבועה שהוזנה, בשיטת שפיצר או קרן שווה. השוו לתנאי ההצעה שקיבלתם מהבנק.',
  alternates: { canonical: '/real-estate/mortgage' },
};

export default function MortgagePage() {
  return <CalculatorLayout
    pageUrl="/real-estate/mortgage"
    title="מחשבון משכנתא 2026"
    description="אומדן החזר למסלול אחד לפי סכום, ריבית קבועה ותקופה שתזינו."
    breadcrumbs={[
      { label: 'דף הבית', href: '/' },
      { label: 'משכנתא ונדל״ן', href: '/real-estate' },
      { label: 'מחשבון משכנתא' },
    ]}
    lastUpdated="2026-09-28"
    quickAnswer={<p>המחשבון מדגים מסלול אחד בריבית קבועה לפי סכום, ריבית ותקופה שתזינו. ריבית בנק ישראל נקבעה ב־1.9.2026 על 3.25%, וממנה נגזרת ריבית פריים בסיסית של 4.75% לפני מרווח ההצעה האישית. חישוב זה אינו מנבא את ההחזר במסלול פריים או במסלול צמוד מדד; השוו לנתוני האישור העקרוני של הבנק.</p>}
    calculator={<MortgageCalculator />}
    content={<>
      <h2>איך בודקים הצעת משכנתא?</h2>
      <p>בדקו כל מסלול בנפרד: סכום, תקופה, ריבית, הצמדה למדד, מועד שינוי הריבית והעמלות. המחשבון מדגים לוח שפיצר או קרן שווה בריבית קבועה בלבד. ההחזר במסלול צמוד מדד או בריבית משתנה עשוי להשתנות, ואין להסיק מהאומדן על סך התשלומים בהם.</p>
      <p>בפירעון מוקדם בקשו מהבנק פירוט עמלות עדכני לפי כל מסלול. גם כשהמסלול אינו חייב בעמלת הפרשי היוון, יכולות לחול עמלות אחרות כגון עמלה תפעולית או עמלה על אי מתן הודעה מוקדמת. קראו את <a href="https://www.boi.org.il/information/interestrates/mortgage/" target="_blank" rel="noopener noreferrer">הסבר בנק ישראל על ריביות ועמלת פירעון מוקדם</a>.</p>
      <h2>מגבלות והנחות</h2>
      <p>מגבלות שיעור המימון, יחס ההחזר וחלוקת המסלולים נקבעות בהוראת בנק ישראל וחלות לפי מאפייני הבקשה. קבלת מימון כפופה לבדיקה ולאישור הבנק. אל תסתמכו על שיעור תשואה צפוי מהשקעות כדי להכריע אם לקחת משכנתא גדולה יותר; תשואה עתידית אינה מובטחת ועלות החוב תלויה בתנאי ההסכם.</p>
      <p>לעיון בהסבר הרשמי על מסלולים, ריבית פריים ואישורים עקרוניים: <a href="https://www.boi.org.il/information/bank-paymnts/financial-education/%D7%94%D7%A8%D7%A4%D7%95%D7%A8%D7%9E%D7%94-%D7%9C%D7%94%D7%92%D7%91%D7%A8%D7%AA-%D7%A9%D7%A7%D7%99%D7%A4%D7%95%D7%AA-%D7%94%D7%9E%D7%99%D7%93%D7%A2-%D7%95%D7%94%D7%AA%D7%97%D7%A8%D7%95%D7%AA-%D7%91%D7%9E%D7%A9%D7%9B%D7%A0%D7%AA%D7%90%D7%95%D7%AA/" target="_blank" rel="noopener noreferrer">מדריך בנק ישראל למשכנתאות</a>. להשוואת חלופות אפשר להיעזר גם ב<Link href="/real-estate/mortgage-optimizer">מדריך השוואת התמהילים</Link>.</p>
    </>}
  />;
}
