import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const SITE_URL = 'https://cheshbonai.co.il';
const PAGE_PATH = '/salaried/job-change-tax';
const UPDATED = '2026-10-24';
const TITLE = "החלפת עבודה באמצע השנה: תיאום מס ורצף הכנסות";
const DESCRIPTION = "איך בודקים את המס כשמחליפים עבודה במהלך השנה? רצף הכנסות, טופס 101, תשלום מאוחר מהמעסיק הקודם, תיאום מס ובדיקה שנתית, עם מקורות רשמיים.";

const sources = [
  {
    "label": "רשות המסים: עריכת תיאום מס באופן מקוון",
    "href": "https://www.gov.il/he/service/tax-coordination-online"
  },
  {
    "label": "רשות המסים: כרטיס עובד, טופס 101",
    "href": "https://www.gov.il/he/service/itc101"
  },
  {
    "label": "רשות המסים: בקשה להחזר מס, טופס 135",
    "href": "https://www.gov.il/he/service/itc135"
  },
  {
    "label": "רשות המסים: אישור על משכורת וניכוי מס, טופס 106",
    "href": "https://www.gov.il/he/service/itc-106"
  },
  {
    "label": "תקנות מס הכנסה: ניכוי ממשכורת ומשכר עבודה, תקנות 1, 2, 4, 9 ו־10",
    "href": "https://www.btl.gov.il/Laws1/02_0103_100076.pdf"
  }
];

