import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PATH = '/real-estate/first-home-budget';
const SITE = 'https://cheshbonai.co.il';
const UPDATED = '2026-10-30';
const TITLE = 'תקציב לדירה ראשונה: מההון הזמין ועד הכניסה לבית';
const DESCRIPTION = 'איך מכינים תקציב לקניית דירה ראשונה: טבלת תשלומים, הוצאות נלוות, מועדי זמינות הכסף ותקציב לאחר המעבר, על בסיס מסמכים אישיים ומקורות בנק ישראל.';
const sources = [
  { label: 'בנק ישראל — הוצאות נלוות לרכישת דירה, דוח היציבות למחצית השנייה של 2021, עמ׳ 40', href: 'https://boi.org.il/media/3iabfmpd/fsr202102h.pdf#page=40' },
  { label: 'בנק ישראל — האישור העקרוני, שמאות ומדדי ההחזר הצפוי', href: 'https://www.boi.org.il/information/bank-paymnts/financial-education/competition-in-mortgages/' },
];
const faq = [
  { question: 'כמה כסף צריך מעבר למחיר הדירה?', answer: 'אין כאן תוספת אחידה באחוזים. אוספים הצעות לשירותים ולהוצאות המעבר, מבררים מס לפי העסקה, ומתעדים גם סכומים שעדיין חסרים. ההוצאות המופיעות במקור של בנק ישראל הן דוגמאות לסעיפים אפשריים, ולא מחירון או חיוב בכל עסקה.' },
  { question: 'האם כסף בחיסכון נחשב זמין לתשלום הקרוב?', answer: 'לצורך טבלת התכנון, רשמו מתי הכסף יהיה נגיש בפועל ומה דורש בירור לפני משיכתו. אל תשייכו יתרה לתשלום בחוזה לפני שבדקתם את מועד הזמינות ואת הסכום שיהיה בידיכם לאחר הפעולה.' },
  { question: 'מה עושים אם התקציב מסתדר בסך הכול אבל חסר כסף באמצע?', answer: 'מסמנים את התשלום ואת מועד המחסור ומציגים אותם לבנק ולעורך הדין לפני התחייבות. שינוי לוח תשלומים או מקור מימון דורש בדיקה נפרדת; אין להניח שהלוואה נוספת תאושר או תתאים לתקציב.' },
];

export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', locale: 'he_IL', url: PATH, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/opengraph-image'] },
};

