import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "זיכוי מס לתושבי יישוב מזכה: בדיקת תושבות";
const description = "איך בודקים יישוב מזכה בלוחות רשות המסים, מכינים בקשת תושבות ומעבירים טופס 1312א למעסיק. מדריך מעשי עם מקורות רשמיים ללא העתקת רשימת יישובים משתנה.";
const pageUrl = "https://cheshbonai.co.il/personal-tax/locality-tax-credit";
const checkedAt = '2026-10-24';
const quickAnswer = "בדיקת הטבת מס לפי מקום מגורים מתחילה ברשימת היישובים של שנת המס ובאישור תושבות המתייחס למצבכם בפועל. רשות המסים מפנה לטופס 1312 להגשת בקשה לרשות המקומית ולטופס 1312א כאישור המועבר למעסיק. בדקו במקור הרשמי את היישוב, התנאים והתקופה; כתובת במרשם אינה מסיימת לבדה את בדיקת מרכז החיים.";
const sources = [
  {
    "url": "https://www.gov.il/he/service/itc1312",
    "label": "רשות המסים — בקשה לאישור תושבות, טופס 1312"
  },
  {
    "url": "https://www.gov.il/he/pages/income-tax-monthly-deductions-booklet",
    "label": "רשות המסים — חוברות הניכויים ורשימות היישובים לפי שנה"
  },
  {
    "url": "https://www.gov.il/BlobFolder/service/itc1312/he/Service_Pages_Income_tax_itc1312.pdf",
    "label": "רשות המסים — טופס בקשת תושבות והסבר מרכז החיים"
  },
  {
    "url": "https://www.gov.il/he/service/tax-coordination-online",
    "label": "רשות המסים — תיאום מס ובקשת הקלה"
  },
  {
    "url": "https://www.gov.il/he/service/itc135",
    "label": "רשות המסים — החזר מס והמסמכים לתושבי יישוב מזכה"
  }
];
const sections = [
  {
    "heading": "איך לבדוק אם היישוב מופיע ברשימה הרשמית?",
    "source": 1,
    "paragraphs": [
      "פתחו את עמוד חוברות הניכויים של רשות המסים ובחרו את שנת המס שאתם בודקים. בתוך החוברת חפשו את הפרק העוסק בהטבות מס ביישובים ואת רשימת היישובים המוטבים. השוו את שם היישוב המדויק לפרטי מקום המגורים שלכם, וקראו גם הערות ונספחים הקשורים לרשימה. שם מועצה אזורית או אזור גאוגרפי כללי אינו תחליף להתאמה לשם היישוב ברשימה.",
      "בעמוד הזה אין העתק של הרשימה, שיעורי ההטבה או תקרות ההכנסה. אלה נתונים שיש לבדוק בפרסום הרשמי המתאים לשנה ולמועד הבדיקה. לצורך מעקב אישי, שמרו את שם החוברת ואת הפרק שעליו הסתמכתם. אם אין לכם גישה לקובץ או שלא מצאתם התאמה ברורה, בקשו הבהרה מהרשות המקומית או מרשות המסים במקום לבחור יישוב דומה."
    ]
  },
  {
    "heading": "מה ההבדל בין כתובת לבין מרכז חיים?",
    "source": 2,
    "paragraphs": [
      "טופס 1312 הרשמי מסביר שהתושבות נבחנת לפי מכלול נתונים ובהם מקום המגורים, בני המשפחה ומוסדות החינוך. לכן מטרת הבקשה רחבה מעדכון טכני של כתובת. הטופס כולל הצהרה על המגורים בפועל ועל הקשרים המשפחתיים, הכלכליים והחברתיים. קראו את נוסח ההצהרה לפני החתימה, וודאו שהוא מתאר נכון את מצבכם.",
      "אם יש פער בין הכתובת הרשומה לבין מקום השהייה, או בין מגורי בני המשפחה, הכינו הסבר עובדתי ומסמכים תומכים. אל תעלימו את הפער רק כדי שהטופס ייראה פשוט יותר. גם בעלות על דירה ביישוב אינה תשובה מלאה לשאלת המגורים בפועל. השאלה שיש לברר היא מה מלמדים הנתונים על מרכז החיים בהתאם לכללים, ולא איזו כתובת משתלמת יותר לצורך חישוב המס."
    ]
  },
  {
    "heading": "אילו מסמכים להכין לרשות המקומית?",
    "source": 0,
    "paragraphs": [
      "דף השירות של רשות המסים מונה מסמכים לצירוף לבקשה, ובהם תעודת זהות, מסמכי שכירות וחשבון מים, לפי הפירוט המופיע בו. התחילו ברשימה הרשמית ובדקו מול הרשות המקומית כיצד מגישים את החומר במצבכם. מסמכים יכולים לסייע לבירור העובדות, אך אל תציגו רשימה שהכנתם בעצמכם כאילו היא מחליפה את דרישות הרשות.",
      "ארגנו את התיק כך שברור לאיזו כתובת ולאיזו תקופה מתייחס כל מסמך. אם השם בחשבון אינו שלכם או שחוזה השכירות אינו מכסה את כל התקופה המבוקשת, בקשו הנחיה כיצד להשלים את הבירור. הימנעו משינוי תוכן של מסמך לצורך התאמה. אפשר לצרף הסבר נפרד לפער, לשמור עותק מכל מה שנשלח ולתעד בקשות להשלמה, כדי לא לחפש מחדש מסמכים שכבר הוגשו."
    ]
  },
  {
    "heading": "טופס 1312 לעומת טופס 1312א",
    "source": 0,
    "paragraphs": [
      "טופס 1312 הוא הבקשה שמוסרים לרשות המקומית. לפי דף השירות, הרשות המקומית מנפיקה טופס 1312א המעיד על מרכז החיים ביישוב המזכה, ואת האישור הזה מוסרים למעסיק. לכן שליחת הבקשה בלבד למחלקת השכר אינה שקולה להעברת אישור שהונפק לאחר בירור. הפרידו בתיק בין בקשה, אישור ותשובה לבירור כדי שתדעו מה נמצא בידכם.",
      "עם קבלת האישור בדקו את פרטי הזיהוי, שם היישוב והתקופה המתועדת. אם יש טעות, פנו לגוף שהנפיק אותו לתיקון מוסדר. אל תשנו בעצמכם את התקופה או את נוסח ההצהרה. העבירו למעסיק עותק קריא ושמרו תיעוד של המסירה. לאחר מכן בקשו לוודא קליטה ויישום, משום שהנפקת האישור והטיפול בו במערכת השכר הם שלבים שונים."
    ]
  },
  {
    "heading": "מעבר דירה או שינוי במהלך השנה",
    "source": 2,
    "paragraphs": [
      "מעבר ליישוב או יציאה ממנו מצריכים בדיקה של התקופה הרלוונטית ושל כללי הזכאות, ולא חישוב לפי הכתובת שמופיעה היום. הכינו ציר זמן עובדתי של המגורים ושל המסמכים התומכים בהם. אין בעמוד הזה קביעה על משך מגורים מזערי, אופן חישוב תקופה חלקית או זכאות במקרה מעבר; את אלה יש לבדוק מול ההוראות הרשמיות והנסיבות שלכם.",
      "אם המעבר היה בין יישובים שונים, שמרו את האישורים מכל רשות בנפרד וציינו את התקופות באופן ברור. אל תבקשו שכל השנה תיוחס לכתובת אחת רק מפני שכך קל יותר למלא את הטופס. כשמקום העבודה נשאר זהה אך המגורים השתנו, עדכנו את השאלה למחלקת השכר בהתאם. בירור מוקדם של הנתונים יכול לצמצם צורך להסביר בהמשך סתירה בין מסמכים."
    ]
  },
  {
    "heading": "פינוי זמני והנחיות מיוחדות",
    "source": 1,
    "paragraphs": [
      "בחוברת הניכויים לשנת 2026 רשות המסים מפנה גם להנחיות מיוחדות הנוגעות לתושבי יישובים שפונו. במצב כזה חשוב לקרוא את ההנחיה העדכנית ואת תחולתה, ולא להסיק שהמעבר הזמני מפסיק את ההטבה או משאיר אותה בכל מקרה. רשימת יישובים או הנחיה שנשמרו בעבר עשויות להתייחס למצב אחר, ולכן הבדיקה צריכה להתחיל שוב בפרסום הרשמי.",
      "לקראת בירור הכינו תיאור של מקום המגורים הקבוע, מקום השהייה הזמני והמסמכים שהתקבלו בנוגע לפינוי ולתושבות. שאלו איזו הנחיה רלוונטית לתקופה שלכם ומי אמור להנפיק את האישור הנדרש. הימנעו מהסתמכות על תשובה שניתנה לשכן בנסיבות שונות. כאשר יש הנחיה פרטנית בכתב, שמרו אותה עם האישור ועם מסמכי השכר כדי שיהיה אפשר להבין על מה התבסס הטיפול."
    ]
  },
  {
    "heading": "איך לבדוק את ההטבה בשכר ובשנה קודמת?",
    "source": 4,
    "paragraphs": [
      "בדף החזר המס הרשמי מופיע אישור מהרשות המקומית, טופס 1312א, בין המסמכים הנדרשים למבקשי זיכוי בשל מקום מגורים ומרכז חיים. לפני בדיקת החזר ודאו שהמסלול מתאים לכם ושהאישור מתייחס לשנה המבוקשת. בדיקה של שנה שחלפה דורשת גם נתוני הכנסה ומס מכל המקורות הרלוונטיים לפי הוראות השירות, ולא רק את אישור התושבות.",
      "בשנה השוטפת אפשר לברר עם מחלקת השכר אם האישור נקלט ומה נלקח בחשבון. כאשר נדרש תיאום מס, פעלו לפי השירות הרשמי והעבירו את האישור שהופק. במחשבון באתר השתמשו רק בנתונים שכבר אימתתם ואל תסיקו מהאומדן אישור זכאות. אם נותר פער, תארו אותו במדויק: מסמך חסר, תקופה שאינה תואמת או הטבה שלא ברור אם נכללה בחישוב."
    ]
  }
];
const faqItems = [
  {
    "question": "איפה מוצאים את רשימת היישובים המזכים?",
    "answer": "בעמוד חוברות הניכויים של רשות המסים, בקובץ של שנת המס הנבדקת. חפשו את פרק ההטבות ביישובים וקראו את הרשימה ואת ההערות במקור. הרשימה אינה מועתקת לעמוד הזה משום שהיא מתעדכנת."
  },
  {
    "question": "האם שינוי כתובת בתעודת הזהות מספיק?",
    "answer": "אין להסיק ממנו לבדו זכאות. טופס 1312 מתאר בירור של מרכז החיים ומסמכים תומכים. מסרו נתונים מלאים לרשות המקומית ובדקו את התנאים הרלוונטיים למצבכם."
  },
  {
    "question": "איזה טופס מעבירים למעסיק?",
    "answer": "דף השירות הרשמי מפנה להעברת טופס 1312א שהנפיקה הרשות המקומית. טופס 1312 הוא הבקשה לאישור. בדקו שהאישור נכון ושהוא נקלט אצל המעסיק."
  }
];

