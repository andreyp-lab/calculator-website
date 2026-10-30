import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PAGE_PATH = '/vehicles/new-vs-used';
const UPDATED = '2026-10-30';
const title = 'רכב חדש או יד שנייה: איך בודקים את העסקה';
const description = 'השוואת רכב חדש ומשומש לפי הצעות, מסמכי אחריות, היסטוריית בעלות, קילומטראז׳ ורישוי — בלי להניח מחיר שוק או חיסכון מובטח.';
const sources = [
  { label: 'משרד התחבורה — היסטוריית כלי רכב פרטיים: נסועה ושינויי מבנה', href: 'https://www.gov.il/he/Departments/DynamicCollectors/private_vehicle_history_1?skip=0' },
  { label: 'משרד התחבורה — היסטוריית כלי רכב פרטיים: בעלויות וסוג בעלות', href: 'https://www.gov.il/he/departments/dynamiccollectors/private_vehicle_history_2' },
  { label: 'משרד התחבורה — חידוש רישיון רכב והבחנה בין אגרה לטסט', href: 'https://www.gov.il/he/service/car_licence_renewal' },
  { label: 'משרד התחבורה — בירור קריאה חוזרת בטיחותית', href: 'https://www.gov.il/he/service/recall-vehicle' },
];
const faqs = [
  { question: 'האם רכב משומש בהכרח משתלם יותר מחדש?', answer: 'אין כאן קביעה כזו. בדקו את הרכב המסוים, המחיר שהוצע, מסמכי הטיפולים, הוצאות קרובות ותנאי האחריות בכתב. כאשר חסר מידע מהותי, השאירו אותו כפער לבדיקה במקום לרשום חיסכון משוער.' },
  { question: 'מה אפשר לבדוק במאגרי ההיסטוריה של משרד התחבורה?', answer: 'המאגר הראשון מציג נסועה שדווחה בטסט האחרון וסימוני שינויי מבנה; השני מציג תקופות וסוגי בעלות. לפי תיאור השירותים, הכיסוי הוא לרכבים פרטיים פעילים משנת 2017 ואילך. השוו את המידע למסמכי הרכב.' },
  { question: 'איזה מסמך לבקש כשמבטיחים אחריות?', answer: 'בקשו את נוסח האחריות החל על הרכב המסוים: זהות נותן האחריות, מועד תחילתה, תוקפה, מגבלות, חריגים ותהליך פנייה. אלה שאלות לבירור ההצעה, ולא קביעה של זכאות משפטית או של תקופת אחריות אחידה.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: { absolute: `${title} | חשבונאי` },
  description,
  alternates: { canonical: PAGE_PATH },
  openGraph: { images: ['/opengraph-image'], title, description, type: 'article', locale: 'he_IL', url: PAGE_PATH, publishedTime: UPDATED, modifiedTime: UPDATED },
});

