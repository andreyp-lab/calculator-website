import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PAGE_PATH = '/self-employed/close-business';
const PAGE_URL = `https://cheshbonai.co.il${PAGE_PATH}`;
const CHECKED_AT = '2026-10-24';
const TITLE = 'סגירת עסק עצמאי: מס הכנסה, מע״מ וביטוח לאומי';
const DESCRIPTION =
  'מדריך לסגירת עסק עצמאי: בקשות נפרדות לרשויות, טופסי הסגירה, ציוד ומלאי שנותרו ומעקב אחר אישורים, על בסיס מקורות רשמיים.';

const sources = {
  incomeTax: {
    label: 'רשות המסים — סגירת תיק יחיד במס הכנסה או תיק ניכויים, טופס 2550',
    url: 'https://www.gov.il/he/service/itc2550',
  },
  vat: {
    label: 'רשות המסים — בקשה לסגירת עסק במע״מ, טופס 18',
    url: 'https://www.gov.il/he/service/vat-18',
  },
  nationalInsurance: {
    label: 'ביטוח לאומי — סגירת תיק עצמאי',
    url: 'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/close.aspx',
  },
  insuranceForm: {
    label: 'ביטוח לאומי — דין וחשבון רב שנתי, טופס 6101',
    url: 'https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/forms/insurance_forms/Pages/6101%20-%20%20%D7%93%D7%99%D7%9F%20%D7%95%D7%97%D7%A9%D7%91%D7%95%D7%9F%20%D7%A8%D7%91%20%D7%A9%D7%A0%D7%AA%D7%99.aspx',
  },
  vatRegistrationRules: {
    label: 'תקנות מס ערך מוסף (רישום), התשל״ו–1976 — תקנה 8',
    url: 'https://www.btl.gov.il/Laws1/02_0022_100001.pdf',
  },
  incomeTaxInstruction: {
    label: 'רשות המסים — הוראת ביצוע 8/2019 בנושא סגירת תיקים במס הכנסה',
    url: 'https://www.gov.il/BlobFolder/policy/8-2019-income-tax-inst-/he/Policy_IncomeTaxInst_hor-8-2019-acc.pdf',
  },
  taxAuthorityGuide: {
    label: 'רשות המסים — מדריך דע זכויותיך וחובותיך 2025',
    url: 'https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf',
  },
  employerClosure: {
    label: 'ביטוח לאומי — הודעה על הפסקת העסקת עובדים, טופס 699',
    url: 'https://www.btl.gov.il/English%20Homepage/About/Forms%20Authorization/formsonline/Pages/Fill699.aspx',
  },
  recordRetention: {
    label: 'רשות המסים — חוזר מקצועי 2/2012 המצטט את תקופת השמירה בסעיף 25',
    url: 'https://www.gov.il/BlobFolder/policy/income-tax-professional-inst-02-2012/he/Policy_IncomeTaxInst_hoz02-2012.pdf',
  },
};

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | חשבונאי` },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  authors: [{ name: 'אנדרי פלטונוב' }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    locale: 'he_IL',
    publishedTime: CHECKED_AT,
    modifiedTime: CHECKED_AT,
  },
};

const faqItems = [
  {
    question: 'האם סגירת התיק ברשות המסים סוגרת גם את ביטוח לאומי?',
    answer:
      'לא. הביטוח הלאומי מבהיר שסגירת תיק העצמאי אצלו נפרדת מסגירת התיקים ברשות המסים ואינה תלויה בה. יש לפנות אליו בהליך הסגירה שלו ולעקוב אחר הטיפול בנפרד.',
    source: sources.nationalInsurance,
  },
  {
    question: 'האם עוסק פטור יכול לבקש סגירת תיק מע״מ בלי טופס 18?',
    answer:
      'כן. לפי שירות רשות המסים, עוסק פטור יכול לסמן בקשת סגירה בטופס הצהרת עוסק פטור, ללא הגשת טופס 18. השירות מציין גם אפשרות לבקשה מקוונת להצהרה ולסגירה עבור עוסק פטור או מייצג.',
    source: sources.vat,
  },
  {
    question: 'האם אפשר להניח שתאריך סגירה בדיעבד יאושר בביטוח לאומי?',
    answer:
      'לא. הביטוח הלאומי מזהיר שבקשת סגירה המוגשת באיחור עשויה להידחות, ואז התיק ייסגר סמוך למועד הגשת הבקשה. אין להסתמך על אישור אוטומטי של התאריך המבוקש.',
    source: sources.nationalInsurance,
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${PAGE_URL}#article`,
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  inLanguage: 'he-IL',
  datePublished: CHECKED_AT,
  dateModified: CHECKED_AT,
  author: { '@type': 'Person', name: 'אנדרי פלטונוב' },
  publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
  citation: Object.values(sources).map((source) => source.url),
};