export const metadata: Metadata = {
  title: { absolute: `${title} | חשבונאי` },
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title, description, url: pageUrl, type: 'article', locale: 'he_IL',
    siteName: 'חשבונאי', modifiedTime: checkedAt,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${pageUrl}#article`,
  headline: title,
  description,
  url: pageUrl,
  mainEntityOfPage: pageUrl,
  inLanguage: 'he-IL',
  datePublished: checkedAt,
  dateModified: checkedAt,
  author: { '@type': 'Organization', name: 'מערכת חשבונאי', url: 'https://cheshbonai.co.il/about' },
  publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
  citation: sources.map((source) => source.url),
};
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question', name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function LocalityTaxCreditPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'מיסוי אישי', url: '/personal-tax' },
        { name: title, url: pageUrl },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c'),
      }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>
        {' / '}<Link href="/personal-tax" className="underline">מיסוי אישי</Link>
        {' / '}<span aria-current="page">{title}</span>
      </nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">
            מאת מערכת חשבונאי · תאריך בדיקת המקורות: <time dateTime={checkedAt}>24.10.2026</time>
          </p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-8">{quickAnswer}</p>
          <a href={sources[0].url} className="mt-3 inline-block text-gold underline" target="_blank" rel="noopener noreferrer">
            המקור הרשמי לבדיקה
          </a>
        </section>
        <aside aria-label="הבהרה חשובה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע בעמוד הוא הסבר כללי בלבד ואינו ייעוץ מס או ייעוץ משפטי. אין בו קביעה של זכאות אישית
          או הבטחה להחזר. לפני הגשה או החלטה בדקו את המקור הרשמי לשנת המס ולנסיבות שלכם,
          ובמקרה הצורך פנו לרואה חשבון, ליועץ מס או לעורך דין. הוראות הדין והחלטת הרשות הן הקובעות.
        </aside>
        <nav aria-label="תוכן העניינים" className="border border-ink/15 p-5">
          <h2 className="mb-3 text-lg font-bold">מה תמצאו במדריך?</h2>
          <ul className="list-inside list-disc space-y-2">
            {sections.map((section, index) => (
              <li key={section.heading}><a href={`#section-${index + 1}`} className="underline">{section.heading}</a></li>
            ))}
          </ul>
        </nav>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index + 1}`} className="space-y-4">
            <h2 id={`section-${index + 1}`} className="scroll-mt-24 text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            <p className="text-sm leading-7 text-ink/70">
              מקור: <a className="text-gold underline" href={sources[section.source].url} target="_blank" rel="noopener noreferrer">
                {sources[section.source].label}
              </a>
            </p>
          </section>
        ))}
        <section aria-labelledby="faq" className="space-y-5">
          <h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>
          {faqItems.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 text-lg font-bold">{item.question}</h3>
              <p className="leading-8">{item.answer}</p>
            </div>
          ))}
        </section>
        <section aria-labelledby="official-sources" className="border border-ink/15 p-6">
          <h2 id="official-sources" className="mb-3 text-2xl font-bold">מקורות רשמיים ותאריך בדיקה</h2>
          <p className="mb-4 leading-8">
            המקורות נבדקו ב־24.10.2026. המדריך מבוסס על דפי רשות המסים ו־gov.il.
            כאשר רשימה או טבלה מתעדכנת, יש לפתוח את המקור ולבחור את שנת המס המתאימה.
            אם המקור אינו נגיש, אין להסתמך על עותק לא מאומת לצורך קביעת זכאות.
          </p>
          <ul className="list-inside list-disc space-y-3 leading-7">
            {sources.map((source) => (
              <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="related-reading">
          <h2 id="related-reading" className="mb-4 text-2xl font-bold">כלים ומדריכים להמשך הבדיקה</h2>
          <p className="mb-4 leading-8">הכלים באתר מסייעים להבין את חישוב המס. יש להזין זכאות שאומתה במקור הרשמי, ולבדוק את תחומי הכיסוי של כל מחשבון לפני שימוש בתוצאה.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ['/personal-tax/tax-credits', 'מדריך נקודות זיכוי במס הכנסה'],
              ['/personal-tax/income-tax', 'מחשבון מס הכנסה'],
              ['/personal-tax/salary-net-gross', 'מחשבון שכר ברוטו ונטו'],
              ['/personal-tax/tax-refund', 'בדיקת אומדן החזר מס'],
              ['/personal-tax/tax-return-full', 'חישוב מס שנתי — תחומי הכיסוי'],
              ['/salaried/payslip-guide', 'מדריך לקריאת תלוש השכר'],
              ["/personal-tax/donations-tax-credit","זיכוי מס על תרומות: בדיקה ומימוש לפי סעיף 46"],
              ["/personal-tax/degree-tax-credit","זיכוי מס לתואר אקדמי: אישורים וטופס 119"],
              ["/personal-tax/new-immigrant-tax-benefits","הטבות מס לעולים חדשים: זיכוי, פטור ודיווח"],
            ].map(([href, label]) => (
              <li key={href}><Link className="text-gold underline" href={href}>{label}</Link></li>
            ))}
          </ul>
        </section>
        <p className="text-sm leading-7 text-ink/70">אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר מופיעים להלן ובדף האודות; אין בהצגתם אישור לבדיקה מקצועית פרטנית של נסיבות הקורא.</p>
        <AuthorBox />
      </article>
    </main>
  );
}

