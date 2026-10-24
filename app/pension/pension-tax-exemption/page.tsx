import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/pension-tax-exemption';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'פטור ממס על פנסיה ב־2026: קצבה מזכה וקיבוע זכויות';
const DESCRIPTION = 'הפטור המרבי על קצבה מזכה בשנת 2026, גיל הזכאות, מסמכי קיבוע זכויות והבחנה בין תקרה כללית לאישור אישי. מבוסס על מסמכי רשות המסים.';
const sources = [
  {
    title: 'רשות המסים — מדריך למילוי טופס 161ד לשנת 2026; מענקי פרישה, היוון ומגבלת שינוי הבחירה',
    url: 'https://www.gov.il/BlobFolder/guide/2026-filling-out-form-161d/he/Guides_IncomeTax_filling-out-form-161d-2026.pdf',
  },
  {
    title: 'רשות המסים — הנחיות למתן הפטור על הקצבה המזכה לשנת 2026, מיום 2.2.2026; שיעורים ואישורים למשלמים',
    url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/employers-info-020226-1/he/IncomeTax_employers-info-020226-1.pdf',
  },
  {
    title: 'רשות המסים — טופס 161ד; הגדרת קצבה מזכה וגיל זכאות, פרטי משלמים ומסמכי פרישה',
    url: 'https://www.gov.il/BlobFolder/service/itc-request-for-fixed-rights-at-retirement-age/ar/Service_Pages_Purchase_and_Excise_tax_161D-ACC.pdf',
  },
];
const faqs = [
  {
    question: 'האם שיעור הפטור חל על כל הפנסיה שלי?',
    answer: 'השיעור המרבי לשנת 2026 מתייחס לתקרת הקצבה המזכה. אין להסיק ממנו את הפטור האישי או את המס הסופי שלכם. להשוואה מול תלוש הקצבה השתמשו באישור המתאים לנתוניכם, ולא בשיעור המרבי לבדו.',
    source: 1,
  },
  {
    question: 'האם טופס 161 מהמעסיק הוא בקשת קיבוע זכויות?',
    answer: 'טופס 161 הוא מסמך פרישה הנלווה לבירור. הבקשה לקיבוע זכויות מוגשת בטופס 161ד. אספו את מסמכי הפרישה ואת תלושי הקצבה מכל משלם, ואל תסיקו מעצם קבלת מסמך מהמעסיק שהפטור האישי כבר נקבע.',
    source: 2,
  },
  {
    question: 'האם אפשר לשנות בכל עת בחירה בהיוון פטור?',
    answer: 'מדריך 2026 קובע מגבלת שינוי ביחס להיוון קצבה מזכה בפטור ממס לאחר 90 יום מקבלת הפטור על הקצבה לראשונה. יש לברר את המועד והבחירה האישיים עם איש מקצוע לפני חתימה; אין כאן הבטחה שניתן לתקן בחירה בדיעבד.',
    source: 0,
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
};

export default function PensionTaxExemptionPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION,
        mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24',
        author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' },
        publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
        citation: sources.map((source) => source.url),
      },
      {
        '@type': 'FAQPage', '@id': `${URL}#faq`,
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  };

  return (
    <article dir="rtl" className="bg-cream text-ink">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: 'פטור ממס על פנסיה', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: 'פטור ממס על פנסיה' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מה בודקים בין תקרת הפטור הכללית לבין האישור המיושם בתלוש הקצבה.</p>
          <p className="mt-4 text-sm text-ink/70">בדיקת מקורות ועדכון: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>

        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>לפי <a className="underline" href={sources[1].url}>הנחיות רשות המסים לשנת 2026, נספח ד׳</a>, שיעור הפטור המרבי על קצבה מזכה הוא 57.5% מתקרה חודשית של 9,430 ₪; הסכום המרבי המוצג הוא 5,422 ₪ לחודש. זהו סכום הכנסה הפטור ממס, ולא תשלום או החזר מס מובטח. הפטור האישי מחייב בדיקת נתונים ואישורים.</p>
        </section>

        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ מס, פנסיוני, משפטי או השקעות. אין המלצה על מוצר, ספק, משיכה או היוון ואין הבטחת חיסכון במס. לפני בחירה פנו ליועץ פנסיוני בעל רישיון ולרואה חשבון או ליועץ מס בעל רישיון, לפי תחום הבדיקה והנתונים האישיים.
        </aside>

        <div className="prose prose-lg max-w-none leading-relaxed">
          <h2>על איזו קצבה מדברים?</h2>
          <p><a href={`${sources[2].url}#page=1`}>טופס 161ד של רשות המסים</a> מגדיר קצבה מזכה לצורך הבקשה, ובה קצבה מקרן פנסיה, קופת גמל, חברת ביטוח או מעסיק לשעבר, וכן קצבת אובדן כושר עבודה; קצבת שאירים וקצבה מוכרת מוחרגות מהגדרה זו. הבקשה מיועדת למי שהגיע לגיל הזכאות לאחר 1.1.2012, בכפוף להוראות הטופס. אין להחיל את נתוני העמוד על כל תשלום שכותרתו פנסיה.</p>
          <p>התחילו מזיהוי התשלום בתלוש ובאישור המשלם. רשמו את שם הגוף, סוג הקצבה ותאריך המסמך, ושמרו את המקור לצד הריכוז האישי. אם סוג ההכנסה אינו ברור, הציגו את המסמך לבעל המקצוע לפני ניסיון לחשב פטור. כך אפשר לברר את השאלה המדויקת בלי להסתמך על הכינוי שבו משתמשים בשיחה עם המעסיק או עם הגוף המשלם.</p>

          <h2>גיל הזכאות לצורכי מס</h2>
          <p>לפי <a href={`${sources[0].url}#page=2`}>הגדרת גיל הזכאות במדריך רשות המסים ל־2026</a>, בודקים את המאוחר מבין מועד ההגעה לגיל הפרישה ומועד קבלת קצבה מזכה לראשונה. לעניין זה גיל פרישה עשוי לכלול גם פרישה מוקדמת מחמת נכות יציבה בדרגה של 75% או יותר, שנקבעה לפי סעיף 9(5)(א) לפקודה או לפי התקנות מכוח סעיף 9(5)(ב); עצם קבלת קצבת נכות או הפסקת עבודה אינה מספיקה בלי הקביעה המתאימה. לבירור גיל הפרישה הרגיל קראו את <Link href="/pension/retirement-age">מדריך גיל הפרישה</Link>. כאן התמקדו בתיעוד תאריך הלידה, מועד תחילת הקצבה, אישור המשלם והחלטת הנכות, אם רלוונטית. כאשר קיימים מסמכים עם מועדים שונים, בקשו הסבר לפער לפני מילוי הבקשה.</p>

          <h2>התקרה הכללית לעומת הפטור האישי</h2>
          <p><a href={`${sources[1].url}#page=8`}>נתוני רשות המסים לשנת המס 2026</a> מוצגים להלן. השיעור מתייחס לתקרת הקצבה המזכה; אין להכפיל בו אוטומטית את מלוא הקצבה האישית. הטבלה מציגה את המסגרת המרבית, ואינה מחשבון מס או אישור זכאות.</p>
          <div className="overflow-x-auto">
            <table>
              <caption>נתוני הפטור המרבי לשנת 2026 — רשות המסים, נספח ד׳</caption>
              <thead><tr><th scope="col">נתון</th><th scope="col">ערך רשמי</th></tr></thead>
              <tbody>
                <tr><th scope="row">תקרת הקצבה המזכה לחודש</th><td>9,430 ₪</td></tr>
                <tr><th scope="row">שיעור הפטור המרבי מהתקרה</th><td>57.5%</td></tr>
                <tr><th scope="row">סכום הפטור המרבי לחודש, כפי שמוצג בהנחיות</th><td>5,422 ₪</td></tr>
              </tbody>
            </table>
          </div>

          <h2>מענקי עבר והיוון: מה להביא לבדיקה?</h2>
          <p><a href={`${sources[0].url}#page=6`}>מדריך קיבוע הזכויות לשנת 2026</a> מסביר שמענקי פרישה פטורים שנכללים בחישוב עשויים להפחית את הפטור על הקצבה. קיימים בו גם חריגים, ולכן אין להניח שכל מענק משפיע באותה דרך. אספו אישורי מענקים ובחירות קודמות. לבירור סיום עבודה וטופס המעסיק הפנו ל<Link href="/employee-rights/severance">מדריך פיצויי הפיטורים</Link>; עמוד זה עוסק בפטור הקצבה.</p>
          <p>ב<a href={`${sources[0].url}#page=10`}>פרק ההיוון במדריך</a> מוסבר גם שהיוון בפטור משתמש בסל הפטור ועשוי להפחית את הפטור החודשי. בפרק ההצהרות נקבע שלאחר 90 יום מקבלת הפטור על הקצבה לראשונה לא ניתן לשנות את ההחלטה ביחס להיוון קצבה מזכה בפטור ממס. בקשו הסבר אישי לפני חתימה; אין להסיק מכאן שכל שינוי אחר בבקשה כפוף לאותו כלל.</p>

          <h2>מארגנים את המסמכים לפני הגשה</h2>
          <p><a href={`${sources[2].url}#page=2`}>טופס 161ד</a> מבקש פרטי משלמי קצבה ותלוש אחרון מכל משלם, ומפנה לצירוף טופסי 161 ביחס לתקופות העבודה. הוא כולל גם בירור עבודה לאחר גיל הזכאות, מענקים והיוון. <a href={`${sources[1].url}#page=7`}>הנחיות 2026</a> מונות בנוסף פרטי הכנסות נוספות ומסמכים שיידרשו לפי העניין. זוהי נקודת מוצא לאיסוף, ולא קביעה שהתיק האישי שלכם שלם.</p>
          <p>הכינו רשימה עם שם המסמך, הגוף שהפיק אותו, התקופה המתוארת והשאלה שטרם נפתרה. אם מסמך חסר, סמנו אותו כחסר ובקשו העתק מהגורם המתאים; אל תמלאו סכום משוער כאילו התקבל אישור. בפגישה עברו על המקורות עצמם, ולא רק על טבלה שסיכמתם. הפרידו ברישום בין נתון שאושר לבין תשובה שעדיין ממתינה לבירור.</p>
          <p>לצד כל שאלה רשמו גם איזה מסמך יאפשר להשיב עליה: אישור מהמשלם, מסמך מהמעסיק הקודם או החלטת רשות המסים. בקשו שבסיום הפגישה יהיה ברור מה נבדק, מה חסר ומי מטפל בהשלמה. כשמקבלים תשובה, שמרו אותה עם השאלה המקורית כדי שאפשר יהיה לעקוב אחר הבירור גם בפגישה הבאה.</p>

          <h2>כבר יש אישור? בודקים את היישום</h2>
          <p><a href={`${sources[1].url}#page=2`}>ההנחיות למשלמי הקצבאות ל־2026</a> מבחינות בין מצבים של מידע מרשות המסים, תיאום מס ואישור קיבוע קיים. הן מפרטות גם מסלולים לבדיקת הפטור הנוסף בלבד. קבלת פטור נוסף אינה כשלעצמה הוכחה שנבחן מלוא הפטור. בקשו מהמשלם לזהות איזה אישור מיושם ולאיזו שנת מס, והציגו פער לבעל המקצוע.</p>
          <p>לצורך <Link href="/investments/retirement">תכנון הכנסות בפרישה</Link>, שמרו בנפרד את הקצבה ברוטו, נתון הפטור והניכוי בפועל. ציינו מאיזה תלוש נלקח כל נתון. אם התקבל אישור חדש, השוו את פרטיו למסמך הקודם ושאלו מה עוד דרוש ליישום. אפשר לחזור ל<Link href="/insurance/pension">מדריך הפנסיה</Link> לבדיקת הדוח; החלטת המס עצמה דורשת בחינה מקצועית של המקרה.</p>
        </div>

        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => (
            <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4">
              <summary className="cursor-pointer font-bold">{faq.question}</summary>
              <p className="mt-3 leading-relaxed">{faq.answer}</p>
              <a className="mt-2 inline-block text-sm underline" href={sources[faq.source].url}>מקור: רשות המסים</a>
            </details>
          ))}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים ותאריך הבדיקה</h2>
          <ul className="list-disc space-y-3 pr-6">
            {sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}
          </ul>
          <p className="mt-4 text-sm">המקורות נבדקו ביום 24.10.2026. השיעורים והסכומים בעמוד מתייחסים לשנת המס 2026. ההסבר אינו מחליף את הוראות הדין או אישור רשות המסים למקרה האישי.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך נערך על בסיס מסמכי רשות המסים ואינו אישור מס אישי או חוות דעת פנסיונית. יש לבחון את בחירות הפרישה עם בעל רישיון מתאים." />
      </div>
    </article>
  );
}