export default function CloseBusinessPage() {
  return (
    <>
      <CalculatorLayout
        title={TITLE}
        description={DESCRIPTION}
        pageUrl={PAGE_PATH}
        lastUpdated={CHECKED_AT}
        breadcrumbs={[
          { label: 'דף הבית', href: '/' },
          { label: 'עצמאים', href: '/self-employed' },
          { label: 'סגירת עסק עצמאי' },
        ]}
        disclaimerText="המידע כללי ואינו ייעוץ מס, משפטי או אישי. המדריך אינו קובע חבות, פטור או זכאות להחזר, ואינו מבטיח חיסכון. החלטות לגבי נכסים, דיווחים וסיום העסקה יש לבדוק לפי נסיבות העסק עם בעל מקצוע מתאים."
        quickAnswer={
          <p>
            סגירת עסק עצמאי מצריכה מעקב אחר הטיפול במס הכנסה, במע״מ ובביטוח לאומי.
            סגירת תיק העצמאי בביטוח לאומי נפרדת מסגירת התיקים ברשות המסים ואינה תלויה בה,
            כפי שמבהיר{' '}
            <a href={sources.nationalInsurance.url}>דף הסגירה הרשמי של הביטוח הלאומי</a>.
            התחילו בריכוז תאריך הפסקת הפעילות ומסמכי העסק, עברו לשירות המתאים לכל תיק,
            ושמרו את הבקשות ואת התשובות בתיקיית מעקב. הבחינו בין בקשה שנשלחה לבין הודעת
            הרשות על הטיפול בה. המדריך עוסק בסגירת עסק של יחיד; לשאלות על חברה או על
            מצב אישי מורכב פנו לבעל מקצוע מתאים.
          </p>
        }
        content={
          <div className="guide-copy">
            <h2>מכינים תמונת מצב לפני מילוי הבקשות</h2>
            <p>
              כהכנה ארגונית, פתחו רשימה של התיקים המתנהלים על שמכם ושל הפניות שתרצו
              לשלוח. ציינו ליד כל תיק את הרשות, מספר התיק, איש הקשר ומה עדיין חסר.
              רכזו בנפרד שאלות על כספים שטרם התקבלו, תשלומים לספקים, ציוד שנשאר והתחייבויות
              פתוחות. זו רשימת עבודה מומלצת, ולא רשימת מסמכים מחייבת מטעם הרשויות.
              את דרישות הבקשה עצמה בדקו בשירות הרשמי לפני השליחה.
            </p>
            <p>
              אם אתם נעזרים במייצג, הגדירו מי שולח כל פנייה ומי עוקב אחר התשובה.
              כדאי לרכז את ההסברים על הפסקת הפעילות במסמך עבודה משותף, כדי שאפשר יהיה
              להבין בהמשך מה דווח ומה טרם הובהר. אל תסמנו משימה כהושלמה רק משום
              שהמסמך הועבר למי שמטפל בו; בקשו עותק של הפנייה שנשלחה ושל התשובה שהתקבלה.
            </p>

            <h2>מס הכנסה ותיק ניכויים: בקשה בטופס 2550</h2>
            <p>
              <a href={sources.incomeTax.url}>שירות סגירת תיק יחיד במס הכנסה או תיק ניכויים</a>{' '}
              מיועד ליחידים בעלי תיק פעיל או תיק ניכויים ברשות המסים. לפי דף השירות,
              ממלאים טופס 2550, דרישת פרטים בדבר הפסקת פעילות עסק, משלח יד או ניכויים.
              שלחו את הבקשה בסמוך להפסקת הפעילות ואל תניחו שמועד הסגירה המבוקש יאושר
              רק משום שהוא נרשם בטופס.
              אפשר להעבירו למשרד השומה שבו מתנהל התיק בדואר אלקטרוני או בפקס, באמצעות
              מרכז מידע שירות ומשאבים, או דרך מערכת הפניות המקוונת בנושא סגירת תיק במס הכנסה.
              אפשר גם להגיע למשרד השומה, בכפוף להזמנת תור מראש לפי הוראות השירות.
            </p>
            <p>
              רשות המסים מציינת שלאחר סיווג התיק לסגירה בידי המשרד תישלח הודעה בדואר.
              סיווג התיק כבלתי פעיל אינו בהכרח סוף כל חובות הדיווח: לפי{' '}
              <a href={sources.incomeTaxInstruction.url}>הוראת ביצוע 8/2019</a>,
              יש לקבוע גם את שנת הדוח השנתי האחרונה. בדקו אילו דוחות עדיין נדרשים,
              אילו חובות או יתרות נותרו ומהו מועד הסגירה הסופי שאושר.
              לצורך המעקב שלכם, שמרו את העותק החתום ואת פרטי השליחה, וסמנו איזה תיק
              צוין בבקשה. אם יש גם תיק ניכויים, העלו במפורש את שאלת הטיפול בו מול
              המשרד או המייצג. כך תוכלו לחזור לפנייה המסוימת כאשר תתקבל תשובה או תתבקש הבהרה.
            </p>

            <h2>מע״מ: תאריך הפסקה, ציוד ומלאי</h2>
            <p>
              לפי{' '}
              <a href={sources.vat.url}>שירות הבקשה לסגירת עסק במע״מ</a>,
              עוסק מורשה או פטור שהפסיק פעילות, וכן מייצג, יכולים להגיש בקשה.
              תקנה 8 ל<a href={sources.vatRegistrationRules.url}>תקנות מס ערך מוסף (רישום)</a>{' '}
              קובעת הודעה בתוך 15 ימים מהפסקת הפעילות. גם עוסק פטור המשתמש במסלול
              ההצהרה והסגירה אינו צריך להניח שאפשר להמתין עד עונת ההצהרה השנתית.
              במסלול טופס 18 ממלאים את ההודעה, מצרפים את המסמכים הנדרשים ושולחים למשרד
              האזורי שבו העוסק רשום. בבקשה מציינים את התאריך המדויק של הפסקת הפעילות
              ומפרטים את הציוד, הנכסים והמלאי שטרם נמכרו ונשארו ברשות העוסק.
            </p>
            <p>
              לעוסק פטור קיימות גם חלופות המפורטות בשאלות הנפוצות להלן. המשרד האזורי
              מטפל בבקשה ושולח אישור סגירה; ייתכן שיבקש מסמכים נוספים. כהכנה, סדרו
              את רשימת הפריטים שנותרו ושמרו לידם את המסמכים שברשותכם. את השאלה כיצד
              לטפל בכל נכס לצורכי מס העבירו לבדיקה מקצועית, במקום לנסות להסיק אותה
              מעצם הגשת בקשת הסגירה.
            </p>
            <p>
              לפי <a href={sources.taxAuthorityGuide.url}>מדריך רשות המסים</a>,
              יש להשלים גם את הדוח התקופתי האחרון, כאשר קיימת חובת דיווח תקופתי,
              ולהסדיר חובות מע״מ שנותרו. עוסק פטור אינו מגיש דוחות תקופתיים רגילים,
              ולכן יש להבחין בין המסלולים ולא להעתיק דרישה ממעמד אחד לאחר.
            </p>

            <h2>ביטוח לאומי: פנייה עצמאית עם סיום העבודה</h2>
            <p>
              <a href={sources.nationalInsurance.url}>הביטוח הלאומי מורה להודיע מיד עם סיום העבודה כעצמאי</a>{' '}
              ולסגור את תיק העצמאי. דף השירות מפנה למילוי דין וחשבון רב שנתי באופן
              מקוון או ידני. מספרו של הטופס הוא 6101, כפי שמופיע{' '}
              <a href={sources.insuranceForm.url}>בדף הטופס הרשמי</a>.
              את האזהרה לגבי בקשה מאוחרת ראו בשאלות הנפוצות. לצורך המעקב האישי,
              שמרו עותק של הדיווח והוסיפו את הפנייה לרשימת המשימות בנפרד מהפניות למס הכנסה ולמע״מ.
            </p>
            <p>
              אם העסק העסיק עובדים, בדקו בנפרד גם את תיק המעסיק בביטוח לאומי.
              הביטוח הלאומי מפרסם <a href={sources.employerClosure.url}>טופס 699 להודעה על הפסקת העסקת עובדים</a>.
              הטופס הזה אינו מחליף את סגירת מעמדכם כעצמאים בטופס 6101.
            </p>

            <h2>רשימת מעקב מומלצת עד לקבלת התשובות</h2>
            <p>
              השתמשו ברשימה הבאה לניהול התהליך. היא נועדה לסייע בארגון ואינה קובעת
              את חובות הדיווח, המסמכים או זמני הטיפול של רשות כלשהי:
            </p>
            <ul>
              <li>ליד כל פנייה רשמו מתי נשלחה, באיזה ערוץ, עבור איזה תיק ומי מטפל בה.</li>
              <li>שמרו את הקובץ שנשלח ואת רשימת הנספחים יחד, כדי לשחזר בקלות את תוכן הבקשה.</li>
              <li>הפרידו בתיקייה בין בקשות, דרישות להשלמה ותשובות, ותנו לקבצים שמות שקל לזהות.</li>
              <li>רכזו שאלות פתוחות על דיווחים, חיובים ותקבולים להמשך בירור עם הרשות או המייצג.</li>
              <li>כאשר מתקבלת הודעה, קראו מה נאמר בה ועדכנו את הרשימה בהתאם לתוכן ההודעה.</li>
            </ul>
            <h2>לא משמידים את ספרי העסק עם הסגירה</h2>
            <p>
              סגירת התיקים אינה מבטלת את חובת שמירת מערכת החשבונות. לפי{' '}
              <a href={sources.recordRetention.url}>חוזר מקצועי של רשות המסים המצטט את סעיף 25</a>,
              יש לשמור את מערכת החשבונות במשך שבע שנים מתום שנת המס שאליה היא מתייחסת,
              או במשך שש שנים מיום הגשת הדוח לאותה שנה — לפי המאוחר. לכן אין לחשב את
              התקופה כ״שבע שנים ממועד סגירת העסק״ בלי לבדוק את שנת המס ומועד הגשת הדוח.
            </p>
            <p>
              להמשך הכנת הנתונים אפשר להיעזר ב־<Link href="/self-employed/business-finance">ניהול כספי העסק</Link>,
              ב־<Link href="/self-employed/tax-advances">מדריך מקדמות המס</Link>{' '}
              וב־<Link href="/self-employed/year-end-tax-simulator">בדיקת סוף שנת המס</Link>.
              כלים אלה מסייעים לארגון המידע; את אופן הטיפול בנתוני העסק המסוים יש לברר בנפרד.
            </p>
          </div>
        }
        faq={
          <>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <details key={item.question} className="border border-ink/15 bg-paper p-5">
                  <summary className="cursor-pointer font-bold text-ink">{item.question}</summary>
                  <p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p>
                  <a className="mt-2 inline-block text-gold underline" href={item.source.url}>
                    מקור: {item.source.label}
                  </a>
                </details>
              ))}
            </div>
            <FAQSchema items={faqItems} />
          </>
        }
        sources={
          <>
            <p className="mb-4 text-sm text-ink/70">
              מקורות ראשוניים ששימשו להכנת המדריך; נבדקו בתאריך{' '}
              <time dateTime={CHECKED_AT}>{CHECKED_AT}</time>.
            </p>
            <ul className="list-disc space-y-3 pr-5">
              {Object.values(sources).map((source) => (
                <li key={source.url}>
                  <a href={source.url} className="text-gold underline">{source.label}</a>
                </li>
              ))}
            </ul>
          </>
        }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
