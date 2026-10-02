import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { DisclaimerBox } from '@/components/calculator/DisclaimerBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { VAT_2026 } from '@/lib/constants/tax-2026';

const PAGE_PATH = '/compare/esek-zeir-vs-osek-patur';
const SITE_URL = 'https://cheshbonai.co.il';
const LAST_UPDATED_ISO = '2026-10-02';
const LAST_UPDATED_TEXT = '2 באוקטובר 2026';
const TURNOVER_LIMIT = VAT_2026.smallBusinessThreshold;
const TURNOVER_LIMIT_FORMATTED = TURNOVER_LIMIT.toLocaleString('he-IL');
const NORMATIVE_EXPENSE_RATE = 0.3;

const EXAMPLE_TURNOVER = 100_000;
const EXAMPLE_EXPENSE = EXAMPLE_TURNOVER * NORMATIVE_EXPENSE_RATE;
const EXAMPLE_TAXABLE_INCOME = EXAMPLE_TURNOVER - EXAMPLE_EXPENSE;

const SOURCES = {
  abridgedReport: 'https://www.gov.il/he/service/report-and-payment-for-micro-business-owner',
  taxCoordination: 'https://www.gov.il/he/service/tax-coordination-online',
  exemptRegistration: 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet',
  exemptDeclaration: 'https://www.gov.il/he/service/vat-declarationisexempt',
  microAdvance: 'https://www.gov.il/he/service/request-down-payment-for-micro-business-owner',
  reform:
    'https://www.gov.il/BlobFolder/policy/income-tax-small-business-owner-24-210725/he/IncomeTax_procedures-210725-1.pdf',
  instructions:
    'https://www.gov.il/BlobFolder/policy/inst-07-2025/he/IncomeTax_inst-07-2025.pdf',
  rightsGuide:
    'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
} as const;

export const metadata: Metadata = {
  title: 'בעל עסק זעיר מול עוסק פטור — מה ההבדל?',
  description:
    'בעל עסק זעיר הוא מסלול במס הכנסה; עוסק פטור הוא סיווג במע״מ. מדריך מעשי לתנאים, 30% הוצאות, תיאום מס, דיווח וארבעת השילובים האפשריים.',
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: 'בעל עסק זעיר מול עוסק פטור — מה ההבדל?',
    description:
      'ההבחנה בין מסלול מס הכנסה לסיווג במע״מ, כולל תנאים, דיווחים וארבעת השילובים האפשריים.',
    type: 'article',
    locale: 'he_IL',
    siteName: 'חשבונאי',
    url: PAGE_PATH,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'בעל עסק זעיר מול עוסק פטור — מה ההבדל?',
    description: 'מס הכנסה מול מע״מ: מי יכול לשלב בין המעמדות ואילו דיווחים נדרשים.',
    images: ['/opengraph-image'],
  },
};

