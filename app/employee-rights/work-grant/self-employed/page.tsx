import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PAGE_PATH = '/employee-rights/work-grant/self-employed';
const OFFICIAL_SIMULATOR = 'https://www.gov.il/he/service/check-eligibility-for-job-grant';
const OFFICIAL_APPLICATION = 'https://www.gov.il/he/service/submitting-an-online-claim-for-job-grant';
const OFFICIAL_GUIDE =
  'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf';

export const metadata: Metadata = withPageSocialMetadata({
  title: 'מענק עבודה לעצמאים: הכנסה, דוח והגשת בקשה',
  description:
    'מענק עבודה לעצמאי: איזו הכנסה נבדקת, למה מחזור אינו רווח, כיצד נספרים חודשי פעילות ומה צריך להסדיר לפני הגשה לרשות המסים.',
  alternates: { canonical: PAGE_PATH },
});

const faqs = [
  {
    question: 'האם עצמאי יכול לקבל מענק עבודה?',
    answer:
      'כן. השירות הרשמי מיועד לשכירים ולעצמאים שעומדים בתנאים. אצל עצמאי נבחנת הכנסה מעסק או ממשלח יד בשנת הזכאות, לצד התנאים האישיים והמשפחתיים.',
  },
  {
    question: 'האם בודקים את מחזור העסק?',
    answer:
      'לא כסכום ההכנסה המזכה. המדריך מגדיר הכנסה מעסק או ממשלח יד כרווח או השתכרות לאחר ניכויים שהותרו בדין, בכפוף להתאמות המנויות בו. מחזור הוא נתון אחר ואינו הרווח.',
  },
  {
    question: 'מה אם הייתי גם שכיר וגם עצמאי?',
    answer:
      'בחישוב ההכנסה החודשית הממוצעת מובאות בחשבון הכנסות העבודה וההכנסות מעסק או ממשלח יד, ומחלקים במספר חודשי העבודה והפעילות בפועל, עד 12 חודשים.',
  },
  {
    question: 'האם צריך להגיש דוח שנתי לפני קבלת המענק?',
    answer:
      'מדריך רשות המסים מציין שהגשת דוח למס הכנסה נדרשת ממי שחייב בדוח, וכן אם בן או בת הזוג חייבים בדוח. יש להסדיר את הדיווח לפי החובה האישית ולא להסתמך על הבקשה למענק כדוח מס.',
  },
];

