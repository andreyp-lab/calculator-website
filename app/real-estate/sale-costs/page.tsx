import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PATH = '/real-estate/sale-costs';
const SITE_URL = 'https://cheshbonai.co.il';
const TITLE = 'עלויות מכירת דירה: ריכוז תשלומים ותזרים העסקה';
const sources = {
  assessment: 'https://www.gov.il/he/service/real_estate_selfshuma',
  levy: 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/ImprovmentTax.aspx',
  property: 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/BuyingProperty.aspx',
  legislation: 'https://www.boi.org.il/roles/supervisionregulation/legislation/',
  interest: 'https://www.boi.org.il/information/interestrates/mortgage/',
};

export const metadata: Metadata = {
  title: TITLE,
  description: 'איך מרכזים את תשלומי מכירת הדירה לפי מסמכים: סכום, מקבל, מועד וסטטוס. ללא מחירי שוק משוערים או הבטחת הכרה במס. נבדק ב־24.10.2026.',
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, type: 'article', locale: 'he_IL', url: PATH, images: ['/opengraph-image'] },
};

const faq = [
  {
    question: 'כמה עולה למכור דירה?',
    answer: 'העמוד אינו מציג מחיר אחיד או אחוז ממחיר הדירה. מרכזים את הסכומים ממסמכי העסקה, הסכמי השירות, דרישות התשלום והבנק. סכום שחסר לו מסמך נשאר מסומן לבירור, כדי שהסיכום לא ייראה שלם כאשר נתונים עדיין חסרים.',
  },
  {
    question: 'האם כל תשלום בטבלה מוכר במס שבח?',
    answer: 'הטבלה מיועדת לארגון התזרים ואינה קובעת הכרה במס. מסמך תשלום אינו לבדו קביעה לגבי ניכוי. את הטיפול במס בודקים בנפרד עם רואה חשבון ועורך דין לפי הדין והמסמכים, באמצעות שירותי רשות המסים המתאימים.',
  },
  {
    question: 'איך נמנעים מספירה כפולה של סכום הסילוק?',
    answer: 'מצמידים לכל שורה מסמך ותיאור של מה שנכלל בסכום. אם משתמשים בסכום סילוק כולל, לא מוסיפים שוב רכיבים שכבר מופיעים בו. כאשר הפירוט אינו ברור מבקשים הבהרה מהבנק לפני שמסכמים את טבלת העבודה.',
  },
];

