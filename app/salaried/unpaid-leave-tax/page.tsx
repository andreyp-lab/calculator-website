import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/unpaid-leave-tax';
const UPDATED = '2026-10-24';
const TITLE = "חל״ת ומס הכנסה: דמי ביטוח ובדיקת השנה";
const DESCRIPTION = "מה בודקים במס ובביטוח הלאומי בתקופת חופשה ללא תשלום? אחריות לתשלום דמי ביטוח, דיווח חל״ת, מס מדמי אבטלה והכנת מסמכים לבדיקה שנתית.";

const sources = [
  {
    "label": "ביטוח לאומי: דיווח ותשלום עבור עובדים בחופשה ללא תשלום",
    "href": "https://b2b.btl.gov.il/BTL.ILG.Payments/T613Info.aspx"
  },
  {
    "label": "ביטוח לאומי: רישום עובד שכיר בחופשה ללא תשלום",
    "href": "https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Employee_in_vacation/Pages/rishum.aspx"
  },
  {
    "label": "ביטוח לאומי: שאלת חל״ת וחובת תשלום דמי ביטוח",
    "href": "https://www.btl.gov.il/About/faq/ביטוח%20וגבייה/Pages/אני%20יוצא%20החודש%20לחופשה%20ללא%20תשלום%20מה%20עלי%20לעשות.aspx"
  },
  {
    "label": "ביטוח לאומי: סכום דמי האבטלה וניכויים מהקצבה",
    "href": "https://www.btl.gov.il/benefits/Unemployment/Pages/sum.aspx"
  },
  {
    "label": "רשות המסים: בקשה להחזר מס, טופס 135",
    "href": "https://www.gov.il/he/service/itc135"
  },
  {
    "label": "רשות המסים: עריכת תיאום מס באופן מקוון",
    "href": "https://www.gov.il/he/service/tax-coordination-online"
  },
  {
    "label": "תקנות מס הכנסה: ניכוי ממשכורת ומשכר עבודה, תקנות 1, 2, 4, 9 ו־10",
    "href": "https://www.btl.gov.il/Laws1/02_0103_100076.pdf"
  },
  {
    "label": "ביטוח לאומי: חוזר חל״ת 1496 — ספירת חודשים קלנדריים מלאים",
    "href": "https://www.btl.gov.il/Insurance/HozrimBituah/Hozrim/חוזר%20חלת%20אוגוסט%202021.pdf#page=5"
  }
];