export default function NewVsUsedPage() {
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description,
    url: `https://cheshbonai.co.il${PAGE_PATH}`, inLanguage: 'he-IL',
    datePublished: UPDATED, dateModified: UPDATED,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://cheshbonai.co.il${PAGE_PATH}` },
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about', jobTitle: 'רואה חשבון מוסמך וסמנכ״ל כספים' },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
    citation: sources.map((source) => source.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <CalculatorLayout
        pageUrl={PAGE_PATH}
        title={title}
        description={description}
        breadcrumbs={[{ label: 'דף הבית', href: '/' }, { label: 'רכב ותחבורה', href: '/vehicles' }, { label: 'רכב חדש או יד שנייה' }]}
        lastUpdated={UPDATED}
        disclaimerText="המידע כללי ואינו ייעוץ מס, משפטי, פנסיוני או השקעות, ואינו המלצה לרכישת רכב. לפני החלטה נדרשת התייעצות עם בעל מקצוע בעל רישיון מתאים לנושא; מצב הרכב דורש בדיקה מקצועית נפרדת."
        quickAnswer={<p>כדי לבחור בין רכב חדש ליד שנייה, השוו עסקאות מסוימות שמתאימות לאותו שימוש. אספו מחיר כתוב, תנאי מסירה ואחריות, מסמכי רישוי ותוכנית טיפולים. ברכב משומש הוסיפו בדיקת היסטוריה ובדיקה מקצועית של הרכב. אל תכריעו לפי שנת הייצור או תשלום חודשי בלבד: סמנו אילו פרטים אומתו ואילו עדיין חסרים. ההכרעה יכולה להשתנות בעקבות מסמך אחריות, טיפול קרוב או אי־התאמה בהיסטוריה; אין במדריך קביעה שאחת החלופות תמיד זולה יותר.</p>}
        content={<>
          <p className="text-sm text-ink/65">מאת אנדרי פלטונוב, רו״ח · נבדק ועודכן ב־<time dateTime={UPDATED}>30.10.2026</time>. הבדיקות מבוססות על שירותי משרד התחבורה המקושרים בהמשך; רשימת ההשוואה היא כלי עבודה לאיסוף הצעות.</p>

          <h2>קודם מגדירים מה הרכב צריך לעשות</h2>
          <p>כתבו את סוג הנסיעות, מקום החניה, מספר הנוסעים, הציוד שצריך להוביל ומשך ההחזקה שאתם מתכננים. השוו רכבים שעונים לאותם צרכים. אם רכב חדש גדול ומאובזר מושווה למשומש קטן יותר, רשמו במפורש מה השתנה. אחרת, פער בין ההצעות עלול להתפרש בטעות כתוצאה של גיל הרכב בלבד.</p>
          <p>קבעו גם מה חשוב לכם לברר על זמינות הרכב. שאלו מתי הרכב המסוים יכול להימסר, אילו פעולות נותרו לפני המסירה ומה מתועד בהזמנה. מי שזקוק לרכב לצורך עבודה יכול לרשום גם פתרון ביניים ואת ההצעה שקיבל עבורו, בלי להניח מועד אספקה אחיד לכל רכב חדש או זמינות מיידית של כל משומש.</p>

          <h2>לכל הצעה מצרפים תיק מסמכים</h2>
          <div className="overflow-x-auto">
            <table>
              <caption>מה לבקש לפני השוואת חדש ומשומש</caption>
              <thead><tr><th scope="col">נושא</th><th scope="col">בהצעת רכב חדש</th><th scope="col">בהצעת רכב משומש</th></tr></thead>
              <tbody>
                <tr><th scope="row">זיהוי</th><td>גרסה, אבזור, שנת דגם ופרטי הרכב שיוקצה</td><td>רישיון הרכב והתאמה לרכב שנבדק</td></tr>
                <tr><th scope="row">מחיר ומסירה</th><td>מחיר מלא, תוספות ותנאי מסירה כתובים</td><td>מחיר מבוקש, תנאי מסירה וליקויים שיתוקנו</td></tr>
                <tr><th scope="row">אחריות</th><td>כתב האחריות וזהות נותן השירות</td><td>מסמך אחריות, אם מוצעת, ותנאי תחולתה</td></tr>
                <tr><th scope="row">טיפולים</th><td>תוכנית הטיפולים של הגרסה המוצעת</td><td>תוכנית טיפולים לצד חשבוניות ותיעוד קיים</td></tr>
              </tbody>
            </table>
          </div>
          <p>ליד כל שדה ציינו מי מסר את המידע והיכן הוא כתוב. הבטחה בעל־פה על החלפת צמיגים, תיקון ליקוי או שירות כלול היא נושא לבירור לפני השוואת המחיר הסופית. אל תרשמו אותה כהטבה שכבר התקבלה. ברכב שמוצג כחדש, בקשו הבהרה גם על הרישום הקיים ועל מועד תחילת האחריות במקום להסיק אותם מהניסוח במודעה.</p>

          <h2>ברכב משומש בודקים היסטוריה מול המסמכים</h2>
          <p><a href={sources[0].href} target="_blank" rel="noopener noreferrer">מאגר ההיסטוריה הראשון של משרד התחבורה</a> מציג נסועה שדווחה במועד הטסט האחרון ואינדיקציות לשינויים במבנה. <a href={sources[1].href} target="_blank" rel="noopener noreferrer">מאגר הבעלויות</a> מציג סוגי בעלות ותאריכי בעלות לפי רבעונים. לפי תיאור השירותים, שניהם מתייחסים לרכבים פרטיים פעילים משנת 2017 ואילך.</p>
          <p>השוו את הרשומה לרישיון, למד המרחק ולתיעוד שהמוכר מציג. אם יש פער, בקשו מסמך שמסביר אותו לפני שהעסקה מתקדמת. תוצאה חסרה אינה תשובה על מצב הרכב. גם רשומה שנראית עקבית משאירה שאלות לבדיקה מקצועית: בקשו מהבודק להסביר את ממצאיו, מה טעון בירור ומה ניתן לתמחר בהצעת תיקון.</p>

          <h2>בודקים ריקול, רישוי ואחריות בנפרד</h2>
          <p>בדקו גם את <a href={sources[3].href} target="_blank" rel="noopener noreferrer">שירות הקריאות החוזרות הבטיחותיות</a>. החיפוש הרשמי מתבצע לפי יצרן ודגם; כשנמצאת קריאה רלוונטית, בררו עם היבואן את תחולתה על הרכב המסוים ואת מצב הטיפול בה. אל תסתפקו בכך שהמודעה מציינת ״מטופל״: בקשו תיעוד המתייחס לקריאה עצמה.</p>
          <p>לפי <a href={sources[2].href} target="_blank" rel="noopener noreferrer">דף חידוש רישיון הרכב</a>, רכב פרטי חדש שטרם מלאו לו שלוש שנים פטור מביצוע טסט, אך אינו פטור מאגרת חידוש הרישיון. בדקו את הסיווג והמועד הרשומים לרכב שלכם; אין להסיק מהפטור מטסט שהוצאות הרישוי נעלמות. את שאלות האחריות בררו במסמך נפרד: מה מכוסה, עד מתי, אילו מגבלות קיימות ולמי פונים.</p>

          <h2>מחברים את ממצאי הבדיקה להצעת המחיר</h2>
          <p>בקשו הצעות כתובות לטיפולים או לליקויים שזוהו, והוסיפו אותן לדף ההשוואה של אותו רכב. אם אין עדיין אבחון או הצעה, סמנו ״טרם נבדק״. אל תמלאו את החסר במחיר של טיפול ברכב אחר. את הצעות הביטוח בקשו עבור הנהגים והרכב המסוימים, כדי שההשוואה לא תישען על פוליסה של אדם אחר.</p>
          <p>לריכוז התשלומים הקרובים אפשר להיעזר ב<Link href="/vehicles/maintenance-cost">מדריך תקציב הטיפולים והרישוי</Link>. את האנרגיה בדקו בנפרד ב<Link href="/vehicles/fuel-cost">מחשבון עלות הנסיעה</Link>, לפי הצריכה והמחיר שתזינו. כך תוכלו לזהות אילו מסמכים עוד חסרים לפני שמנסים להחליט בין ההצעות.</p>

          <h2>איך מגיעים להחלטה שאפשר להסביר</h2>
          <p>כתבו ליד כל חלופה את היתרון שאתם מבקשים לקבל ואת הראיה שתומכת בו. אם היתרון הוא אחריות, צרפו את המסמך; אם הוא מחיר רכישה, צרפו הצעה; ואם הוא מצב מכני, צרפו ממצאי בדיקה. שאלו איזה מידע חדש ישנה את הבחירה. זו דרך מעשית להפריד בין העדפה אישית לבין הנחה שעדיין לא אומתה.</p>
          <p>לצורך מכירה עתידית, קראו כיצד <Link href="/vehicles/depreciation">לבדוק שווי וירידת ערך בלי אחוז קבוע</Link>. את הבחירה איך לשלם אפשר לבחון לאחר מכן ב<Link href="/vehicles/leasing-vs-buying">השוואת ליסינג, הלוואה ומזומן</Link>. שמרו את שתי ההחלטות ברורות: תחילה איזה רכב ועסקה אתם בוחנים, ובהמשך אילו תנאי תשלום הוצעו עבורם.</p>
        </>}
        faq={<><FAQSchema items={faqs} />{faqs.map((item) => <details key={item.question} className="border-b border-ink/15 py-4"><summary className="cursor-pointer font-bold text-ink">{item.question}</summary><p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p></details>)}</>}
        sources={<><p className="mb-3 text-sm">מקורות ראשוניים שנבדקו לתוכן ב־30.10.2026. את נתוני הרכב ותנאי העסקה יש לבדוק מחדש לפני רכישה.</p><ul className="space-y-2">{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="text-gold underline">{source.label}</a></li>)}</ul></>}
      />
    </>
  );
}
