import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/travel-reimbursement';
const UPDATED = '2026-10-24';
const TITLE = "החזר נסיעות לעבודה: הזכאות, התקרה והמס בתלוש";
const DESCRIPTION = "איך בודקים החזר נסיעות לעבודה? תקרת הצו, תעריף מוזל, הסעת מעסיק, ימי היעדרות והכללת ההחזר בהכנסה, עם מקורות ממשלתיים ישירים.";

const sources = [
  {
    "label": "משרד העבודה: צו הרחבה להוצאות נסיעה, סעיפים 2–7 (PDF)",
    "href": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/extention-order-travel-expenses-2016/he/extention-order-travel-expenses-2016.pdf"
  },
  {
    "label": "רשות המסים: טופס 116 וההסבר לכלילת החזר נסיעות בהכנסה (PDF)",
    "href": "https://www.gov.il/BlobFolder/service/itc116/he/Service_Pages_Income_tax_annual-report-2024_itc116-2024-acc.pdf"
  },
  {
    "label": "משרד העבודה: דוגמה להודעה על תנאי עבודה (PDF)",
    "href": "https://www.gov.il/BlobFolder/generalpage/work-rights-working-conditions-notification/he/workers-rights_admission-to-work_work-rights-working-conditions-notification_Hodaa-Pirot.pdf"
  },
  {
    "label": "רשות המסים: אישור על משכורת וניכוי מס, טופס 106",
    "href": "https://www.gov.il/he/service/itc-106"
  }
];

const sections = [
  {
    "id": "entitlement",
    "title": "מה בודקים לפני שמחשבים החזר נסיעות?",
    "paragraphs": [
      "סעיף 3 לצו מתייחס לעובד הזקוק לתחבורה כדי להגיע למקום העבודה, בעד יום עבודה בפועל שבו השתמש בתחבורה להגעה. לבירור מכינים את כתובת המגורים, אתר העבודה ותיאור ההגעה. כשהמיקום משתנה, אפשר להבחין ברישום בין האתרים ובין התקופות כדי שהשאלה לחשבות השכר תתייחס למסלול מסוים.",
      "זהו תחום הצו שבו עוסק המדריך. המבוא לצו מוציא מתחולתו עובדים במפעלים מוגנים כפי שמוגדר שם. לגבי תחולה של הסדר ענפי, מסמך העסקה או מקרה מיוחד, נדרשת בדיקה נפרדת של המקור הרלוונטי. עצם הופעת המילה נסיעות בהצעת עבודה אינה מסבירה לבדה לפי איזה הסדר חושב התשלום."
    ],
    "sourceIndices": [
      0
    ]
  },
  {
    "id": "fare",
    "title": "התקרה ובסיס התעריף הם נתונים שונים",
    "paragraphs": [
      "סעיף 2 קובע תקרה, וסעיף 4 מפנה למחיר נסיעה מוזל באוטובוס ציבורי או לכרטיס מינוי חודשי מוזל במסלול המגורים–עבודה, על בסיס כרטיס הנחה אם קיים. לפיכך בדיקת התלוש צריכה לזהות גם את המסלול והתעריף שנלקחו בחשבון. אין די באמירה שהמערכת שילמה לפי המקסימום בלי להבין את בסיס החישוב.",
      "לצורך הבירור אפשר לבקש פירוט של סוג הכרטיס, המסלול והתקופה שאליהם התייחס החישוב. המדריך אינו מציג מחיר תחבורה עדכני לכל אזור או נוסחה אישית. תעריף שאינו תואם למסלול, להנחה או לתקופת העבודה יכול לשנות את נתוני הבדיקה. מסמך שמפרט את ההנחות מאפשר לבחון אותן מול המידע הרשמי המתאים."
    ],
    "sourceIndices": [
      0
    ]
  },
  {
    "id": "transport",
    "title": "הסעת מעסיק והיעדרות משנות את הבדיקה",
    "paragraphs": [
      "סעיף 6 מחריג מהחזר מי שמוסע לעבודה על חשבון המעסיק או מטעמו. אם ההסעה היא לכיוון אחד בלבד, הצו מתייחס להחזר עד מחצית הסכומים הנזכרים בו. סעיף 7 קובע שאין החזר לפי הצו בעד תקופת היעדרות. במקרה של שילוב הסעה ונסיעה עצמאית, תיאור ההגעה לכל כיוון חשוב לבירור.",
      "רישום עבודה מסודר יכול להפריד בין הגעה לאתר, היעדרות ושימוש בהסעה מטעם המעסיק. במקרה של יום עבודה מהבית או סידור משולב, אפשר לבקש הסבר איזה הסדר הוחל ואילו ימים נכללו. אין במדריך קביעה עצמאית של זכאות בכל סידור כזה. הבדיקה מחברת את העובדות להוראה או להסכמה שעליה מסתמך המעסיק."
    ],
    "sourceIndices": [
      0
    ]
  },
  {
    "id": "gross-and-net",
    "title": "השם החזר אינו מבטיח שהסכום יתקבל כולו בנטו",
    "paragraphs": [
      "בהערות לטופס 116 של רשות המסים נכלל החזר הוצאות נסיעה בין הרכיבים שיש לכלול בהכנסה המדווחת לצורך תיאום מס. לכן אין להניח שהמילה החזר הופכת את התשלום לפטור. הסכום המוצג ברכיב וההעברה הסופית לחשבון הבנק עונים על שאלות שונות: מה נרשם לתשלום ומה התקבל לאחר כלל הניכויים.",
      "בדיקה תפעולית מפרידה בין סכום הנסיעות, בסיס ההכנסה ששימש לחישוב המס וסך הניכויים בתלוש. כאשר הפער בנטו אינו ברור, אפשר לבקש מחשבות השכר פירוט של ההשפעה המיוחסת לרכיב. אין להסיק שיעור מס אישי מתוך יחס בין רכיב הנסיעות לכלל הנטו, ואין כאן התחייבות לסכום נטו מסוים."
    ],
    "sourceIndices": [
      1
    ]
  },
  {
    "id": "different-payments",
    "title": "נסיעה לעבודה, אחזקת רכב ונסיעה בתפקיד",
    "paragraphs": [
      "בתיק הבדיקה מועיל לזהות את מטרת התשלום לפני שמנסים להשוות סכומים. השתתפות בהגעה למקום העבודה, בקשת החזר על הוצאה במהלך משימה והסדר שימוש ברכב הם נושאים שונים לבדיקה. את ההסבר אפשר לבקש על בסיס מסמך ההעסקה, נוהל ההוצאות או האישור הנוגע לנסיעה, בלי להחיל אוטומטית הוראה שנועדה למקרה אחר.",
      "דוגמת ההודעה על תנאי עבודה שמפרסם משרד העבודה מספקת מסגרת לרישום תשלומי שכר ותנאים. היא יכולה לעזור לזהות מה תועד ומה דורש הבהרה, אך אינה מכריעה לבדה מחלוקת על רכיב. גם השפעת נסיעות על הפקדות או על זכויות אחרות דורשת מקור ובדיקת ההסדר. אין להסיק אותה מעצם הטיפול ברכיב לצורך מס הכנסה."
    ],
    "sourceIndices": [
      2
    ]
  },
  {
    "id": "reconcile",
    "title": "איך מציגים שאלה שאפשר לבדוק מול התלוש?",
    "paragraphs": [
      "פנייה ממוקדת יכולה לציין את חודש העבודה, הרכיב, מספר ימי ההגעה כפי שנרשם, המסלול והתעריף שהמעסיק ציין. אם קיימת הסעה, אפשר לפרט באילו ימים ולאיזה כיוון. לצד הנתונים מצרפים את המסמך שעליו נשענת השאלה ואת התלוש הרלוונטי. כך אפשר לבודד פער בנתוני הנוכחות מפער בבסיס התעריף או באופן הצגת התשלום.",
      "לאחר הבירור אפשר לשמור את תשובת חשבות השכר יחד עם מסמך מתוקן, אם הופק. טופס 106 הוא אישור על נתוני השכר והניכויים, והוא יכול לסייע בבדיקה השנתית לצד התלושים. סכום שנתי לבדו אינו מפרט את ההגעה בכל יום, ולכן התיעוד החודשי משמש להבנת הבירור. מחלוקת על הזכאות המשפטית מועברת לבדיקה מתאימה עם המסמכים."
    ],
    "sourceIndices": [
      3
    ]
  }
];