const sections = [
  {
    "id": "income-sequence",
    "title": "מתחילים ברצף ההכנסות, ולא בהפרש בין המשכורות",
    "paragraphs": [
      "לצורך הבירור מרכזים את מועדי סיום העבודה ותחילתה אצל המעסיק החדש, את התלושים ואת פירוט התשלומים הצפויים. ליד כל מעסיק אפשר לרשום מה כבר שולם ומה עדיין דורש אישור. הרשימה נועדה להכנת נתונים; היא אינה קובעת בעצמה כיצד מסווגים תשלום או לאיזו תקופה הוא שייך מבחינת המס.",
      "בשירות תיאום המס מסבירה רשות המסים שהמערכת מחשבת הכנסה שנתית צפויה לפי הדיווח. לכן משכורת חדשה לבדה אינה מתארת את התמונה שמזינים בבדיקה. כאשר קיימת אי־ודאות לגבי סכום ממעסיק קודם, אפשר לבקש ממנו פירוט כתוב ולהציג את השאלה לגורם המטפל במקום למחוק את התשלום מהתמונה."
    ],
    "sourceIndices": [
      0
    ]
  },
  {
    "id": "employee-card",
    "title": "טופס 101 מתאר את המצב האמיתי אצל המעסיק החדש",
    "paragraphs": [
      "דף השירות של רשות המסים מחייב עובד שכיר להגיש כרטיס עובד עם תחילת העבודה ולצרף צילום תעודת זהות עם ספח ומסמכים לפי הטופס. במעבר עבודה קוראים את סעיפי ההצהרה בהתאם להכנסות ולנסיבות בפועל. מסמך שהוגש למעסיק הקודם אינו מעיד שהפרטים נקלטו גם במערכת החדשה.",
      "אפשר להפריד בתיק בין ההצהרה שנמסרה למעסיק לבין אישור מס שהופק מהרשות. כך ברור מה נחתם, מה אושר ומה טרם נבדק. אם שאלת ההכנסה הנוספת אינה ברורה במקרה המסוים, בירור עם חשבות השכר או הרשות מאפשר להשלים אותה על בסיס המסמכים. אין צורך לבחור תשובה רק כדי לסיים את תהליך הקליטה."
    ],
    "sourceIndices": [
      1
    ]
  },
  {
    "id": "coordination",
    "title": "מתי בודקים תיאום או שינוי של אישור קיים?",
    "paragraphs": [
      "רשות המסים מציגה את השירות המקוון גם לשכירים שמבקשים הקלה בחישוב המס, ומאפשרת לעדכן תיאום שכבר נערך בשנת המס הנוכחית. לפני השימוש בודקים בדף השירות את ההתאמה למסלול ואת רשימת המקרים שבהם נדרשת פנייה לפקיד השומה. החלפת מקום עבודה אינה מספיקה לקביעה גורפת לגבי המסלול האישי.",
      "בבדיקה מרכזים מספרי תיקי ניכויים, נתוני שכר ומסמכים התומכים בבקשה. לאחר הפקת אישורים, הנחיית הרשות היא למסור אותם למעסיקים או למשלמים. אפשר לתעד בתיק לאיזה גורם נמסר כל אישור ומהי הגרסה העדכנית. עצם השלמת הבקשה במערכת אינה מסבירה עדיין כיצד האישור יושם בתלוש המסוים."
    ],
    "sourceIndices": [
      0
    ]
  },
  {
    "id": "gap-or-overlap",
    "title": "הפסקת עבודה וחפיפה דורשות שאלות שונות",
    "paragraphs": [
      "כאשר יש תקופה ללא הכנסה, תקנה 9 מזכירה אפשרות לטיפול בנקודות זיכוי שלא ניתנו עקב העדר הכנסה בחלק משנת המס. תקנה 10 מסדירה סמכות להורות על התאמת ניכוי כדי למנוע עודף או חסר. אלו בסיסים לבדיקה; אין בהם הבטחה שכל הפסקה תיצור החזר או שסכום התלוש יקטן בשיעור מסוים.",
      "כאשר העבודות חופפות, מועיל להכין פירוט נפרד לכל משלם ולכל תשלום. כאשר אין חפיפה, עדיין חשוב להציג את ההכנסה שכבר התקבלה אם היא נדרשת בהליך. השאלה התפעולית היא איזה מידע הובא בחשבון. תשובה מחשבות השכר יכולה לזהות נתון חסר בלי להניח מראש שהניכוי הגבוה או הנמוך מוכיח טעות."
    ],
    "sourceIndices": [
      4
    ]
  },
  {
    "id": "late-payment",
    "title": "תשלום מאוחר מהמעסיק הקודם: בודקים את מהותו",
    "paragraphs": [
      "אם מתקבל תשלום לאחר תחילת העבודה החדשה, התיק צריך לכלול את תלוש התשלום ואת הסבר המעסיק. אפשר לברר האם מדובר בשכר, בבונוס, בהפרשים או ברכיב הקשור לפרישה. אין להסיק מסיווג ההעברה בבנק בלבד מהו הטיפול המקצועי הנדרש. גם הכותרת גמר חשבון אינה מפרטת את כל הרכיבים שבתשלום.",
      "לאחר שמתקבל הפירוט ניתן לבדוק עם הגורם המטפל אם הנתונים ששימשו לתיאום עדיין מתאימים. במקרה של בונוס קיים באתר מדריך ייעודי, ובמקרה של מענקי פרישה נדרשת בדיקה של המסמכים והדין החלים עליהם. כך נשמרת הבחנה בין בדיקת רצף ההכנסות לבין החלטה אישית לגבי כספי פרישה."
    ],
    "sourceIndices": []
  },
  {
    "id": "annual-review",
    "title": "בסיום השנה מחברים את אישורי ההכנסה",
    "paragraphs": [
      "טופס 106 מרכז נתוני משכורת וניכויי מס אצל המעסיק. בהכנת בדיקה שנתית מרכזים את האישורים ממקומות העבודה הרלוונטיים, ובקשת החזר נערכת לפי רשימת המסמכים בדף השירות. רשות המסים מבקשת גם אישורי הכנסות ממקורות נוספים בהתאם למקרה. לכן התלוש האחרון מהמעסיק החדש אינו תחליף לתיק האישורים המלא.",
      "בפועל אפשר להשוות את שמות המעסיקים, שנת המס והנתונים לאוסף המסמכים שנשמר במהלך המעבר. פער מתועד מועבר לבירור לפני ההגשה. תוצאת סימולציה מסייעת להבנת הנתונים, ואילו הזכאות להחזר מתבררת בהליך הרשות. החלטה על הגשה ועל המסלול המתאים דורשת את מלוא הנתונים האישיים, לרבות שאלת חובת הדיווח."
    ],
    "sourceIndices": [
      3,
      2
    ]
  }
];