const sections = [
  {
    "id": "dates",
    "title": "מתעדים את תקופת החל״ת לפני שבודקים חיובים",
    "paragraphs": [
      "נקודת הפתיחה היא אישור מעסיק שמזהה את היציאה לחל״ת ואת התקופה שעליה הוא מדווח. בדף הרישום של ביטוח לאומי נכתב שעובד היוצא לחל״ת חייב להודיע למחלקת ביטוח וגבייה, בסניף או באמצעות טופס דין וחשבון רב־שנתי, ולצרף אישור מעסיק. זהו מסמך לבירור המעמד, לצד מסמכי השכר.",
      "אפשר לנהל רישום של תאריך ההפסקה, הארכה שנמסרה ומועד החזרה בפועל. כאשר התאריכים אצל המעסיק ובאזור האישי אינם תואמים, הבירור צריך לזהות מה דווח ומה עוד נדרש לעדכון. אישור שנשמר אצל העובד אינו כשלעצמו הוכחה שהדיווח הנדרש נקלט במערכת הרשות."
    ],
    "sourceIndices": [
      1
    ]
  },
  {
    "id": "employer-payment",
    "title": "החודשים הקלנדריים המלאים הראשונים: מי משלם?",
    "paragraphs": [
      "דף התשלום הרשמי למעסיקים מציין שהדיווח והתשלום במסלול חל״ת הם עבור שני החודשים הקלנדריים המלאים הראשונים בלבד. חודש יציאה או חזרה חלקי אינו נספר כחודש מלא לעניין זה; למשל, בחל״ת מ־15 במרץ עד 4 במאי, החוזר הרשמי מדגים חיוב מעסיק עבור אפריל בלבד. המסלול מותנה גם בכך שהמבוטח אינו עובד באותו זמן אצל מעסיק אחר ואינו עצמאי.",
      "ביטוח לאומי מציין גם שהמעסיק רשאי לנכות את דמי הביטוח ששילם מכל סכום שיגיע ממנו לעובד. כאשר מופיע ניכוי כזה בתלוש החזרה, הבירור התפעולי הוא לאיזו תקופה הוא מתייחס ואילו תשלומים בוצעו. פירוט בכתב מאפשר להבחין בין חיוב בגין החל״ת לבין הניכויים המתייחסים לשכר העבודה הנוכחי."
    ],
    "sourceIndices": [
      0,
      2,
      7
    ]
  },
  {
    "id": "continued-leave",
    "title": "לאחר שני חודשים קלנדריים מלאים בודקים את המעמד",
    "paragraphs": [
      "לפי דף התשלום והחוזר, לאחר שני החודשים הקלנדריים המלאים שבאחריות המעסיק העובדים נדרשים להירשם בביטוח לאומי ולטפל בתשלום בעצמם. שאלת־התשובה הרשמית מסייגת את התשלום המזערי בהעדר הכנסות שלא מעבודה ובהעדר עבודה עצמאית. משום כך אין כאן סכום אחיד לכל מי שנמצא בחל״ת.",
      "אפשר להשוות את החיובים באזור האישי לאישור החל״ת ולתשובות שהתקבלו מהמעסיק. כאשר מתקבלת דרישה שאינה מובנת, פנייה מועילה מציגה את התקופה, המעמד המדווח ומסמכי ההכנסה. אין להסיק מהעדר תלוש שאין חיוב, או מהעדר דרישת תשלום שהמעמד עודכן. את התוצאה בודקים לפי הרישום וההחלטה של ביטוח לאומי."
    ],
    "sourceIndices": [
      0,
      2,
      7
    ]
  },
  {
    "id": "unemployment-tax",
    "title": "דמי אבטלה הם בדיקה נפרדת מהשכר ומהגבייה",
    "paragraphs": [
      "ביטוח לאומי מציין בדף סכום הקצבה שמדמי אבטלה מנוכה מס הכנסה במקור, וכן מנוכים דמי ביטוח לאומי וביטוח בריאות לפי הכללים המפורטים שם. לכן קבלת קצבה, כאשר אושרה, מוסיפה מסמך הכנסה וניכויים לתיק. אין להסיק מהכותרת חופשה ללא תשלום שכל התקבולים בתקופה פטורים ממס.",
      "העמוד אינו מפרט תנאי זכאות לדמי אבטלה ואינו קובע אם מתקיים הסדר מיוחד בתקופה מסוימת. הבדיקה המעשית מפרידה בין אישור התביעה, פירוט התשלום והניכויים, וחיובים שמופיעים במחלקת הגבייה. אם קיימת שאלה על היחס ביניהם, מציגים לביטוח לאומי את המסמכים יחד ומבקשים הסבר למקרה, בלי לחשב קיזוז עצמאי."
    ],
    "sourceIndices": [
      3
    ]
  },
  {
    "id": "income-tax",
    "title": "הפסקת הכנסה עשויה להצדיק בדיקת ניכוי מס",
    "paragraphs": [
      "תקנה 9 לתקנות ניכוי ממשכורת מזכירה נקודות זיכוי שלא ניתנו עקב העדר הכנסה בחלק משנת המס. תקנה 10 מאפשרת הוראות להתאמת ניכוי כאשר נוצר או עלול להיווצר עודף או חסר. זהו בסיס לבירור, ולא הבטחה שהפסקת העבודה תייצר החזר. יש לבחון גם תקבולים אחרים שהתקבלו בתקופה.",
      "לבדיקה במהלך השנה קיים שירות תיאום המס של רשות המסים, הכולל בקשות להקלה בחישוב. מרכזים את ההכנסות והאישורים הנדרשים, ובודקים התאמה למסלול הרשמי. כאשר חוזרים לשכר עבודה, אפשר לברר איזה אישור נמצא אצל המעסיק ואילו נתונים שימשו לחישוב. תלוש החזרה לבדו אינו מסכם את כל ההכנסות בשנת המס."
    ],
    "sourceIndices": [
      6,
      5
    ]
  },
  {
    "id": "return-and-review",
    "title": "בחזרה לעבודה מחברים את המסמכים לתמונה שנתית",
    "paragraphs": [
      "בתיק הבדיקה ניתן להחזיק את אישור החל״ת, מסמכי החזרה, תלושי השכר, אישורי התשלומים מביטוח לאומי והתכתבות בנושא הגבייה. לצורך בקשת החזר מס, דף השירות דורש אישורי הכנסה מכל המקורות הרלוונטיים, ובהם טופסי 106 ואישורים על דמי אבטלה ותקבולים נוספים. רשימת המסמכים נקבעת לפי הנסיבות וההליך.",
      "אפשר להכין רשימת חוסרים לפי הגוף שמנפיק כל אישור, ולברר פער לפני העברת התיק לבדיקה. המטרה היא למנוע השמטה או ספירה כפולה של תקבול. זכאות להחזר, חובת דיווח וסכום לתשלום נבדקים על סמך הנתונים המלאים. סימולציה באתר יכולה לסייע בהבנת התמונה, אך אינה החלטה של רשות המסים."
    ],
    "sourceIndices": [
      4
    ]
  }
];

