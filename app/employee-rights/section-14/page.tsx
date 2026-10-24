import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/employee-rights/section-14';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'סעיף 14 לחוק פיצויי פיטורים: תחולה, הפקדות והשלמה';
const DESCRIPTION = 'איך בודקים אם סעיף 14 חל, על איזה שכר ותקופות, ומה ההבדל בין כספים בקופה, השלמת פיצויים ומשיכה. מדריך עם מקורות רשמיים ומסמכים לבירור.';
const sources = [
  { title: 'חוק פיצויי פיטורים — סעיפים 14, 16, 17 ו־26; מאגר הביטוח הלאומי', url: 'https://www.btl.gov.il/Laws1/00_0040_000000.pdf' },
  { title: 'משרד העבודה — הפרשות לפיצויי פיטורים והצווים המצורפים', url: 'https://www.gov.il/he/pages/provisions-for-severance-pay?chapterIndex=1' },
  { title: 'האישור הכללי בדבר תשלומי מעבידים במקום פיצויי פיטורים', url: 'https://www.gov.il/BlobFolder/guide/provisions-for-severance-pay/ar/workers-rights_dismissal-and-termination-of-work_provisions-for-severance-pay_procedures_insurance-fund-instead-of-severance-pay.pdf' },
  { title: 'משרד העבודה — הנחיות להחלה רטרואקטיבית של סעיף 14', url: 'https://www.gov.il/BlobFolder/servicequestionnaire/approval-agreement-section28-request/he/guidelines-applying-retroactively-section14.pdf' },
];
const faqs = [
  { question: 'האם עצם ההפקדה לפנסיה מוכיחה שסעיף 14 חל על הכול?', answer: 'לא. יש לזהות את ההסדר המשפטי שמכוחו נעשתה ההפקדה ואת השכר, התקופות והחלק בפיצויים שהוא מכסה. הפקדה או אזכור כללי בחוזה אינם מספיקים לקביעה בדבר מלוא החבות.' },
  { question: 'האם סעיף 14 יכול לחול רק על חלק מההעסקה?', answer: 'כן. האישור הכללי מתייחס לשכר שממנו שולמו התשלומים ולתקופה שבעדה שולמו. לגבי שכר או תקופה שלא כוסו נדרשת בדיקה נפרדת, לרבות שאלת הזכאות להשלמה.' },
  { question: 'האם אפשר להחיל סעיף 14 בדיעבד?', answer: 'אין להניח שחתימה חדשה משנה אוטומטית תקופות עבר. משרד העבודה פרסם מסלול לבחינת החלה רטרואקטיבית במקרים חריגים ובכפוף לתנאים ולמסמכים המפורטים בהנחיותיו.' },
  { question: 'האם אפשר למשוך מיד את הכספים לאחר התפטרות?', answer: 'תחולת סעיף 14 אינה אישור גורף למשיכה. יש לבדוק את הוראות ההסדר, תנאי הקופה, החריגים והשלכות המס עם גורם מוסמך לפני מתן הוראת משיכה.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function Section14Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24', author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: sources.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${URL}#faq`, mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'זכויות עובדים', url: '/employee-rights' }, { name: 'סעיף 14', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'זכויות עובדים', href: '/employee-rights' }, { label: 'סעיף 14' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מפת בדיקה להסדר הפיצויים: מה כתוב, מה הופקד ואילו תקופות כוסו.</p>
          <p className="mt-4 text-sm text-ink/70">תאריך בדיקת מקורות: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>סעיף 14 מאפשר, בהסדר המתאים ובגבולותיו, שהפקדות יבואו במקום פיצויי פיטורים. הוא אינו מוכיח שכל השכר וכל תקופת העבודה כוסו. הבדיקה מתחילה בזיהוי המקור המחיל את ההסדר, ממשיכה בהשוואת החוזה לדוחות ההפקדה, ומסתיימת בבירור חלקים שלא כוסו. הבסיס הוא <a className="underline" href={sources[0].url}>סעיף 14 לחוק</a> ו<a className="underline" href={sources[2].url}>האישור הכללי</a>. אין להסיק מכך לבדו זכאות אישית להשלמה או אפשרות למשיכת כספים.</p>
        </section>
        <aside aria-label="הבהרה משפטית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ משפטי, ייעוץ מס או ייעוץ פנסיוני. אין בו קביעה לגבי מקרה אישי, המלצה לחתום על הסדר או הוראה למשוך כספים. היישום מחייב בדיקת המסמכים והדין החל עם בעל מקצוע מתאים; לא מוצג בעמוד אישור משפטי של עורך דין.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מה הסעיף משנה בהתחשבנות?</h2>
          <p>כדי להבין סעיף 14 צריך להפריד בין תשלום שנזקף על חשבון חבות עתידית לבין תשלום שבא במקומה. הסעיף עצמו מציב בסיס משפטי להחלפה הזאת באמצעות הסכם קיבוצי או אישור מתאים, ובהיקף שנקבע בהם. לכן לא די למצוא יתרה בקרן הפנסיה. צריך לדעת מדוע ההפקדה נחשבת תחליף, ומה בדיוק היא מחליפה. <a href={sources[0].url}>נוסח החוק, סעיף 14</a>, הוא נקודת המוצא לשאלה הזאת.</p>
          <p>המדריך הכללי על <Link href="/employee-rights/severance">פיצויי פיטורים</Link> מסביר את ההתחשבנות בסיום עבודה. כאן המוקד הוא מיפוי ההסדר לאורך ההעסקה. אלה בדיקות משלימות: אפשר להבין כיצד הופקד כסף ועדיין לא לדעת אם נוצרה חבות נוספת בסיום. גם הסיבה לסיום העבודה צריכה להיבחן בנפרד מהכותרת של נספח הפנסיה.</p>
          <h2>איך מזהים את המקור שמחיל את ההסדר?</h2>
          <p>אספו את חוזה ההעסקה, נספחי הפנסיה, מסמכי הצטרפות וכל שינוי חתום. חפשו הפניה מפורשת לאישור הכללי, להסכם קיבוצי או לצו החל. בדף <a href={sources[1].url}>ההפרשות של משרד העבודה</a> נמצאים גם מסמכי האישור והצווים. אין להשתמש בתנאי האישור הכללי כאילו הם ההסדר היחיד האפשרי; צריך לקרוא את המקור הרלוונטי לתקופה ולעבודה המסוימת.</p>
          <p>אם החוזה כולל רק משפט כמו ״התנאים לפי החוק״, בקשו הבהרה כתובה מהו ההסדר הנטען ומה מועד תחולתו. אם מוצג נספח שנחתם אחרי תחילת ההעסקה, רשמו בנפרד את מועד החתימה ואת מועד ההפקדה הראשון. המסמכים האלה מאפשרים לשאול שאלה ממוקדת, במקום להסיק שכל התקופה מכוסה משום שהמילים ״סעיף 14״ מופיעות בתלוש חדש.</p>
          <h2>מפרידים בין שכר, תקופות והפקדות</h2>
          <p><a href={sources[2].url}>האישור הכללי</a> מתייחס לשכר שממנו שולמו התשלומים ולתקופה שבעדה שולמו. זו הסיבה לבנות מפת העסקה: תאריכי העבודה, שינויי שכר, שינויי היקף משרה, סוג הקופה וההפקדות בכל תקופה. העלאת שכר אינה מחליפה בדיקה של השכר שבוטח בפועל; יתרה כוללת בדוח אינה מציגה לבדה את בסיס השכר לכל הפקדה.</p>
          <ul>
            <li>לכל תקופה, רשמו את השכר בתלוש מול השכר המדווח לקופה ואת המקור לכל נתון.</li>
            <li>הפרידו בין רכיב פיצויים לבין תגמולי העובד ותגמולי המעסיק; יתרת החיסכון כולה אינה יתרת פיצויים.</li>
            <li>סמנו חודשים חסרים, הפקדות שלא שויכו והפרשים בין דוח הקרן לתלוש.</li>
            <li>אל תכריעו לבד אילו תוספות הן חלק מהשכר הקובע. הציגו לבעל המקצוע את פירוט הרכיבים וההסכמים.</li>
          </ul>
          <p>אפשר להיעזר בעמוד <Link href="/employee-rights/salary-deductions">ניכויים בתלוש השכר</Link> לקריאת הנתונים, ובעמוד <Link href="/insurance/pension">החיסכון הפנסיוני</Link> להבנת המוצרים. עצם הרישום בתלוש אינו מחליף התאמה לתנועות בקופה. כשיש הפרש, שמרו את שתי הגרסאות ובקשו הסבר על החודש שאליו כל תשלום שויך.</p>
          <p>בדוח יתרות ובדוח הפקדות מוצגים נתונים שונים. הראשון מתאר את מצב הכספים במועד מסוים, והשני עוזר לעקוב אחר התשלומים שיוחסו לתקופות העבודה. לצורך ההתאמה, בקשו את שניהם לאותו חשבון ובדקו את תאריכי ההפקה. אם המעסיק עבר בין גופים מנהלים, רכזו את הדוחות מכל גוף ושאלו אילו העברות בוצעו ביניהם. כך לא תסיקו מהיעדר הפקדה בדוח של קרן אחת שלא הייתה הפקדה במקום אחר.</p>
          <h2>מתי עולה שאלת ההשלמה מהמעסיק?</h2>
          <p>לאחר המיפוי, ניתן לבקש בדיקה של חלקי שכר או תקופות שלא כוסו ושל היקף ההחלפה לפי ההסדר. <a href={sources[1].url}>משרד העבודה מתייחס להשלמת פיצויי פיטורים</a>, אך החלת ההסבר על חשבון מסוים מחייבת בחינת תנאי הזכאות וההפקדות. אין בעמוד נוסחה גורפת של ״השכר האחרון פחות היתרה בקרן״: היא עלולה להתעלם מחלקים שעליהם חל הסדר אחר.</p>
          <p>למשל, כאשר נספח חל רק על חלק מההעסקה, הכינו לבירור שתי קבוצות מסמכים: התקופה שלפניו והתקופה שאחריו. זו דוגמה לארגון הבדיקה, לא קביעה שתהיה תוספת לתשלום. אם קיימת מחלוקת על סיבת העזיבה, קראו גם על <Link href="/employee-rights/resignation-as-dismissal">התפטרות שדינה כפיטורים</Link> והעבירו את ההתכתבויות לבחינה משפטית.</p>
          <h2>חתימה מאוחרת והחלה רטרואקטיבית</h2>
          <p>חתימה היום אינה בסיס להנחה שכל שנות העבר שינו את אופיין. משרד העבודה פרסם <a href={sources[3].url}>הנחיות מיוחדות להחלה רטרואקטיבית</a>, המתייחסות לבחינה חריגה ולמסמכים נלווים. אם מוצע לחתום על מסמך כזה, בקשו נוסח מלא, פירוט של התקופות והסבר להתחשבנות המוצעת. נדרשת בדיקה משפטית של ההצעה ושל תחולתה, לרבות שאלת הצורך באישור.</p>
          <h2>כספים בקופה, שחרור ומשיכה הם שאלות שונות</h2>
          <p>בדיקת הבעלות והחבות אינה מסתיימת בהחלטה למשוך את הכסף. <a href={sources[2].url}>האישור הכללי</a> כולל גם הוראות וחריגים הנוגעים להחזרת כספים; <a href={sources[0].url}>החוק</a> כולל הוראות נוספות בנוגע לכספים ולשלילת פיצויים. אין לתרגם את הכותרת ״סעיף 14״ להבטחה של משיכה מיידית בכל מצב. לבירור מעשי יש להציג גם את תנאי הקופה ואת מסמכי סיום העבודה.</p>
          <p>לפני בקשת משיכה, בקשו ייעוץ מס ופנסיה המתייחס לחלופות האישיות. העמוד אינו מציג שיעור מס, פטור או תוצאה צפויה לחיסכון. את <Link href="/employee-rights/notice-period">ההודעה המוקדמת</Link>, יתרת החופשה ושאר רכיבי גמר החשבון צריך לבדוק בנפרד, בלי לערבב אותם עם היתרה שמיועדת לפיצויים.</p>
          <h2>מה להעביר לבדיקה מקצועית?</h2>
          <p>צרפו קובץ מסודר של החוזה וכל נספחיו, תלושים מתקופות שבהן חל שינוי, דוח הפקדות ודוח יתרות עדכני. הוסיפו רשימת שאלות: מה מקור התחולה, אילו רכיבים כוסו, האם יש חוסרים, ומה טרם הוכרע. בסיום העבודה צרפו גם את הודעת הסיום ואת פירוט החשבון של המעסיק. מסמך מסכם טוב מפריד בין נתון מוכח, טענת מעסיק ושאלה שממתינה לבירור.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות על סעיף 14</h2>
          {faqs.map((faq) => <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. הדין וההסדר החל גוברים על הסבר כללי; תאריך הבדיקה אינו אישור לזכאות.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מרכז הסברים וקישורים למקורות רשמיים ואינו חוות דעת משפטית. תחולת ההסדר, הזכאות והחלטות מס ופנסיה מצריכות בדיקה פרטנית עם בעל מקצוע מתאים." />
      </div>
    </article>
  );
}
