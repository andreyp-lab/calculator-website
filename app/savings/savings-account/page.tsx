import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = "חשבון חיסכון: הגדרת מטרות, הפקדות ומעקב";
const description = "איך לארגן חיסכון שוטף: לברר מהו המוצר שמאחורי השם, להגדיר מטרות, לבדוק הפקדות ומשיכות ולתעד תנאים ומס, בלי להמליץ על מסלול.";
const pageUrl = 'https://cheshbonai.co.il/savings/savings-account';
const checkedAt = '2026-10-24';
const quickAnswer = "לפני פתיחת חשבון חיסכון, בררו מהו המוצר המדויק שמוצע לכם ומהם תנאיו. לצורך ניהול אישי, הגדירו מטרת חיסכון, כסף שכבר הוקצה לה והפקדות שתוכלו לבצע. לאחר מכן בדקו שהרישום תואם לתנועות בפועל. השם חיסכון לבדו אינו מספק תשובה לגבי הריבית, זמינות הכסף או המיסוי.";
const sources = [
  {
    "url": "https://www.boi.org.il/information/bank-paymnts/savingsandinvestmentproducts/pikadon/",
    "label": "בנק ישראל — מדריך פיקדון בנקאי"
  },
  {
    "url": "https://www.boi.org.il/information/bank-paymnts/financial-education/campaigns/boi-equator/",
    "label": "בנק ישראל — קו המשווה: פיקדונות, עו״ש ועמלות"
  },
  {
    "url": "https://www.gov.il/he/service/116b",
    "label": "רשות המסים — בקשה לניכוי מס הכנסה מוקטן מריבית, טופס 116ב׳"
  }
];
const sections = [
  {
    "heading": "מבררים מה מסתתר מאחורי שם החיסכון",
    "source": 0,
    "paragraphs": [
      "במדריך בנק ישראל פיקדון מוגדר כחיסכון לתקופה מוגדרת כנגד ריבית. כשמציעים לכם חשבון חיסכון, בקשו לזהות במסמכים את סוג המוצר ואת התנאים המסוימים. אל תסיקו משם שיווקי שקיימת אפשרות להפקדות נוספות, למשיכה חופשית או לתנאי ריבית מסוימים.",
      "הכינו כרטיס מוצר אישי עם שם הגוף, שם המסלול ותאריך קבלת המסמכים. לידו רשמו שאלות על אופן ההפקדה, מועדי המשיכה, חיובים נלווים והוראות סיום, לפי ההצעה שקיבלתם. מטרת הכרטיס היא לרכז את המידע לבירור. הוא אינו דירוג איכות, ואינו קובע שמוצר אחד עדיף על כל חלופה."
    ]
  },
  {
    "heading": "מגדירים מה הכסף אמור לממן",
    "source": null,
    "paragraphs": [
      "בחרו מטרה ברורה לחיסכון: הוצאה מתוכננת, רזרבה או צורך עתידי שעדיין אינו מוגדר במלואו. רשמו מי צפוי להשתמש בכסף ומתי עשוי להתעורר הצורך בו. אם החיסכון משרת מטרות שונות, הציגו אותן בנפרד ברישום, כדי שלא תייחסו לכל אחת מהן את מלוא היתרה.",
      "לכל מטרה ציינו אילו נתונים ידועים ואילו הם הנחות שלכם. אפשר להשאיר מועד פתוח כאשר טרם התקבלה החלטה, אך כדאי לסמן מה תצטרכו לברר כדי להתקדם. אין כאן אחוז הכנסה מחייב או סכום מינימום לתכנון. ההיקף שתבחרו נובע מהצרכים ומיכולת ההפרשה שתיעדתם בעצמכם."
    ]
  },
  {
    "heading": "מתכננים הפקדות לפי תזרים ההכנסה",
    "source": null,
    "paragraphs": [
      "עברו על מועדי ההכנסות והחיובים לפני שתבחרו סכום הפקדה. בדקו אם הכסף שאותו אתם מבקשים לחסוך אכן נותר פנוי לאחר התשלומים המתוכננים. כשההכנסה אינה קבועה, אפשר לבנות תוכנית גמישה ולציין מתי תחזרו לבדוק אותה. אין צורך להציג קצב אחיד אם הוא אינו מתאר את המציאות שלכם.",
      "אם אתם בוחנים הוראת העברה חוזרת, בררו תחילה אם המוצר מקבל את ההפקדות וכיצד משנים את ההוראה. רשמו את ההנחיה שבחרתם ואת מועד בדיקתה. במקרה שבו לא הצלחתם לבצע הפקדה כמתוכנן, עדכנו את הצפי ואת סדר העדיפויות. אל תתייחסו להוראה שנקבעה כאילו היא כבר יתרה שנצברה."
    ]
  },
  {
    "heading": "מכינים השוואה של שירותים ותנאים",
    "source": 1,
    "paragraphs": [
      "קו המשווה של בנק ישראל מרכז כלי השוואה לפיקדונות, לעובר ושב ולעמלות. בחרו את תחום הבדיקה שמתאים למוצר שאתם בוחנים. עצם הופעת מידע בכלי השוואה אינה מחליפה את קריאת ההסכם ואת השלמת הפרטים מול נותן השירות. שמרו את תאריך ההשוואה לצד פרטי ההצעות.",
      "ברשימת הבירור אפשר לשאול על עלות הפעולות שאתם מתכננים, אופן הצגת המידע וזמינות השירות שתצטרכו. הבחינו בין תנאי שנמסר במפורש לבין סעיף שעדיין לא נבדק. אם בוחנים חשבון נוסף, כללו בשאלות גם את דרך העברת הכסף אליו וממנו. התשובה תלויה במוצר ובהסכם שתקבלו."
    ]
  },
  {
    "heading": "משווים את הרישום לתנועות בפועל",
    "source": null,
    "paragraphs": [
      "במועד בדיקה שתבחרו, עברו על יתרת הפתיחה ועל התנועות מאז הבדיקה הקודמת. סמנו הפקדות, משיכות ורכיבים נוספים לפי תיאורם במסמכים. אם היתרה שונה מזו שציפיתם לראות, חפשו תחילה את התנועה שמסבירה את ההבדל. אל תייחסו כל שינוי אוטומטית לרווח או לריבית.",
      "בדקו גם שהיתרות שהקציתם למטרות השונות מתיישבות עם הכסף שאכן קיים. כאשר מעבירים כסף בין חשבונות, רשמו שמדובר בהעברה כדי שלא תיראה כהכנסה חדשה בתכנון המשפחתי. שמרו אסמכתה לתנועה שדורשת בירור ותעדו את התשובה שקיבלתם. כך תוכלו להמשיך את הבדיקה הבאה מאותה נקודה."
    ]
  },
  {
    "heading": "שומרים מסמכים לבדיקת ריבית ומס",
    "source": 2,
    "paragraphs": [
      "רשות המסים מפרסמת שירות לניכוי מוקטן מריבית על פיקדון או תוכנית חיסכון, באמצעות טופס 116ב׳ ובהתאם לתנאיו. אם אתם בוחנים את המסלול, קראו את ההנחיות העדכניות ובררו את התאמתו לשנת המס שלכם. השימוש בכינוי חשבון חיסכון אינו יוצר כשלעצמו זכאות להטבת מס.",
      "שמרו את מסמכי המוצר ואת פירוט הריבית והניכויים ככל שהם מופיעים ברישומים שנמסרו לכם. לפני שימוש בסכום צפוי לצורך תקציב, שאלו מה כלול בו ומה דורש בירור. אין בעמוד שיעור מס, תקרת זכאות או חישוב נטו. אפשר לקבל הבהרה מהרשות או להיעזר באיש מקצוע לפי הצורך."
    ]
  },
  {
    "heading": "מעדכנים את התוכנית כשמטרת הכסף משתנה",
    "source": null,
    "paragraphs": [
      "חיסכון שנפתח למטרה מסוימת יכול להיבחן מחדש כאשר אותה מטרה נדחית או משתנה. עדכנו תחילה את ייעוד הכסף ברשימה האישית, ואז בדקו אם תנאי המוצר תואמים לצורך החדש. אל תניחו ששינוי ברישום משנה את ההסכם. קבלו מידע על הפעולות הנדרשות לפני מתן הוראה.",
      "לאחר משיכה או שינוי בהפקדות, רשמו את היתרה ואת תוכנית ההמשך שבחרתם. אם החשבון משותף לתכנון של כמה אנשים, ודאו שכולם מבינים איזה סכום כבר מיועד להתחייבות. המעקב נועד לשמור על קשר ברור בין ההחלטות, המסמכים והתנועות, ולא להבטיח תשואה או תוצאה כספית עתידית."
    ]
  }
];
const faqItems = [
  {
    "question": "מה ההבדל בין חשבון חיסכון לפיקדון?",
    "answer": "בדקו את סוג המוצר במסמכים. בנק ישראל מתאר פיקדון כחיסכון לתקופה מוגדרת; שם כללי או שיווקי של חשבון אינו מספיק כדי לזהות את תנאיו."
  },
  {
    "question": "האם הוראת קבע מבטיחה שאגיע למטרה?",
    "answer": "לא. בתכנון האישי צריך לבדוק אילו הפקדות בוצעו בפועל, מה השתנה בעלות המטרה ואילו משיכות נעשו. עצם קיום ההוראה אינו הבטחה לצבירה."
  },
  {
    "question": "האם צריך חשבון לכל יעד?",
    "answer": "אפשר להפריד מטרות ברישום גם כשהכסף מוחזק יחד. אם שוקלים חשבונות נפרדים, יש לבדוק את תנאיהם ואת אופן הניהול שלהם לפני בחירה."
  }
];
const relatedLinks = [
  [
    "/savings",
    "חיסכון ומשפחה"
  ],
  [
    "/savings/bank-deposit",
    "קריאת הצעה לפיקדון"
  ],
  [
    "/savings/sinking-funds",
    "קופות להוצאות צפויות"
  ],
  [
    "/savings/emergency-fund",
    "תכנון קרן חירום"
  ],
  [
    "/savings/family-budget",
    "בניית תקציב משפחתי"
  ],
  [
    "/tools/budget",
    "כלי לניהול תקציב"
  ]
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

export default function SavingsAccountPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'חיסכון ומשפחה', url: '/savings' },
        { name: title, url: pageUrl },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify([articleSchema, faqSchema]).replace(/</g, '\\u003c'),
      }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>
        {' / '}<Link href="/savings" className="underline">חיסכון ומשפחה</Link>
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
        </section>
        <aside aria-label="הבהרה חשובה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע חינוכי בלבד ואינו ייעוץ השקעות, מס או משפט.
          שיטות התכנון מיועדות למילוי עצמי ואינן המלצת רשות או המלצה על מוצר.
          בדקו תנאים ומסמכים עדכניים, ובמידת הצורך פנו לבעל רישיון מתאים.
        </aside>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index + 1}`} className="space-y-4">
            <h2 id={`section-${index + 1}`} className="scroll-mt-24 text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            {section.source !== null ? (
              <p className="text-sm leading-7 text-ink/70">
                מקור לעובדות על המוצר או השירות: <a className="text-gold underline" href={sources[section.source].url} target="_blank" rel="noopener noreferrer">
                  {sources[section.source].label}
                </a>
              </p>
            ) : null}
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
            נבדק ב־24.10.2026. המקורות מאמתים את העובדות המסומנות במדריך.
            שיטות הארגון הן הצעות אישיות; אין להן יעד אוניברסלי.
            בדפי השוואה בדקו את תקופת הנתונים.
          </p>
          <ul className="list-inside list-disc space-y-3 leading-7">
            {sources.map((source) => (
              <li key={source.url}><a href={source.url} className="text-gold underline" target="_blank" rel="noopener noreferrer">{source.label}</a></li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="related-reading">
          <h2 id="related-reading" className="mb-4 text-2xl font-bold">מדריכים וכלים להמשך</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedLinks.map(([href, label]) => (
              <li key={href}><Link className="text-gold underline" href={href}>{label}</Link></li>
            ))}
          </ul>
        </section>
        <p className="text-sm leading-7 text-ink/70">
          אחריות התוכן: מערכת חשבונאי. פרטי בעל האתר להלן; אין בהצגתם אישור לבדיקה פרטנית של נסיבות הקורא.
        </p>
        <AuthorBox bio="רואה חשבון וסמנכ״ל כספים. פרטי בעל האתר ותחומי עיסוקו מופיעים בדף האודות." />
      </article>
    </main>
  );
}