const faqItems = [
  {
    question: 'האם בעל עסק זעיר ועוסק פטור הם אותו דבר?',
    answer:
      'לא. בעל עסק זעיר הוא מעמד במס הכנסה, הכולל בכפוף לתנאים ניכוי הוצאות נורמטיבי בשיעור 30% ואפשרות לדיווח שנתי מקוצר. עוסק פטור הוא סיווג במע״מ: הוא אינו גובה מע״מ ואינו מנכה מס תשומות. אפשר להיות עוסק פטור ובעל עסק זעיר במקביל, אבל אין זה אותו מעמד.',
  },
  {
    question: 'האם עוסק מורשה יכול להיות בעל עסק זעיר?',
    answer:
      'כן. לפי חומרי רשות המסים, גם עוסק מורשה יכול לבקש סיווג כבעל עסק זעיר במס הכנסה, אם הוא יחיד, מחזורו עומד בתקרה והוא עומד ביתר התנאים. הוא ממשיך לגבות ולדווח מע״מ כעוסק מורשה; המסלול הזעיר אינו משנה את סיווג המע״מ.',
  },
  {
    question: 'האם כל בעל עסק זעיר מקבל אוטומטית 30% הוצאות?',
    answer:
      'לא. הניכוי בשיעור 30% כפוף לעמידה בתנאי המסלול. בין היתר, החוק מגביל את הניכוי במקרים של העסקת עובדים, ספרים בלתי קבילים, הכנסה שאינה מיגיעה אישית, הכנסה מהמעסיק, תלות מסוימת בקרוב או במעסיק לשעבר, הכנסה מתאגיד שקוף ובעלות שליטה בחברה.',
  },
  {
    question: 'האם הניכוי של 30% כולל גם מע״מ?',
    answer:
      'לא. זהו מנגנון לקביעת ההכנסה החייבת במס הכנסה. הוא אינו מאפשר לעוסק פטור לנכות מס תשומות ואינו פוטר עוסק מורשה מחובות הדיווח והמסמכים במע״מ. את ההתנהלות במע״מ בודקים לפי הסיווג הנפרד של העסק.',
  },
  {
    question: 'איזה דיווח מגיש בעל עסק זעיר?',
    answer:
      'מי שהוכר כבעל עסק זעיר וביצע תיאום מס יכול, אם הוא עומד בתנאי מסלול הדיווח המקוצר ואינו חייב בדוח מלא מסיבה אחרת, לדווח באופן מקוון על המחזור לאחר תום השנה. המועד הרגיל שמציינת רשות המסים הוא 31 במרץ של השנה העוקבת; יש לבדוק הארכות והוראות לשנת הדיווח.',
  },
  {
    question: 'האם עוסק פטור עדיין מגיש הצהרה למע״מ אם הוא בעל עסק זעיר?',
    answer:
      'כן. ההצהרה על מחזור עוסק פטור היא חובת מע״מ נפרדת. תיאום המס והדיווח המקוצר של בעל עסק זעיר הם פעולות במס הכנסה ואינם מחליפים את ההצהרה למע״מ או את הפקת המסמכים הנדרשים בעסק.',
  },
  {
    question: 'למי מסלול בעל עסק זעיר עשוי שלא להתאים?',
    answer:
      'המסלול דורש בדיקה מיוחדת אם ההוצאות העסקיות בפועל גבוהות מ־30% מהמחזור, אם קיימת חובת דוח שנתי מסיבה אחרת, אם מעסיקים עובדים או אם מתקיימת אחת ממגבלות הזכאות. במקרים כאלה אין להסתפק בהשוואה חשבונית; צריך לבדוק את נתוני העסק והשלכות המעבר למסלול הרגיל.',
  },
] as const;

const combinations = [
  {
    vat: 'עוסק פטור',
    incomeTax: 'בעל עסק זעיר',
    possible: 'כן, בכפוף לתנאים',
    meaning:
      'במע״מ לא גובים מע״מ ולא מנכים מס תשומות; במס הכנסה ניתן להשתמש בניכוי הנורמטיבי ובמסלול הדיווח המקוצר, אם עומדים בתנאיו.',
  },
  {
    vat: 'עוסק פטור',
    incomeTax: 'מסלול רגיל',
    possible: 'כן',
    meaning:
      'במע״מ נשארים עוסק פטור, ובמס הכנסה דורשים הוצאות בפועל ומדווחים לפי החובות הרגילות החלות על התיק. מצב כזה יכול לנבוע מבחירה או מאי־עמידה בתנאי המסלול הזעיר.',
  },
  {
    vat: 'עוסק מורשה',
    incomeTax: 'בעל עסק זעיר',
    possible: 'כן, בכפוף לתנאים',
    meaning:
      'ממשיכים לגבות ולדווח מע״מ ולהפיק מסמכים כעוסק מורשה, אך במס הכנסה משתמשים במסלול הזעיר. המחזור חייב לעמוד בתקרה וביתר תנאי הזכאות.',
  },
  {
    vat: 'עוסק מורשה',
    incomeTax: 'מסלול רגיל',
    possible: 'כן',
    meaning:
      'ההתנהלות הרגילה: דיווחי מע״מ כעוסק מורשה, ובמס הכנסה חישוב לפי הכנסות והוצאות בפועל ובהתאם לחובות הדיווח של התיק.',
  },
] as const;

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-2"
    >
      {children} ↗
    </a>
  );
}

export default function EsekZeirVsOsekPaturPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'בעל עסק זעיר מול עוסק פטור — מה ההבדל?',
    description:
      'מדריך המבדיל בין מסלול בעל עסק זעיר במס הכנסה לבין סיווג עוסק פטור במע״מ.',
    inLanguage: 'he-IL',
    datePublished: LAST_UPDATED_ISO,
    dateModified: LAST_UPDATED_ISO,
    author: {
      '@type': 'Person',
      name: 'אנדרי פלטונוב',
      jobTitle: 'רואה חשבון',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'חשבונאי',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand-logo.svg`, width: 512, height: 512 },
    },
    image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'השוואות', item: `${SITE_URL}/compare` },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'בעל עסק זעיר מול עוסק פטור',
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-7">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'השוואות', href: '/compare' },
              { label: 'בעל עסק זעיר מול עוסק פטור' },
            ]}
          />
        </div>

        <header className="mb-8 border-b border-ink/15 pb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            מס הכנסה מול מע״מ · מדריך 2026
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-ink md:text-5xl">
            בעל עסק זעיר מול עוסק פטור — מה ההבדל?
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-ink/75">
            שני השמות מתארים מערכות מס שונות. אפשר לשלב ביניהם, ואפשר להיות רק באחד מהם.
            המדריך מפריד בין התנאים, הדיווחים והמסמכים כדי שלא לבחור מסלול לפי שם דומה.
          </p>
          <p className="mt-4 text-sm text-ink/60">
            מאת אנדרי פלטונוב, רו״ח · עודכן {LAST_UPDATED_TEXT}
          </p>
        </header>

        <section
          aria-labelledby="answer-heading"
          className="answer-box mb-10 border-r-4 border-gold bg-paper p-6"
        >
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">
            התשובה הקצרה
          </p>
          <h2 id="answer-heading" className="mb-3 text-2xl font-bold text-ink">
            עוסק פטור הוא סיווג במע״מ; בעל עסק זעיר הוא מסלול במס הכנסה
          </h2>
          <p className="leading-relaxed text-ink/80">
            <strong>עוסק פטור</strong> אינו גובה מע״מ מלקוחותיו ואינו מנכה מס תשומות.
            <strong> בעל עסק זעיר</strong> הוא יחיד שנרשם במסלול מס הכנסה, ובכפוף לתנאים
            הכנסתו החייבת מהעסק מחושבת לאחר ניכוי הוצאות נורמטיבי של 30% מהמחזור. לכן
            עוסק פטור או עוסק מורשה יכולים להיות בעלי עסק זעיר, כל עוד המחזור אינו עולה על
            התקרה והם עומדים במגבלות המסלול. בשנת 2026 התקרה היא{' '}
            <strong>{TURNOVER_LIMIT_FORMATTED} ₪</strong>. הבחירה במסלול הזעיר אינה משנה את
            חובות המע״מ, ואינה פטור מתשלום מס הכנסה.
          </p>
        </section>

        <nav aria-label="תוכן העניינים" className="mb-10 border border-ink/15 bg-paper p-5">
          <h2 className="mb-3 text-lg font-bold text-ink">במדריך הזה</h2>
          <ol className="grid list-decimal gap-x-8 gap-y-3 pr-5 text-sm text-ink/75 sm:grid-cols-2">
            <li><a className="underline underline-offset-4" href="#two-systems">שתי מערכות מס שונות</a></li>
            <li><a className="underline underline-offset-4" href="#four-combinations">ארבעת השילובים האפשריים</a></li>
            <li><a className="underline underline-offset-4" href="#eligibility">תנאי המסלול הזעיר</a></li>
            <li><a className="underline underline-offset-4" href="#expense-deduction">מה פירוש ניכוי 30%</a></li>
            <li><a className="underline underline-offset-4" href="#reporting">תיאום מס ודיווח</a></li>
            <li><a className="underline underline-offset-4" href="#vat-documents">מע״מ ומסמכים</a></li>
            <li><a className="underline underline-offset-4" href="#not-suitable">מתי המסלול דורש בדיקה נוספת</a></li>
            <li><a className="underline underline-offset-4" href="#faq">שאלות נפוצות</a></li>
          </ol>
        </nav>

        <div className="space-y-12 text-ink">
          <section id="two-systems" className="scroll-mt-40" aria-labelledby="two-systems-heading">
            <h2 id="two-systems-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              קודם מפרידים: מע״מ לחוד ומס הכנסה לחוד
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-ink/15 bg-paper p-5">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-gold">מע״מ</p>
                <h3 className="mb-2 text-xl font-bold">עוסק פטור</h3>
                <p className="leading-relaxed text-ink/75">
                  זהו סיווג לפי חוק מע״מ. הזכאות תלויה במחזור הצפוי ובסוג העיסוק. עיסוקים
                  מסוימים חייבים להירשם כעוסק מורשה גם במחזור נמוך. הפטור מתייחס לגביית
                  מע״מ — לא למס הכנסה ולא לביטוח לאומי.
                </p>
              </div>
              <div className="border border-ink/15 bg-paper p-5">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-gold">מס הכנסה</p>
                <h3 className="mb-2 text-xl font-bold">בעל עסק זעיר</h3>
                <p className="leading-relaxed text-ink/75">
                  זהו מסלול ליחיד בעל הכנסה מעסק או ממשלח יד. המסלול קובע דרך מיוחדת לחישוב
                  ההוצאות ולדיווח למס הכנסה. הוא אינו משנה אם העסק פטור או מורשה במע״מ.
                </p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-ink/75">
              רשות המסים מציינת במפורש שעוסק פטור וגם עוסק מורשה יכולים להיכלל במסלול בעל
              עסק זעיר כשהם עומדים בתקרת המחזור וביתר התנאים.{' '}
              <SourceLink href={SOURCES.reform}>הסבר רשות המסים על הרפורמה</SourceLink>
            </p>
          </section>

          <section id="four-combinations" className="scroll-mt-40" aria-labelledby="combinations-heading">
            <h2 id="combinations-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              ארבעת השילובים האפשריים
            </h2>
            <p className="mb-5 leading-relaxed text-ink/75">
              במקום לחשוב על שני מסלולים מתחרים, הציבו אותם על שני צירים: סיווג במע״מ
              ושיטת הדיווח במס הכנסה.
            </p>
            <div className="overflow-x-auto border border-ink/15 bg-paper">
              <table className="w-full min-w-[780px] border-collapse text-right text-sm">
                <caption className="sr-only">שילובים בין סיווג מע״מ למסלול מס הכנסה</caption>
                <thead className="bg-ink text-cream">
                  <tr>
                    <th scope="col" className="p-4">סיווג במע״מ</th>
                    <th scope="col" className="p-4">מסלול במס הכנסה</th>
                    <th scope="col" className="p-4">אפשרי?</th>
                    <th scope="col" className="p-4">מה זה אומר בפועל?</th>
                  </tr>
                </thead>
                <tbody className="text-ink/80">
                  {combinations.map((row) => (
                    <tr key={`${row.vat}-${row.incomeTax}`} className="border-t border-ink/15 even:bg-cream-2/60">
                      <th scope="row" className="p-4 align-top font-bold text-ink">{row.vat}</th>
                      <td className="p-4 align-top font-semibold">{row.incomeTax}</td>
                      <td className="p-4 align-top">{row.possible}</td>
                      <td className="p-4 align-top leading-relaxed">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="eligibility" className="scroll-mt-40" aria-labelledby="eligibility-heading">
            <h2 id="eligibility-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              מי יכול להשתמש במסלול בעל עסק זעיר?
            </h2>
            <p className="mb-4 leading-relaxed text-ink/75">
              נקודת הפתיחה היא יחיד תושב ישראל שמפיק הכנסה מעסק או ממשלח יד, ושמחזור כל
              פעילותו העסקית אינו עולה על התקרה. בשנת 2026 התקרה המשותפת למסלול ולסכום
              הקובע של עוסק פטור היא {TURNOVER_LIMIT_FORMATTED} ₪. אבל עמידה בתקרה לבדה אינה
              מספיקה לקבלת הניכוי הנורמטיבי.
            </p>
            <div className="border-r-4 border-gold bg-cream-2 p-6">
              <h3 className="mb-3 text-xl font-bold">מקרים שמונעים את ניכוי ה־30%</h3>
              <ul className="list-disc space-y-2 pr-5 leading-relaxed text-ink/75">
                <li>העסק מעסיק עובדים.</li>
                <li>הפנקסים אינם קבילים.</li>
                <li>קיימת הכנסה מהעסק או ממשלח היד שלא הופקה מיגיעה אישית.</li>
                <li>חלק מההכנסה העסקית התקבל ממעסיקו של בעל העסק בשנת המס.</li>
                <li>חלק מההכנסה יוחס לבעל העסק מתאגיד שקוף כהגדרתו בפקודה.</li>
                <li>יותר מ־25% מההכנסה העסקית התקבלו מקרוב או ממי שהיה מעסיק בשלוש שנות המס הקודמות.</li>
                <li>בעל העסק הוא בעל שליטה בחברה.</li>
              </ul>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/65">
              הרשימה מנוסחת לפי הוראות רשות המסים והפקודה, אך היישום תלוי בעובדות. למשל,
              הגדרת „קרוב”, „תאגיד שקוף” ו„בעל שליטה” היא משפטית. אם אחד המצבים קרוב לנתוני
              העסק, בדקו אותו מול מייצג או פקיד השומה לפני הסתמכות על הניכוי.{' '}
              <SourceLink href={SOURCES.instructions}>הוראת הביצוע בנושא עסק זעיר</SourceLink>
            </p>
          </section>

          <section id="expense-deduction" className="scroll-mt-40" aria-labelledby="expense-heading">
            <h2 id="expense-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              ניכוי הוצאות של 30%: מה הוא כן — ומה הוא לא
            </h2>
            <p className="leading-relaxed text-ink/75">
              במסלול הזעיר, ובכפוף לתנאים, רשות המסים מפחיתה 30% ממחזור העסק כהוצאות בלי
              לדרוש פירוט של כל הוצאה לצורך החישוב הזה. אין פירוש הדבר שמקבלים החזר של 30%,
              שהמס הוא 30%, או שהרווח בבנק בהכרח שווה להכנסה החייבת.
            </p>
            <div className="my-6 border border-ink/15 bg-paper p-6">
              <h3 className="mb-4 text-xl font-bold">דוגמה חשבונית בלבד</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <dt className="text-ink/65">מחזור שנתי בדוגמה</dt>
                <dd className="font-bold">{EXAMPLE_TURNOVER.toLocaleString('he-IL')} ₪</dd>
                <dt className="text-ink/65">ניכוי נורמטיבי ({NORMATIVE_EXPENSE_RATE * 100}%)</dt>
                <dd className="font-bold">{EXAMPLE_EXPENSE.toLocaleString('he-IL')} ₪</dd>
                <dt className="text-ink/65">הכנסה חייבת מהעסק לפני החישוב האישי</dt>
                <dd className="font-bold">{EXAMPLE_TAXABLE_INCOME.toLocaleString('he-IL')} ₪</dd>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                המס הסופי תלוי גם בהכנסות אחרות, נקודות זיכוי, ניכויים, תיאום המס ונתונים
                אישיים. הדוגמה אינה אומדן מס ואינה מתייחסת לביטוח לאומי או למע״מ.
              </p>
            </div>
            <p className="leading-relaxed text-ink/75">
              הניכוי הנורמטיבי מחליף במסלול זה את דרישת ההוצאות העסקיות בפועל לפי הסעיפים
              הרגילים, בכפוף לחריגים שנקבעו בדין. לכן עסק שהוצאותיו בפועל גבוהות משמעותית
              מ־30% צריך להשוות את התוצאה למסלול הרגיל לפני בחירה. ראו גם{' '}
              <Link href="/self-employed/allowed-expenses" className="font-medium text-gold underline underline-offset-4">
                מדריך הוצאות מוכרות לעצמאי
              </Link>.
            </p>
          </section>

          <section id="reporting" className="scroll-mt-40" aria-labelledby="reporting-heading">
            <h2 id="reporting-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              רישום, תיאום מס ודיווח שנתי מקוצר
            </h2>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                ['01', 'רישום במסלול', 'עסק חדש שפותח עוסק פטור באופן מקוון עשוי להיות מסווג אוטומטית כבעל עסק זעיר, אלא אם בחר אחרת. עוסקים קיימים ועוסקים מורשים מבקשים שינוי סוג תיק במס הכנסה.'],
                ['02', 'תיאום מס במהלך השנה', 'מבצעים תיאום מס על ההכנסה הצפויה מהעסק עד סוף שנת המס. המערכת קובעת את שיעור המס לצורך החישוב והתשלום.'],
                ['03', 'דיווח ותשלום אחרי השנה', 'מדווחים את המחזור בפועל בדיווח המקוצר. המועד הרגיל הוא 31 במרץ של השנה העוקבת, אלא אם פורסמה הוראה אחרת לשנת הדיווח.'],
              ].map(([number, title, text]) => (
                <li key={number} className="border border-ink/15 bg-paper p-5">
                  <span className="font-mono text-sm font-bold text-gold" aria-hidden>{number}</span>
                  <h3 className="mb-2 mt-3 text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-5 space-y-3 leading-relaxed text-ink/75">
              <p>
                הדיווח המקוצר מיועד למי שהוכר כבעל עסק זעיר, ביצע תיאום מס ועומד בתנאי
                המסלול. אם בעל העסק או בן או בת הזוג חייבים בדוח שנתי מסיבה אחרת, יש לבדוק
                אם ניתן להשתמש במסלול המקוצר או שנדרש דוח מלא.
              </p>
              <p>
                בדיווח מזינים מחזור שנתי. ניכוי מס במקור והפקדה לפנסיה כעצמאי הם שדות רשות
                שדורשים אסמכתאות כאשר מדווחים עליהם. המס נקבע לפי נתוני הדיווח ותיאום המס.
                בעל עסק זעיר אינו מחויב אוטומטית במקדמות שוטפות, אך יכול לבחור לשלם מקדמות
                במהלך השנה.{' '}
                <SourceLink href={SOURCES.abridgedReport}>דיווח מקוצר ותשלום</SourceLink>{' · '}
                <SourceLink href={SOURCES.taxCoordination}>תיאום מס מקוון</SourceLink>{' · '}
                <SourceLink href={SOURCES.microAdvance}>תשלום מקדמה מרצון</SourceLink>
              </p>
            </div>
          </section>

          <section id="vat-documents" className="scroll-mt-40" aria-labelledby="vat-heading">
            <h2 id="vat-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              מה לא משתנה במע״מ ובמסמכי העסק?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-xl font-bold">אם אתם עוסק פטור</h3>
                <ul className="list-disc space-y-2 pr-5 text-sm leading-relaxed text-ink/70">
                  <li>אינכם גובים מע״מ ואינכם מנכים מס תשומות.</li>
                  <li>אינכם מוציאים חשבונית מס; מפיקים את המסמכים המתאימים לעסקה ולתקבול.</li>
                  <li>מגישים למע״מ הצהרה על מחזור השנה שחלפה.</li>
                </ul>
              </div>
              <div className="border border-ink/15 bg-paper p-5">
                <h3 className="mb-2 text-xl font-bold">אם אתם עוסק מורשה</h3>
                <ul className="list-disc space-y-2 pr-5 text-sm leading-relaxed text-ink/70">
                  <li>ממשיכים לגבות מע״מ בעסקאות חייבות ולדווח לפי תקופת הדיווח.</li>
                  <li>מפיקים חשבוניות מס ומסמכים נוספים לפי מועד החיוב וקבלת התשלום.</li>
                  <li>ניכוי מס תשומות נבחן לפי תנאי הדין והמסמך שבידי העסק.</li>
                </ul>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-ink/75">
              מסלול בעל עסק זעיר אינו משנה אף אחת מהחובות האלה. להרחבה ראו{' '}
              <Link href="/self-employed/invoices" className="font-medium text-gold underline underline-offset-4">
                מדריך חשבוניות וקבלות
              </Link>{' '}
              ואת{' '}
              <Link href="/compare/osek-patur-vs-murshe" className="font-medium text-gold underline underline-offset-4">
                ההשוואה בין עוסק פטור לעוסק מורשה
              </Link>. שירותי מע״מ הרשמיים: {' '}
              <SourceLink href={SOURCES.exemptRegistration}>פתיחת עוסק פטור</SourceLink>{' · '}
              <SourceLink href={SOURCES.exemptDeclaration}>הצהרת עוסק פטור</SourceLink>
            </p>
          </section>

          <section id="not-suitable" className="scroll-mt-40" aria-labelledby="not-suitable-heading">
            <h2 id="not-suitable-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              מתי לא בוחרים במסלול לפני בדיקה פרטנית?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['ההוצאות בפועל גבוהות', 'אם ההוצאות המותרות בפועל עשויות להיות גבוהות מ־30% מהמחזור, המסלול הרגיל עשוי להציג הכנסה חייבת נמוכה יותר. צריך להשוות גם עלות ניהול, תיעוד והשלכות עתידיות.'],
                ['קיימת חובת דוח מסיבה אחרת', 'הכנסות נוספות, נתוני בן או בת הזוג או סוג התיק עשויים לחייב דוח מלא. במקרה כזה בודקים את אופן הדיווח והאם עדיין ניתן לדרוש את הניכוי הנורמטיבי.'],
                ['יש עובדים או תלות בלקוח קשור', 'העסקת עובדים והכנסות מסוימות ממעסיק, ממעסיק לשעבר או מקרוב הן מגבלות מפורשות. לא מסווגים את היחסים לפי הכותרת בחוזה בלבד.'],
                ['מתכננים שינוי במהלך השנה', 'גיוס עובד, צמיחה מעבר לתקרה או שינוי מבנה הפעילות יכולים להשפיע על הזכאות. בנוסף, יציאה מהמסלול עשויה להגביל חזרה בשנים הבאות; יש לבדוק את הכללים התקפים לפני השינוי.'],
              ].map(([title, text]) => (
                <div key={title} className="border border-ink/15 bg-cream-2 p-5">
                  <h3 className="mb-2 text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 leading-relaxed text-ink/75">
              לפני החלטה, הכינו תחזית מחזור, רשימת הוצאות, מקורות הכנסה, קשרים עם לקוחות
              מרכזיים ותוכנית העסקה. מדריך{' '}
              <Link href="/self-employed/opening-business" className="font-medium text-gold underline underline-offset-4">
                פתיחת עסק
              </Link>{' '}
              מסביר את סדר הפעולות ברשויות; מדריך{' '}
              <Link href="/self-employed/employee-and-self-employed" className="font-medium text-gold underline underline-offset-4">
                שכיר ועצמאי במקביל
              </Link>{' '}
              מרכז את הבדיקות כשיש גם משכורת.
            </p>
          </section>

          <section aria-labelledby="checklist-heading" className="border-y border-ink/15 py-8">
            <h2 id="checklist-heading" className="mb-4 text-2xl font-bold md:text-3xl">
              צ׳קליסט קצר לפני הבחירה
            </h2>
            <ol className="grid gap-3 sm:grid-cols-2">
              {[
                'בדקו את המחזור מכל הפעילויות העסקיות מול התקרה השנתית.',
                'קבעו בנפרד את סיווג המע״מ: פטור או מורשה.',
                'עברו על מגבלות המסלול הזעיר, לא רק על גובה המחזור.',
                'השוו 30% הוצאות נורמטיביות להוצאות המותרות בפועל.',
                'בדקו אם אתם או בן או בת הזוג חייבים בדוח שנתי מסיבה אחרת.',
                'אם בחרתם במסלול: בצעו תיאום מס, שמרו מסמכים והגישו דיווח במועד.',
              ].map((item, index) => (
                <li key={item} className="flex gap-3 border border-ink/15 bg-paper p-4 text-sm leading-relaxed text-ink/75">
                  <span className="font-mono font-bold text-gold" aria-hidden>{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <CourseCTA path={PAGE_PATH} courseId="cpa" placement="comparison" />

        <section id="faq" className="mb-12 scroll-mt-40" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-ink md:text-3xl">
            שאלות נפוצות
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group border border-ink/15 bg-paper p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                  {item.question}
                  <span aria-hidden className="text-gold transition group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10 text-sm" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <p className="mb-4 leading-relaxed text-ink/60">
            המקורות נבדקו ב־{LAST_UPDATED_TEXT}. מועדים, תקרות ושירותים מקוונים עשויים להתעדכן;
            במקרה של סתירה גוברות הוראות הדין.
          </p>
          <ol className="list-decimal space-y-3 pr-5 leading-relaxed text-ink/75">
            <li><SourceLink href={SOURCES.abridgedReport}>רשות המסים — דיווח שנתי מקוצר ותשלום לעסק זעיר</SourceLink></li>
            <li><SourceLink href={SOURCES.taxCoordination}>רשות המסים — עריכת תיאום מס באופן מקוון</SourceLink></li>
            <li><SourceLink href={SOURCES.reform}>רשות המסים — רפורמת בעל עסק זעיר</SourceLink></li>
            <li><SourceLink href={SOURCES.instructions}>רשות המסים — הוראת ביצוע בנושא דיווח ועסק זעיר</SourceLink></li>
            <li><SourceLink href={SOURCES.exemptRegistration}>רשות המסים — פתיחת תיק עוסק פטור ותנאי הרישום</SourceLink></li>
            <li><SourceLink href={SOURCES.exemptDeclaration}>רשות המסים — הצהרת עוסק פטור</SourceLink></li>
            <li><SourceLink href={SOURCES.rightsGuide}>רשות המסים — דע את זכויותיך וחובותיך</SourceLink></li>
          </ol>
        </section>

        <section className="mb-8">
          <DisclaimerBox text="המידע בעמוד הוא הסבר כללי ואינו ייעוץ מס, משפטי או חשבונאי אישי. הזכאות למסלול, חובת הדיווח והכדאיות תלויות במחזור, במקורות ההכנסה, בהוצאות, בקשרים עם לקוחות ובנסיבות נוספות. לפני רישום, יציאה מהמסלול או שינוי אופן הדיווח יש לבדוק את ההוראות העדכניות מול רשות המסים או מייצג מוסמך." />
        </section>

        <AuthorBox />
      </article>
    </div>
  );
}