const faqItems = [
  {
    "question": "האם המעסיק יכול לגבות בחזרה דמי ביטוח ששילם בחל״ת?",
    "answer": "לפי שאלת־התשובה הרשמית, הוא רשאי לנכות את דמי הביטוח ששילם מכל סכום שיגיע ממנו לעובד. בבירור תלוש אפשר לבקש לזהות את התקופה והתשלום שאליהם מתייחס הניכוי.",
    "sourceIndices": [
      2
    ]
  },
  {
    "question": "איך מדווחים לביטוח לאומי על יציאה לחל״ת?",
    "answer": "דף הרישום מפנה למחלקת ביטוח וגבייה בסניף או לטופס דין וחשבון רב־שנתי, עם אישור מהמעסיק על היציאה לחופשה. מעקב אחר הקליטה הוא חלק מהבדיקה התפעולית.",
    "sourceIndices": [
      1
    ]
  },
  {
    "question": "האם חל״ת מבטיח החזר מס?",
    "answer": "לא. נדרשת בדיקת ההכנסות, המס שנוכה והמסמכים לפי מסלול ההגשה. גם תשלומים מביטוח לאומי עשויים להצריך אישורים בתיק בדיקת המס.",
    "sourceIndices": [
      4
    ]
  }
];

const relatedLinks = [
  {
    "href": "/salaried/form-106",
    "label": "אישורי השכר לבדיקה שנתית"
  },
  {
    "href": "/personal-tax/tax-refund",
    "label": "אומדן החזר מס"
  },
  {
    "href": "/salaried/job-change-tax",
    "label": "רצף הכנסות במעבר עבודה"
  },
  {
    "href": "/salaried/payslip-guide",
    "label": "בדיקת ניכויים בתלוש"
  },
  {
    "href": "/salaried/two-jobs",
    "label": "בירור הכנסות ממעסיק נוסף"
  }
];