const articleSchema = {
  '@context': 'https://schema.org', '@type': 'Article', headline: TITLE,
  description: metadata.description, inLanguage: 'he-IL',
  datePublished: '2026-10-24', dateModified: '2026-10-24',
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${PATH}` },
  author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון', url: `${SITE_URL}/about` },
  publisher: { '@type': 'Organization', name: 'חשבונאי', url: SITE_URL },
  citation: Object.values(sources),
};

export default function SaleCostsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-cream text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'נדל״ן', url: '/real-estate' }, { name: 'עלויות מכירה', url: PATH }]} />
      <FAQSchema items={faq} />
      <article className="mx-auto max-w-4xl px-5 py-10">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'נדל״ן', href: '/real-estate' }, { label: 'עלויות מכירה' }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed">מחיר המכירה אינו מתאר לבדו את הכסף שיהיה זמין לאורך העסקה. מדריך זה מציע דרך לרכז תשלומים ומסמכים לקראת בדיקה מקצועית. הוא מתמקד בתזרים המכירה, ולא בחישוב המס, בתמחור שירותים או בבחירת מימון חדש.</p>
          <p className="mt-4 text-sm text-ink/70">מאת <Link href="/about" className="underline">אנדרי פלטונוב, רו״ח</Link> · נבדק ועודכן: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border-r-4 border-gold bg-cream-2 p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-relaxed">כדי לרכז עלויות מכירה, רשמו לכל תשלום את הסכום המתועד, מקבל התשלום, המועד והסטטוס. בדקו בנפרד שירותים שהוזמנו, בירורי מס והיטל וסילוק הלוואה אם רלוונטי. אל תמלאו נתון חסר באמצעות אחוז שוק משוער. טבלת העבודה מציגה תנועות כסף בלבד; היא אינה שומת מס ואינה קביעה שהוצאה מותרת בניכוי.</p>
        </section>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <section>
            <h2>מתחילים ממסמך ומגדירים את היקף הטבלה</h2>
            <p>אספו את הסכם המכירה או הטיוטה שבבדיקה, הצעות השירות שבידיכם, הודעות מהרשויות ומסמכי הבנק. זו הצעת עבודה לאיסוף הנתונים, ולא רשימת חובות משפטיות. כל שורה בטבלה צריכה לענות על שאלה פשוטה: מאיזה מסמך הגיע הסכום? כאשר אין תשובה, סמנו את הנתון כחסר ובקשו את המסמך המתאים.</p>
            <p>החליטו אם אתם מתעדים רק את המכירה או גם מעבר ורכישה אחרת. אפשר לנהל גיליון נוסף להוצאות האלה, כדי שניתן יהיה להבין מה שייך לכל פעולה. כתבו בראש הטבלה את תאריך הכנתה ואת המסמכים שעליהם היא מבוססת. כך מי שבודק אותה יוכל לזהות בקלות נתון שהשתנה.</p>
          </section>
          <section>
            <h2>טבלת עבודה לתשלומים ולבירורים</h2>
            <p>החלוקה הבאה היא אמצעי ארגון תזרימי בלבד, ואינה סיווג הוצאות לפי דיני המס. השתמשו רק בשורות שרלוונטיות למסמכים שלכם. לצד כל סכום הוסיפו שם קובץ, תאריך וסטטוס: בבירור, מתועד או שולם. אפשר להשאיר שורה ללא סכום, עם שאלה ברורה למי שמטפל בנושא.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <caption className="mb-3 text-right">ריכוז מסמכים לעסקת המכירה</caption>
                <thead><tr><th scope="col">נושא לבדיקה</th><th scope="col">מסמך לעיון</th><th scope="col">מה לרשום</th></tr></thead>
                <tbody>
                  <tr><th scope="row">שירות שהוזמן</th><td>הסכם שירות והצעה כתובה</td><td>היקף השירות, סכום ומועד</td></tr>
                  <tr><th scope="row">בירור מס שבח</th><td>תוצאת בדיקה ומסמכי הרשות</td><td>מקור הסכום ומצב הבירור</td></tr>
                  <tr><th scope="row">בירור היטל השבחה</th><td>תשובת הוועדה או שומה</td><td>סוג המסמך ותאריך קבלתו</td></tr>
                  <tr><th scope="row">סילוק הלוואה</th><td>פירוט מהבנק למועד הרלוונטי</td><td>סכום כולל ומה נכלל בו</td></tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>שירותים מקצועיים: קוראים את ההצעה עצמה</h2>
            <p>אם הוזמנו שירותי עורך דין, תיווך או שמאות, העתיקו לטבלה את הסכומים מההסכמים הרלוונטיים. בדקו מה כלול בהצעה, מה סומן כתוספת ומה עדיין דורש הצעה משלימה. אין כאן קביעה שהשירות נחוץ בכל עסקה או שתשלום כלשהו מגיע לנותן השירות; את השאלות האלה יש לבדוק לפי ההסכם והדין.</p>
            <p>לצורך השוואת הצעות, רשמו במילים מה אתם מקבלים בכל הצעה. סכומים שנראים שונים עשויים להתייחס להיקף עבודה שונה. בקשו הבהרה כתובה לגבי רכיב עמום, ועדכנו את הטבלה רק לאחר שהתקבלה. אל תתייחסו לסכום ששולם בעסקה של מכר כאל הצעה תקפה לנכס שלכם.</p>
          </section>
          <section>
            <h2>מס שבח והיטל: מחברים את המסמך הנכון</h2>
            <p><a href={sources.assessment}>רשות המסים מפעילה מערכת לחישוב שומה עצמית למס שבח</a>. לצורך ארגון התזרים, שמרו את תוצאת הבדיקה לצד ההנחות והמסמכים ששימשו לה. כאשר הוזן אומדן ראשוני, כתבו זאת במפורש. פירוט בדיקת המס נמצא ב<Link href="/real-estate/capital-gains-tax">עמוד מס השבח</Link>; אין לחשב אותו מחדש מתוך טבלת תשלומים חלקית.</p>
            <p>בנושא היטל השבחה, <a href={sources.property}>המדריך העירוני של תל אביב־יפו</a> מבדיל בין בירור מידע לבין הזמנת שומה. בצעו את הבירור לפי הוועדה שבתחומה נמצא הנכס. <a href={sources.levy}>דף ההיטל העירוני</a> הוא מקור להליך בתל אביב־יפו, ולא למחיר שירות או לתוצאה בנכס אחר. ב<Link href="/real-estate/betterment-levy">מדריך היטל ההשבחה</Link> מוסבר איך לארגן את הבדיקה.</p>
          </section>
          <section>
            <h2>אם יש הלוואה: מבקשים פירוט למועד הסילוק</h2>
            <p>לבדיקת סילוק הלוואה, בקשו מהבנק מסמך המתייחס למועד הנבחן ופירוט הרכיבים הכלולים בו. <a href={sources.legislation}>מאגר החקיקה של בנק ישראל כולל את צו הפירעון המוקדם של הלוואה לדיור</a>, ובנק ישראל מפרסם גם <a href={sources.interest}>ריביות המשמשות לחישוב עמלת הפירעון המוקדם</a>. אין להחליף חישוב בנקאי לעסקה באחוז אחיד שמניחים מראש.</p>
            <p>בטבלת העבודה סמנו בנפרד את החזר החוב ואת רכיבי התשלום האחרים כפי שפורטו במסמך. אם משתמשים בשורה של סכום כולל, אל תוסיפו שוב רכיב שכבר נכלל בה. כשמועד התשלום משתנה, בקשו נתון מתאים למועד החדש. להסבר על הנושא אפשר לעיין ב<Link href="/real-estate/mortgage/guide/prepayment-fee">מדריך עמלת הפירעון המוקדם</Link>.</p>
          </section>
          <section>
            <h2>בודקים מתי הכסף מתקבל ומתי הוא יוצא</h2>
            <p>לאחר ריכוז הסכומים, סדרו את התקבולים והתשלומים לפי תאריכים במסמכים שבבדיקה. ליד כל תנועה ציינו אם המועד מוסכם או שעדיין חסר מידע. חיבור של הסכומים בלבד אינו מראה אם תשלום מתוכנן לפני תקבול. הציגו פער כזה לאנשי המקצוע שמלווים את העסקה, בלי להניח מקור מימון שטרם נבדק.</p>
            <p>בסיום עברו על הטבלה מול המסמכים: האם תשלום נספר פעמיים, האם מקבל התשלום ברור, והאם נשאר נתון ללא אסמכתה? שמרו גרסה מתוארכת לפני כל עדכון משמעותי. לאחר תשלום צרפו את האישור ועדכנו את הסטטוס. התוצאה היא תיק עבודה שאפשר לבדוק, ולא הבטחה לסכום נטו סופי.</p>
          </section>
        </div>
        <section className="my-8">
          <h2 className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faq.map((item) => <details key={item.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed">{item.answer}</p></details>)}
        </section>
        <section className="my-8 text-sm leading-relaxed">
          <h2 className="mb-3 text-xl font-bold">מקורות ותאריך בדיקה</h2>
          <p>נבדקו ב־24.10.2026: <a className="underline" href={sources.assessment}>רשות המסים — שומה עצמית למס שבח</a>; <a className="underline" href={sources.levy}>עיריית תל אביב־יפו — היטל השבחה</a>; <a className="underline" href={sources.property}>המדריך העירוני לבירור חבות</a>; <a className="underline" href={sources.legislation}>בנק ישראל — חקיקה, צו פירעון מוקדם</a>; <a className="underline" href={sources.interest}>בנק ישראל — ריבית לצורכי פירעון מוקדם</a>. סכומי העסקה נלקחים מהמסמכים הפרטניים; המקורות אינם מחירון לשירותים.</p>
        </section>
        <aside className="mb-8 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed">מידע כללי בלבד, שאינו ייעוץ מס, ייעוץ משפטי או ייעוץ משכנתאות. לפני חתימה, דיווח או סילוק הלוואה יש להתייעץ עם עורך דין ורואה חשבון, ועם איש מקצוע בתחום המשכנתאות ושמאי מקרקעין לפי הצורך. אין כאן המלצה אישית או קביעה בדבר הכרה בהוצאה.</aside>
        <AuthorBox />
      </article>
    </main>
  );
}