const faqItems = [
  {
    "question": "האם צריך לתאם מס גם כשאין חפיפה בין העבודות?",
    "answer": "אי אפשר להכריע לפי החפיפה בלבד. שירות הרשות כולל גם בקשות להקלה בניכוי, ותקנה 10 עוסקת במניעת עודף או חסר בניכוי. הבדיקה נשענת על ההכנסות והמסמכים של השנה.",
    "sourceIndices": [
      0,
      4
    ]
  },
  {
    "question": "כבר יש אישור תיאום מס. האם אפשר לשנות אותו?",
    "answer": "דף השירות מאפשר לעדכן תיאום שנערך בשנת המס הנוכחית. השינוי מדווח במערכת, עם מסמכים תומכים לפי הצורך. את האישורים המופקים מוסרים למשלמים שאליהם הם מיועדים.",
    "sourceIndices": [
      0
    ]
  },
  {
    "question": "האם החלפת עבודה מבטיחה החזר?",
    "answer": "לא. בקשת החזר נבחנת על סמך הנתונים והאישורים. מרכזים אישורי הכנסה וניכויים מכל המקורות הנדרשים, ובודקים את התאמת מסלול ההגשה לנסיבות.",
    "sourceIndices": [
      2
    ]
  }
];

const relatedLinks = [
  {
    "href": "/salaried/starting-new-job",
    "label": "מסמכי הקליטה לעבודה חדשה"
  },
  {
    "href": "/salaried/two-jobs",
    "label": "עבודה אצל מעסיקים במקביל"
  },
  {
    "href": "/salaried/form-106",
    "label": "איסוף ובדיקת טופס 106"
  },
  {
    "href": "/personal-tax/tax-refund",
    "label": "אומדן ובדיקת החזר מס"
  },
  {
    "href": "/employee-rights/annual-bonus",
    "label": "ניכויים מתשלום בונוס"
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

export default function JobChangeTaxPage() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'שכירים', url: '/salaried' }, { name: "מס בהחלפת עבודה", url: PAGE_PATH }]} />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'שכירים', href: '/salaried' }, { label: "מס בהחלפת עבודה" }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed text-ink/75">החלפת מעסיק יוצרת תיק מסמכים המחבר בין סוף העבודה הקודמת למשכורת החדשה. המדריך מתמקד ברצף ההכנסות והניכויים באותה שנת מס, ובשאלות שעולות כשיש הפסקה, חפיפה או תשלום מאוחר. הוא אינו מדריך לקביעת הזכאות לפיצויי פרישה.</p>
          <p className="mt-3 text-sm text-ink/70">מאת אנדרי פלטונוב, רו״ח · בדיקת תוכן ומקורות: <time dateTime={UPDATED}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border border-gold/40 bg-cream-2 p-5">
          <p className="mb-2 text-sm font-bold text-gold">תשובה מהירה</p>
          <h2 id="quick-answer" className="mb-3 text-xl font-bold text-ink">האם החלפת עבודה מחייבת אוטומטית החזר מס?</h2>
          <p className="leading-relaxed text-ink/80">אין להסיק זכאות להחזר מעצם המעבר. בדיקת המס נשענת על ההכנסות והניכויים הרלוונטיים לשנה. במהלך השנה ניתן לבדוק התאמת ניכויים דרך רשות המסים; לאחריה קיים מסלול בקשה להחזר, למי שעומד בתנאיו. אישור תיאום והחלטה בבקשת החזר הם מסמכים שונים.</p>
          <SourceLinks indices={[0,2]} />
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
