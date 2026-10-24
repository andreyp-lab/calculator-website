import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const title = 'הכנסות מחו״ל: הכנת נתונים לדוח ולנספח הכנסות חוץ';
const description = 'איך מתאימים אישורי הכנסות ומס מחו״ל לנספח 1324: הפרדת סוגי הכנסה, זיהוי מסמכים חסרים ובירור מס ששולם בחוץ לארץ. מדריך המבוסס על רשות המסים.';
const path = '/personal-tax/foreign-income';
const url = `https://cheshbonai.co.il${path}`;
const checkedAt = '2026-10-24';
const sources = [
  {
    label: 'רשות המסים — טופס 1324 לשנת המס 2025, הכנסות מחו״ל ומס ששולם עליהן, כולל ההערות וההצהרה',
    url: 'https://www.gov.il/BlobFolder/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_1324-2025.pdf',
  },
  {
    label: 'רשות המסים — שירות הדוח השנתי לשנת המס 2025: נספחי חו״ל ואישור הגשה',
    url: 'https://www.gov.il/he/service/reporting-and-payment-2025-annual-tax-report-for-individuals',
  },
];
const quickAnswer = 'כשמכינים דוח שנתי הכולל הכנסות חוץ, טופס 1324 מרכז את פירוט ההכנסות ואת המס ששולם עליהן בחו״ל, לצד הדיווח בטופס 1301. התחילו בהתאמת כל אישור לסוג ההכנסה ולשנת המס. רישום מס זר אינו אישור לזיכוי אישי. ההסבר כאן מתייחס לטופסי שנת המס 2025 שפורסמו ברשות המסים; לשנה אחרת פותחים את גרסתה הרשמית.';
const sections = [
  {
    heading: 'מטרת הבדיקה: לחבר בין ההכנסה לבין האישור',
    source: 0,
    paragraphs: [
      'טופס הכנסות החוץ מפריד בין מקורות כגון שכר, עסק, ריבית, דיבידנד ורווח הון, ומציג גם מדינה ומס ששולם בשל ההכנסה. לכן קובץ שמציג רק סכום כסף שנכנס לחשבון אינו נקודת פתיחה מספקת להכנת הפירוט. התייחסו אליו כאל מסמך עזר, וחפשו את האישור המתאר מה שולם ומדוע. המטרה היא להבין את הנתונים לפני שמחליטים באיזו שורה להשתמש.',
      'פתחו תיקייה לכל מקור הכנסה ותנו לכל מסמך שם ברור הכולל גוף מנפיק ותקופה. בדף עבודה נפרד רשמו את שם ההכנסה כפי שמופיע באישור, את התקופה שאליה היא מתייחסת ואת השאלות שנותרו פתוחות. זהו כלי הכנה מוצע, ולא רשימת מסמכים מחייבת או קביעה שהתקבול חייב במס בישראל. את שאלת החיוב יש להביא לבירור מקצועי לפי העובדות.',
    ],
  },
  {
    heading: 'הכנסה, ניכוי מס ותנועה בנקאית: קוראים כל שדה בנפרד',
    source: 0,
    paragraphs: [
      'בדקו מה כל כותרת באישור מייצגת: הכנסה, תמורה ממכירה, מס שנוכה, עמלה או יתרה. אל תכניסו אוטומטית את היתרה לחשבון לשדה הכנסה. אם אותו גוף הפיק דוח פעילות ואישור שנתי, השאירו את שניהם בתיקייה וציינו איזה מסמך שימש לכל נתון. כאשר הכותרות בשפה זרה אינן ברורות, בקשו פירוט מהגוף שהפיק את האישור לפני שמתרגמים אותן למונח מס ישראלי.',
      'סמנו גם פערים בין מסמכים בלי לתקן את המקור: שם שונה, תקופה חסרה או ריכוז שאינו תואם לפירוט. ליד כל פער רשמו ממי ביקשתם הבהרה והאם התקבלה תשובה. בדף העבודה אפשר להוסיף עמודת מטבע ועמודת מקור לנתון. אין כאן הוראת שער המרה; שאלת ההמרה תיבדק לפי הכללים שאליהם מפנה הטופס, ולא באמצעות העתקת שער אקראי ממסך הבנק.',
    ],
  },
  {
    heading: 'מס ששולם בחו״ל: מכינים ראיות לפני שמבקשים זיכוי',
    source: 0,
    paragraphs: [
      'הערות טופס 1324 לשנת 2025 מפנות לאישורים מצורפים ומחריגות מסים עירוניים מהמס הזר המדווח בעמודה הרלוונטית. ההצהרה כוללת גם התייחסות להחזר מס זר ולהודעה על שינוי או החזר במס שדווח. אלה סיבות לבדוק את טיב התשלום ולא להעתיק כל חיוב של רשות זרה תחת הכותרת מס הכנסה. אין להסיק מכאן שכל סכום אחר מזכה במלואו.',
      'רכזו אישור ניכוי, אישור תשלום ושומה זרה, ככל שקיימים אצלכם, וסמנו איזה מסמך מסביר את הקשר בין המס להכנסה המסוימת. אם הוגשה בקשת החזר במדינה האחרת, ציינו זאת לבעל המקצוע והוסיפו את ההתכתבות לתיק. שאלו איזה מידע עדיין חסר לבדיקת הזיכוי. הבירור צריך לעסוק גם במסמך וגם בהוראות החלות; תשלום בחו״ל לבדו אינו חישוב של היתרה בישראל.',
    ],
  },
  {
    heading: 'שאלות על תושבות ואמנה דורשות תיק עובדות משלהן',
    source: 1,
    paragraphs: [
      'שירות הדוח השנתי מפרסם לצד נספח הכנסות החוץ גם טופס הצהרת תושבות, שמספרו 1348. הופעתו ברשימת הטפסים אינה תשובה לשאלת המעמד שלכם. אם התושבות, מקום הפקת ההכנסה או תחולת אמנה אינם ברורים, הביאו אותם כשאלות מפורשות לבירור. העמוד אינו קובע מבחן תושבות, הוראת אמנה או פטור, ואינו מסווג הכנסה לפי מיקום חשבון בלבד.',
      'להכנת הפגישה אפשר לצרף תיאור עובדתי של תקופות מגורים ועבודה ושל הגופים המשלמים. הבדילו בין תאריך שמופיע במסמך לבין מסקנה משפטית שטרם נבדקה. בקשו שהמענה המקצועי יזהה את המקור הרשמי שעליו הוא נשען ואת שנת המס שאליה הוא מתייחס. כאשר יש גם מעמד עולה או תושב חוזר, הפנו את הבירור למדריך ההטבות הייעודי והציגו את אישורי המעמד הרלוונטיים.',
    ],
  },
  {
    heading: 'התאמה לדוח השנתי ומעקב אחרי ההגשה',
    source: 1,
    paragraphs: [
      'לאחר הבירור המקצועי, הכינו רשימת התאמה בין האישור, הנתון שאושר לדיווח והשורה שנבחרה בטופס. שמרו הסבר לשינויים שנעשו במהלך ההכנה, כדי שלא תישארו עם מספר סופי בלי דרך לשחזר אותו. בעבודה עם כמה משלמים, בדקו אם אותו מסמך יובא פעמיים. אין להשתמש בהסכמה בין סכומי הסיכום כהוכחה שכל הסיווגים או ההקלות נכונים.',
      'שירות רשות המסים לדוח השנתי מסביר שבהגשה המקוונת המלאה יש לוודא שההגשה הושלמה ולקבל אישור מקוון. שמרו את האישור יחד עם העתק הנתונים והמסמכים שהוגשו. אם מתגלה אישור מתוקן או מסמך חסר, פנו למייצג או לרשות לברר את אופן הטיפול. אל תשנו רק את קובץ העבודה ותניחו שגם הדיווח שכבר נשלח עודכן בהתאם.',
    ],
  },
];
const faqItems = [
  {
    question: 'האם המדריך קובע שעליי להגיש דוח בגלל הכנסה מחו״ל?',
    answer: 'לא. המדריך עוסק בהכנת נתונים לדוח הכולל הכנסות חוץ. את עצם חובת הדיווח ואת המסלול המתאים יש לברר מול רשות המסים או בעל מקצוע מורשה לפי המקרה, לפני בחירת טפסים.',
  },
  {
    question: 'האם רישום המס הזר בנספח מבטיח זיכוי?',
    answer: 'לא. טופס 1324 מרכז הכנסה ומס ששולם עליה בחו״ל, וכולל הערות והצהרות שיש לקרוא. הוא אינו אישור לזיכוי אישי. הציגו את אישורי המס ובקשו בדיקה נפרדת של הטיפול בו.',
  },
  {
    question: 'האם אפשר להשתמש בנספח של שנת מס אחרת?',
    answer: 'לצורך הבדיקה פתחו את גרסת הטפסים הרשמית של השנה הרלוונטית. הדוגמאות למבנה הטופס בעמוד מתייחסות לשנת המס 2025 בלבד; אל תעתיקו מהן שדות או הנחות לשנה אחרת בלי בדיקה.',
  },
];

