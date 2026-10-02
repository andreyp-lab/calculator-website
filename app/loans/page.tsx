import type { Metadata } from 'next';
import Link from 'next/link';
import { MACRO_DATA, formatHebrewDate } from '@/lib/data/macroeconomic-data';

export const metadata: Metadata = {
  title: 'הלוואות ומשכנתאות — השוואת החזר, ריבית והצעות',
  description: 'כלים ומדריכים לבדיקת החזר הלוואה, תמהיל משכנתא, מיחזור וכושר החזר לפי הנתונים שהוזנו וההצעות שקיבלתם.',
  alternates: { canonical: '/loans' },
};

const tools = [
  { href: '/real-estate/mortgage', title: 'אומדן החזר משכנתא', description: 'חישוב לפי סכום, תקופה וריבית שתזינו. השוו את התוצאה לאישור העקרוני.' },
  { href: '/real-estate/mortgage-optimizer', title: 'מדריך להשוואת תמהילי משכנתא', description: 'רשימת הנתונים שצריך לבדוק בכל מסלול ובכל הצעה של בנק.' },
  { href: '/savings/personal-loan', title: 'הלוואה אישית', description: 'בדיקת החזרים והצעות מימון לפי תנאי ההלוואה.' },
  { href: '/savings/loan-repayment', title: 'אומדן החזר הלוואה', description: 'חישוב הלוואה אחת בריבית קבועה ולא צמודה, לפי הסכום, הריבית והתקופה שתזינו.' },
  { href: '/tools/loan-eligibility', title: 'הלוואה בערבות המדינה', description: 'מדריך למסלולים, לתנאים ולמסמכים, עם הפניה לאתר הרשמי של הקרן.' },
];

export default function LoansPage() {
  return <main dir="rtl" className="mx-auto max-w-5xl px-5 py-12 text-ink">
    <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/60"><Link href="/">דף הבית</Link> / הלוואות</nav>
    <h1 className="mb-5 text-3xl font-bold md:text-4xl">הלוואות ומשכנתאות</h1>
    <p className="mb-6 text-lg leading-relaxed">לפני לקיחת הלוואה, השוו הצעות כתובות באותו סכום ולאותה תקופה. בדקו את ההחזר, סך התשלומים, עמלות ותנאים לשינוי ריבית או לפירעון מוקדם. החזר חודשי נמוך יותר בעקבות הארכת תקופה אינו מוכיח שסך העלות נמוך יותר.</p>
    <div className="mb-10 border-r-4 border-gold bg-cream-2 p-5 leading-relaxed">
      ריבית בנק ישראל עומדת על {MACRO_DATA.primeRate.boiBaseRate}% לפי העדכון מ־{formatHebrewDate(MACRO_DATA.primeRate.lastUpdated)}; ריבית הפריים הבסיסית היא {MACRO_DATA.primeRate.value}%. תנאי הלוואה צמודת פריים כוללים מרווח אישי ועשויים להשתנות. <a className="text-gold underline" href="https://www.boi.org.il/roles/monetary-policy/" target="_blank" rel="noopener noreferrer">בדקו עדכוני ריבית בבנק ישראל ↗</a>
    </div>
    <h2 className="mb-5 text-2xl font-bold">כלים ומדריכים</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {tools.map((item) => <Link key={item.href} href={item.href} className="block border border-ink/20 p-5 transition hover:border-gold hover:bg-cream-2"><h3 className="mb-2 text-lg font-bold">{item.title}</h3><p className="text-ink/70">{item.description}</p></Link>)}
    </div>
    <section className="mt-12 space-y-4 leading-relaxed">
      <h2 className="text-2xl font-bold">מה עוד בודקים בהצעה?</h2>
      <p>בהלוואה בריבית משתנה, בדקו את מועד העדכון ואת המרווח מעל העוגן. בהלוואה צמודת מדד, בדקו את ההשפעה האפשרית של הצמדת הקרן. שאלו מהן העמלות במקרה של פירעון מוקדם ואילו ביטוחים או בטוחות נדרשים.</p>
      <p>במשכנתא, הבנק בוחן גם את סוג העסקה, שיעור המימון, יחס ההחזר והמסמכים. מחשבון יכול להמחיש תרחיש שהזנתם; הוא אינו מחליף אישור עקרוני או את תנאי ההלוואה בכתב.</p>
      <p><a href="https://www.boi.org.il/information/bank-paymnts/financial-education/%D7%94%D7%A8%D7%A4%D7%95%D7%A8%D7%9E%D7%94-%D7%9C%D7%94%D7%92%D7%91%D7%A8%D7%AA-%D7%A9%D7%A7%D7%99%D7%A4%D7%95%D7%AA-%D7%94%D7%9E%D7%99%D7%93%D7%A2-%D7%95%D7%94%D7%AA%D7%97%D7%A8%D7%95%D7%AA-%D7%91%D7%9E%D7%A9%D7%9B%D7%A0%D7%AA%D7%90%D7%95%D7%AA/" target="_blank" rel="noopener noreferrer">מידע בנק ישראל על השוואת הצעות משכנתא ↗</a></p>
    </section>
  </main>;
}