export default function WorkGrantSelfEmployedPage() {
  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'זכויות עובדים', url: '/employee-rights' },
          { name: 'מענק עבודה', url: '/employee-rights/work-grant' },
          { name: 'מענק לעצמאים', url: PAGE_PATH },
        ]}
      />
      <article className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'זכויות עובדים', href: '/employee-rights' },
              { label: 'מענק עבודה', href: '/employee-rights/work-grant' },
              { label: 'מענק לעצמאים' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">{'// '}עצמאים ✦</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">מענק עבודה לעצמאים</h1>
          <p className="text-lg leading-relaxed text-ink/75">
            גם עצמאי עשוי להיות זכאי למענק עבודה. הבדיקה מבוססת על ההכנסה מעסק או ממשלח יד
            — לא על המחזור לבדו — ועל נתוני שנת המס, מספר חודשי הפעילות והמצב המשפחתי.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-gold">
            עודכן לאחרונה: <time dateTime="2026-10-24">24.10.2026</time>
          </p>
        </header>

        <section className="answer-box mb-10 border-r-4 border-gold bg-cream-2 p-5" aria-label="תשובה מהירה">
          <p className="leading-relaxed text-ink/85">
            <strong>עצמאי יכול להגיש בקשה למענק עבודה</strong> אם הייתה לו בשנת הזכאות הכנסה
            מעסק או ממשלח יד והוא עומד ביתר התנאים. לצורך הסכום נבחן הרווח כהגדרתו במדריך,
            לאחר ניכויים מותרים ובכפוף להתאמות — לא סך החשבוניות או מחזור העסק. מי שחייב בדוח
            שנתי צריך להגיש אותו, ולאחר מכן לבצע בדיקה ב{' '}
            <a href={OFFICIAL_SIMULATOR} className="font-bold underline" target="_blank" rel="noreferrer">
              סימולטור הרשמי של רשות המסים
            </a>.
          </p>
        </section>

        <div className="prose prose-lg max-w-none text-ink leading-relaxed">
          <h2>איזו הכנסה של עצמאי נבחנת?</h2>
          <p>
            מדריך מענק העבודה לשנת 2025 מגדיר עצמאי כתושב ישראל יחיד שמלאו לו 21 שנים והייתה
            לו בשנת המס הכנסה מעסק או ממשלח יד. ההכנסה אינה זהה למחזור. ההגדרה מתייחסת לרווח
            או להשתכרות מעסק או ממשלח יד, מעסקה או מעסק אקראי בעלי אופי מסחרי, לאחר הניכויים
            שהותרו לפי דין, למעט ניכויים מסוימים המפורטים בחוק, ולפני קיזוזים ופטורים.
          </p>
          <p>
            מכאן נובעת טעות נפוצה: בעל עסק שמחזורו גבוה אינו בהכרח בעל הכנסה גבוהה באותו
            סכום, ולהפך. הוצאות עסקיות מותרות עשויות להשפיע על הרווח, אך אין “להתאים” הוצאות
            לצורך המענק. הנתונים צריכים להיות אלה שדווחו כדין למס הכנסה. בקשת מענק אינה
            מתקנת דוח ואינה מחליפה הנהלת חשבונות.
          </p>

          <h2>איך נספרים חודשי הפעילות?</h2>
          <p>
            כדי להגיע להכנסה חודשית ממוצעת, רשות המסים מחלקת את סך הכנסות העבודה וההכנסות
            מעסק או ממשלח יד במספר חודשי העבודה והפעילות העסקית בפועל, עד 12 חודשים בשנת
            המס. עצמאי שפעל רק בחלק מהשנה לא צריך להניח אוטומטית שההכנסה תחולק ב־12; ההגדרה
            הרשמית מתייחסת לחודשי הפעילות בפועל.
          </p>
          <p>
            כאשר אדם היה גם שכיר וגם עצמאי, שתי קבוצות ההכנסה עשויות להיכלל בחישוב. אין
            לבצע שתי בדיקות מנותקות ולהתייחס רק למסלול הנוח יותר. הסבר על שאר משתני הנוסחה
            מופיע בדף <Link href="/employee-rights/work-grant/amount">חישוב סכום מענק עבודה</Link>.
          </p>

          <h2>הדוח השנתי הוא חלק מהתמונה</h2>
          <p>
            מדריך רשות המסים קובע כי נדרשת הגשת דוח למס הכנסה בידי מי שחייבים בדוח, או כאשר
            בן או בת הזוג חייבים בדוח, לפי הוראות פקודת מס הכנסה. עצמאי אינו צריך להניח
            שהמערכת תחשב סכום סופי לפני שכל הדיווחים הרלוונטיים לשנת הזכאות נקלטו. פער בין
            הבקשה לבין הדוח יכול להביא לבירור או לעדכון הקביעה.
          </p>
          <p>
            לפני הגשת הבקשה בדקו שהדוח מתייחס לשנה הנכונה ושנתוני העסק תואמים למסמכים.
            בקשה לשנת 2025 נשענת על נתוני 2025, גם אם היא מוגשת בשנה מאוחרת יותר. אם אתם
            בודקים אפשרות להגיש על תקופה קודמת, עיינו גם בדף{' '}
            <Link href="/employee-rights/work-grant/retroactive">מענק עבודה לשנים קודמות</Link> ובמועדים העדכניים באתר הרשות.
          </p>

          <h2>מה לגבי ניכויים, הפסדים ותשלומי ביטוח לאומי?</h2>
          <p>
            ההגדרה הרשמית דורשת זהירות. המדריך מציין שההכנסה מחושבת לאחר ניכויים מותרים,
            אך למעט ניכויים מסוימים הקבועים בחוק, לדוגמה תשלומים לקרן השתלמות לעצמאים
            ותשלומים לביטוח לאומי; והוא מציין גם שהחישוב נעשה לפני קיזוזי הפסדים ופטורים.
            אלה הבחנות מקצועיות, ולכן אין לקחת את השורה “רווח נקי” מתוכנת הנהלת החשבונות
            ולהניח שהיא בהכרח המספר שנבחן למענק.
          </p>
          <p>
            במקרה של פעילות מורכבת, הפסדים, כמה עסקים או שינוי צורת התאגדות, כדאי לבדוק את
            הנתון עם איש מקצוע שמכיר את הדוח. דף זה מסביר את עקרון החישוב בלבד ואינו קובע
            כיצד לסווג הוצאה או הכנסה בדוח מס.
          </p>

          <h2>עצמאי עם בן או בת זוג</h2>
          <p>
            הבקשה למענק אישית, אך ההכנסות במשק הבית אינן מנותקות. מדריך רשות המסים מציין
            שהכנסה מעבודה, מעסק או ממשלח יד והכנסה נוספת של בן או בת הזוג עשויות להפחית את
            גובה המענק. אם שני בני הזוג עובדים, כל אחד צריך לבדוק את מצבו ולהגיש בקשה אישית
            לפי הצורך. ראו <Link href="/employee-rights/work-grant/couples">מענק עבודה לשני בני זוג עובדים</Link>.
          </p>
          <p>
            גם תנאים כלליים, ובהם גיל, ילדים וזכויות במקרקעין, ממשיכים לחול. היותכם עצמאים
            אינו יוצר זכאות אוטומטית ואינו מבטל תנאי אחר. את התמונה הבסיסית אפשר לבדוק בדף{' '}
            <Link href="/employee-rights/work-grant/eligibility">זכאות למענק עבודה</Link> ובסימולטור הרשמי.
          </p>

          <h2>תהליך מומלץ להגשה מסודרת</h2>
          <ol>
            <li>מזהים את שנת הזכאות ומוודאים שהיא פתוחה להגשה.</li>
            <li>מוודאים שהדוח השנתי וכל דיווח נדרש לשנה הוגשו.</li>
            <li>מרכזים את הכנסות העסק, הכנסות כשכיר וחודשי הפעילות בפועל.</li>
            <li>בודקים בסימולטור הרשמי עם נתוני התא המשפחתי והכנסות נוספות.</li>
            <li>מגישים דרך <Link href="/employee-rights/work-grant/application">מדריך הגשת הבקשה</Link> ושומרים מספר תביעה.</li>
            <li>עוקבים אחרי הבקשה בדף <Link href="/employee-rights/work-grant/status">בדיקת סטטוס מענק עבודה</Link>.</li>
          </ol>

          <h2>מקורות רשמיים</h2>
          <ul>
            <li><a href={OFFICIAL_GUIDE} target="_blank" rel="noreferrer">מדריך מענק עבודה לשנת 2025 — רשות המסים</a></li>
            <li><a href={OFFICIAL_SIMULATOR} target="_blank" rel="noreferrer">בדיקת זכאות וסכום — רשות המסים</a></li>
            <li><a href={OFFICIAL_APPLICATION} target="_blank" rel="noreferrer">הגשת בקשה — רשות המסים</a></li>
          </ul>

          <h2>שאלות נפוצות לעצמאים</h2>
          {faqs.map((faq) => (
            <section key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>

        <aside className="my-10 border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-ink/80">
          המידע כללי ואינו ייעוץ מס, חוות דעת על סיווג הכנסה או תחליף לדוח שנתי תקין. רשות
          המסים והוראות הדין קובעות את ההכנסה, הזכאות והסכום במקרה האישי.
        </aside>
        <AuthorBox />
      </article>
    </main>
  );
}