export const metadata: Metadata = {
  title: { absolute: `${title} | חשבונאי` }, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'article', locale: 'he_IL', modifiedTime: checkedAt },
};

export default function ForeignIncomePage() {
  const structuredData = [
    {
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
      headline: title, description, url, mainEntityOfPage: url, inLanguage: 'he-IL',
      datePublished: checkedAt, dateModified: checkedAt,
      author: { '@type': 'Organization', name: 'מערכת חשבונאי', url: 'https://cheshbonai.co.il/about' },
      publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
      citation: sources.map((source) => source.url),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${url}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מיסוי אישי', url: '/personal-tax' }, { name: title, url: path }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
        <Link href="/" className="underline">דף הבית</Link>{' / '}
        <Link href="/personal-tax" className="underline">מיסוי אישי</Link>{' / '}<span aria-current="page">הכנסות מחו״ל</span>
      </nav>
      <article className="space-y-8">
        <header>
          <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-sm text-ink/70">מאת מערכת חשבונאי · נבדק ועודכן: <time dateTime={checkedAt}>24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="border border-gold/40 bg-paper p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-8">{quickAnswer}</p>
          <a href={sources[0].url} className="text-gold underline">לעיון בנספח הרשמי ובהערותיו</a>
        </section>
        <aside aria-label="הבהרה" className="border-r-4 border-gold bg-paper p-5 leading-8">
          המידע כללי בלבד ואינו ייעוץ מס, משפטי, פנסיוני או השקעות. אין בו קביעת תושבות, חבות או זכאות לזיכוי,
          ואין הבטחה לתוצאת מס. לפני דיווח או החלטה יש להיוועץ ברואה חשבון, ביועץ מס מורשה או בעורך דין בעל רישיון מתאים.
        </aside>
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`section-${index}`} className="space-y-4">
            <h2 id={`section-${index}`} className="text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
            <p className="text-sm text-ink/70">מקור רשמי: <a href={sources[section.source].url} className="text-gold underline">{section.source === 0 ? 'נספח הכנסות חוץ והערותיו' : 'שירות הדוח השנתי'}</a></p>
          </section>
        ))}
        <section aria-labelledby="faq" className="space-y-5">
          <h2 id="faq" className="text-2xl font-bold">שאלות נפוצות</h2>
          {faqItems.map((item) => <div key={item.question}><h3 className="mb-2 text-lg font-bold">{item.question}</h3><p className="leading-8">{item.answer}</p></div>)}
        </section>
        <section aria-labelledby="sources" className="border border-ink/15 p-6">
          <h2 id="sources" className="mb-3 text-2xl font-bold">מקורות רשמיים</h2>
          <p className="mb-4 leading-8">נבדקו ב־24.10.2026. טופסי הדיווח המקושרים הם לשנת המס 2025. הוראות הדין וההנחיות הרשמיות לשנה ולמקרה הן הקובעות.</p>
          <ul className="list-inside list-disc space-y-3">{sources.map((source) => <li key={source.url}><a href={source.url} className="text-gold underline">{source.label}</a></li>)}</ul>
        </section>
        <nav aria-label="להמשך הבדיקה" className="space-y-3 leading-8">
          <h2 className="text-2xl font-bold">להמשך הבדיקה</h2>
          <p>להכנת ההגשה עצמה ראו <Link href="/blog/annual-tax-report-1301" className="text-gold underline">מדריך הדוח השנתי</Link>. לבירור מעמד מיוחד ראו <Link href="/personal-tax/new-immigrant-tax-benefits" className="text-gold underline">הטבות מס לעולים</Link>. <Link href="/personal-tax/tax-return-full" className="text-gold underline">התחשיב השנתי באתר</Link> מוגבל למקורות ולשנים המפורטים בו ואינו פותר שאלות תושבות ואמנה.</p>
        </nav>
        <p className="text-sm leading-7 text-ink/70">אחריות עריכת התוכן: מערכת חשבונאי. פרטי בעל האתר וזהותו המקצועית מופיעים להלן; אין בכך אישור לבדיקה פרטנית של נסיבות הקורא.</p>
        <AuthorBox bio="אנדרי פלטונוב, רואה חשבון וסמנכ״ל כספים, בעל אתר חשבונאי. המידע בעמוד נערך בידי המערכת על בסיס המקורות הרשמיים המקושרים ואינו חוות דעת על נסיבות אישיות." />
      </article>
    </main>
  );
}