function SourceLinks({ indices }: { indices: number[] }) {
  if (indices.length === 0) return null;

  return (
    <p className="mt-3 text-sm leading-relaxed text-ink/70">
      מקור רשמי: {indices.map((index, position) => (
        <span key={sources[index].href}>
          {position > 0 ? ' · ' : ''}
          <a href={sources[index].href} aria-label={sources[index].label} title={sources[index].label} className="underline">[{index + 1}]</a>
        </span>
      ))}
    </p>
  );
}

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  authors: [{ name: 'אנדרי פלטונוב' }],
  openGraph: {
    title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PAGE_PATH}`,
    type: 'article', locale: 'he_IL', siteName: 'חשבונאי',
    modifiedTime: UPDATED, images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function UnpaidLeaveTaxPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: 'he-IL',
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
    image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PAGE_PATH}` },
    citation: sources.map((source) => source.href),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: "מס וביטוח בחל״ת", url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: "מס וביטוח בחל״ת" }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed text-ink/75">בתקופת חופשה ללא תשלום יש להבחין בין הכנסה לצורכי מס, תשלום דמי ביטוח ובדיקת קצבה. המדריך מתמקד בחיבור בין המסמכים ובהבנת החיובים בתקופת החל״ת ובחזרה לעבודה. הוא אינו קובע אם ההוצאה לחופשה חוקית או אם קיימת זכאות אישית לדמי אבטלה.</p>
          <p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5">
          <p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">האם הפסקת השכר מפסיקה גם את דמי הביטוח?</h2>
          <p className="leading-relaxed text-ink/80">לא בהכרח. לפי ביטוח לאומי, במסלול של עובד בחל״ת שאינו עובד אצל מעסיק אחר ואינו עצמאי, המעסיק משלם עבור שני החודשים הקלנדריים המלאים הראשונים. לאחריהם העובד מטפל בתשלום בעצמו לפי המעמד וההכנסות. חודש יציאה או חזרה חלקי אינו נספר כחודש מלא לעניין זה.</p>
          <SourceLinks indices={[0, 7]} />
        </section>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <SourceLinks indices={section.sourceIndices} />
            </section>
          ))}
        </div>
        <section aria-labelledby="related" className="my-10">
          <h2 id="related" className="mb-4 text-2xl font-bold text-ink">מדריכים וכלים להמשך בדיקה</h2>
          <ul className="grid gap-3 sm:grid-cols-2">{relatedLinks.map((link) => (
            <li key={link.href}><Link href={link.href} className="block border border-ink/15 p-4 text-ink underline hover:border-gold">{link.label}</Link></li>
          ))}</ul>
        </section>
        <section aria-labelledby="faq" className="mb-10">
          <h2 id="faq" className="mb-4 text-2xl font-bold text-ink">שאלות נפוצות</h2>
          <div className="space-y-3">{faqItems.map((item) => (
            <details key={item.question} className="border border-ink/15 p-4">
              <summary className="cursor-pointer font-bold text-ink">{item.question}</summary>
              <p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p>
              <SourceLinks indices={item.sourceIndices} />
            </details>
          ))}</div>
        </section>
        <section aria-labelledby="sources" className="mb-8">
          <h2 id="sources" className="mb-3 text-xl font-bold text-ink">מקורות רשמיים</h2>
          <p className="mb-3 text-sm text-ink/70">המקורות נבדקו ביום 24.10.2026 ומקושרים גם לצד הטענות בגוף המדריך.</p>
          <ul className="space-y-2">{sources.map((source, index) => (
            <li key={source.href}><a href={source.href} className="text-ink/80 underline">[{index + 1}] {source.label}</a></li>
          ))}</ul>
        </section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">
          המידע כללי ואינו ייעוץ מס, משפטי או פנסיוני ואינו המלצה אישית. חבות מס, דמי ביטוח וזכויות עבודה נבדקים לפי הנתונים האישיים וההוראות החלות. אומדן אינו אישור של רשות. לבירור מקרה מסוים נדרשת פנייה לרשות המוסמכת או לבעל מקצוע מתאים עם המסמכים הרלוונטיים.
        </aside>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. באתר חשבונאי מסביר מושגים פיננסיים ומציג כלים לבדיקת נתונים אישיים מול מסמכים ומקורות רשמיים." />
      </article>
    </div>
  );
}