export default function FirstHomeBudgetPage() {
  const article = {
    '@context': 'https://schema.org', '@type': 'Article', headline: TITLE,
    description: DESCRIPTION, inLanguage: 'he-IL', datePublished: UPDATED, dateModified: UPDATED,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${PATH}` },
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: `${SITE}/about` },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE },
    image: `${SITE}/opengraph-image`, citation: sources.map((source) => source.href),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, '\\u003c') }} />
    <FAQSchema items={faq} />
    <CalculatorLayout
      title={TITLE} description={DESCRIPTION} pageUrl={PATH} lastUpdated={UPDATED}
      breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'נדל״ן ומשכנתאות', href: '/real-estate' }, { label: 'תקציב לדירה ראשונה' }]}
      disclaimerText="מידע כללי לתכנון תקציב, שאינו ייעוץ מס, משפטי או משכנתאות. סכומי המס, תנאי המימון והתחייבויות העסקה מחייבים בדיקה אישית עם בעלי המקצוע המתאימים לפני חתימה."
      quickAnswer={<p>תקציב לדירה ראשונה צריך להראות כמה כסף זמין בכל שלב: לתשלומי הרכישה, להוצאות הנלוות ולמחיה אחרי המעבר. התחילו מלוח תשלומים וממקורות כסף מתועדים, וסמנו מה עדיין לא ידוע. סכום משכנתא מבוקש או חיסכון שטרם שוחרר אינם יתרה שכבר זמינה בחשבון. התוצאה הרצויה היא טבלת החלטה שאפשר לבדוק לפני התחייבות, עם סכום, תאריך ומקור לכל שורה.</p>}
      content={<>
        <nav aria-label="תוכן עניינים"><ul>
          <li><a href="#available-money">הכסף הזמין</a></li>
          <li><a href="#payment-plan">טבלת תשלומים</a></li>
          <li><a href="#timing-example">דוגמה לפער במועדים</a></li>
          <li><a href="#after-moving">התקציב אחרי המעבר</a></li>
        </ul></nav>
        <h2 id="available-money">מתחילים מהכסף וממועד הזמינות שלו</h2>
        <p>רשמו לכל מקור מימון את היתרה, המסמך שמאשר אותה והתאריך שבו אפשר להשתמש בכסף. הפרידו בין כסף בחשבון, חיסכון שדורש פעולה, סיוע משפחתי שטרם הועבר ומימון בנקאי שנמצא בבדיקה. ליד מקור שעדיין אינו סגור כתבו איזו תשובה חסרה וממי צריך לקבל אותה.</p>
        <p>החליטו גם איזה סכום תרצו להשאיר למחיה ולהוצאות בלתי צפויות לפי הנסיבות שלכם. סמנו אותו כיתרה ששומרים בצד, כדי שלא ייספר גם כתשלום למוכר. לבירור מגבלות המימון עברו ל<Link href="/real-estate/mortgage/guide/financing-percentage">מדריך אחוז המימון</Link>; כאן מתכננים את השימוש בכסף לאורך העסקה.</p>

        <h2 id="payment-plan">טבלת תשלומים עד קבלת המפתח</h2>
        <p><a href={sources[0].href}>בנק ישראל מונה בדוח היציבות</a> הוצאות נלוות כגון שירותי עורך דין, מס רכישה, תיווך, ייעוץ משכנתאות, שיפוץ, מעבר וריהוט. השתמשו ברשימה כדי לאתר סעיפים רלוונטיים. הפרסום היסטורי ומשמש כאן לזיהוי סוגי הוצאה בלבד; הוא אינו מקור למחירים או לכללי מס עדכניים.</p>
        <div className="overflow-x-auto">
          <table>
            <caption>תבנית אישית למילוי מתוך מסמכים והצעות</caption>
            <thead><tr><th scope="col">סעיף</th><th scope="col">מה בודקים</th><th scope="col">מקור ומועד</th></tr></thead>
            <tbody>
              <tr><th scope="row">תשלום למוכר</th><td>הסכום בכל שלב, ללא ספירה כפולה</td><td>טיוטת ההסכם ולוח התשלומים</td></tr>
              <tr><th scope="row">שירותים מקצועיים</th><td>מה כלול ומה מחויב בנפרד</td><td>הצעת השירות ומועד התשלום</td></tr>
              <tr><th scope="row">בירור מס רכישה</th><td>סכום שנבדק לפי פרטי העסקה</td><td>מסמך הבדיקה והנחותיו</td></tr>
              <tr><th scope="row">שיפוץ, מעבר וריהוט</th><td>מה נדרש לכניסה ומה אפשר לדחות</td><td>הצעות ספקים ותנאי התשלום</td></tr>
              <tr><th scope="row">יתרה ששומרים בצד</th><td>כסף שאינו מוקצה לרכישה</td><td>התקציב האישי לאחר המעבר</td></tr>
            </tbody>
          </table>
        </div>
        <p>הוסיפו לכל שורה סטטוס: אומדן, הצעה, התחייבות או שולם. סכום חסר נשאר מסומן לבירור. ב<Link href="/real-estate/purchase-tax">מחשבון מס הרכישה</Link> אפשר להתחיל בבדיקת המס; שמרו את ההנחות ואל תסיקו זכאות מהביטוי היומיומי ״דירה ראשונה״.</p>

        <h2 id="timing-example">דוגמה להמחשה: הכסף מספיק, אבל מגיע מאוחר</h2>
        <p>נניח שלמשפחה יש חיסכון שמיועד לתשלום עבור הדירה, אך לפי הבירור שלה הוא יהיה זמין אחרי המועד שנכתב בטיוטת החוזה. גם אם הסכומים הכוללים מסתדרים, בטבלת התאריכים יופיע פער. זהו תרחיש לימודי ללא מספרים, ולא קביעה לגבי תנאי חיסכון או עסקה מסוימת.</p>
        <p>סמנו את הפער לפני החתימה והעבירו לבירור את מועד התשלום, מועד שחרור החיסכון ותנאי העמדת המשכנתא. לפי <a href={sources[1].href}>הסבר בנק ישראל</a>, תנאי האישור העקרוני כפופים לאימות הנתונים שנמסרו, ולהערכת השמאי עשויה להיות משמעות לשיעור המימון. ראו גם <Link href="/real-estate/mortgage/guide/pre-approval">איך קוראים אישור עקרוני</Link>.</p>

        <h2 id="after-moving">בודקים גם את החודש שאחרי המעבר</h2>
        <p>עדכנו את <Link href="/savings/family-budget">התקציב המשפחתי</Link> בהוצאות הדיור החדשות ובהתחייבויות שכבר קיימות. באישור העקרוני מוצגים ההחזר הראשון, ההחזר הגבוה הצפוי וסך התשלומים החזוי, כפי שמפרט בנק ישראל. השוו אותם למרווח בתקציב, וזכרו שהתחזיות אינן הבטחה להוצאה בפועל.</p>
        <p>אפשר להיעזר ב<Link href="/real-estate/mortgage">מחשבון המשכנתא</Link> לתרחיש של מסלול יחיד בריבית קבועה שתזינו. הוא אינו משלים את עלויות העסקה או מדמה את כל שינויי התמהיל. לפני שמתקדמים, עברו על שלוש בדיקות מעשיות:</p>
        <ul>
          <li>לכל תשלום קרוב יש מקור כסף ומועד זמינות שנבדקו.</li>
          <li>הוצאות הכניסה לבית והסכומים שטרם התבררו מסומנים בטבלה.</li>
          <li>התקציב לאחר המעבר משאיר יתרה בהתאם לצרכים שהגדרתם.</li>
        </ul>
      </>}
      faq={<div className="space-y-3">{faq.map((item) => <details key={item.question} className="border border-ink/15 p-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed">{item.answer}</p></details>)}</div>}
      sources={<ul className="space-y-3">{sources.map((source) => <li key={source.href}><a className="underline" href={source.href}>{source.label}</a></li>)}</ul>}
    />
  </>;
}