const faqItems = [
  {
    "question": "האם התקרה היא סכום קבוע שמגיע בכל יום?",
    "answer": "לא. סעיפי הצו מחייבים לבחון צורך בתחבורה, עבודה בפועל ובסיס תעריף, בכפוף להסדרי ההסעה וההיעדרות. התקרה מגבילה את ההשתתפות לפי הצו ואינה מחליפה את הבדיקה.",
    "sourceIndices": [
      0
    ]
  },
  {
    "question": "מה קורה כשהמעסיק מסיע רק בכיוון אחד?",
    "answer": "סעיף 6 לצו מתייחס להחזר עד מחצית הסכומים הנקובים בו במקרה של הסעה לכיוון אחד. את המסלול ואת פרטי ההסעה מציגים בבירור החישוב.",
    "sourceIndices": [
      0
    ]
  },
  {
    "question": "האם החזר נסיעות פטור ממס רק בגלל שמו?",
    "answer": "לא ניתן להסיק פטור מהכותרת. בהסבר הרשמי לטופס 116 החזר הוצאות נסיעה מופיע ברכיבי ההכנסה שיש לכלול בבקשת התיאום.",
    "sourceIndices": [
      1
    ]
  }
];

const relatedLinks = [
  {
    "href": "/salaried/payslip-guide",
    "label": "איתור רכיב הנסיעות בתלוש"
  },
  {
    "href": "/salaried/salary-components",
    "label": "הבחנה בין רכיבי שכר"
  },
  {
    "href": "/personal-tax/salary-net-gross",
    "label": "אומדן שכר ברוטו ונטו"
  },
  {
    "href": "/salaried/form-106",
    "label": "בדיקת אישור השכר השנתי"
  },
  {
    "href": "/salaried/starting-new-job",
    "label": "בירור תנאי עבודה בקליטה"
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

export default function TravelReimbursementPage() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: "החזר הוצאות נסיעה", url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: "החזר הוצאות נסיעה" }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed text-ink/75">רכיב הנסיעות בתלוש מחבר בין מסלול ההגעה לעבודה, הימים שבהם מגיעים אליה והטיפול בהכנסה. כאן המיקוד הוא בהשתתפות המעסיק בנסיעה מהבית לעבודה ובחזרה. החזר עבור נסיעה במסגרת התפקיד או הסדר אחזקת רכב דורשים בירור של ההסדר המסוים.</p>
          <p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5">
          <p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">האם כל עובד מקבל את מלוא תקרת הנסיעות?</h2>
          <p className="leading-relaxed text-ink/80">לא. סעיפי צו ההרחבה קושרים את ההשתתפות לצורך בתחבורה, לעבודה בפועל ולבסיס התעריף שנקבע בצו. התקרה שבצו היא עד 22.60 ש״ח ליום עבודה, בתחולה מ־1.2.2016, כפי שנבדק ב־24.10.2026. זו תקרה לחישוב ההשתתפות לפי הצו, ולא הבטחה לסכום הזה בכל יום.</p>
          <SourceLinks indices={[0]} />
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
