import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';

const PATH = '/real-estate/betterment-levy';
const SITE_URL = 'https://cheshbonai.co.il';
const TITLE = 'היטל השבחה: בירור חבות וקריאת שומה לפני מכירה';
const sources = {
  planning: 'https://www.gov.il/he/pages/bidguide?chapterIndex=2',
  municipality: 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/ImprovmentTax.aspx',
  property: 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/BuyingProperty.aspx',
  appraiser: 'https://www.gov.il/he/service/decisive_appraiser_nomination',
  assessment: 'https://www.gov.il/he/service/real_estate_selfshuma',
};

export const metadata: Metadata = withPageSocialMetadata({
  title: TITLE,
  description: 'מה בודקים בהיטל השבחה לפני מכירת נכס: מקור החיוב, שיעור הבסיס, שומה, מסמכים ומסלולי בירור. מקורות רשמיים שנבדקו ב־24.10.2026.',
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, type: 'article', locale: 'he_IL', url: PATH, images: ['/opengraph-image'] },
});

const faq = [
  {
    question: 'האם היטל השבחה מחושב ממחיר המכירה?',
    answer: 'לא. מדריך מינהל התכנון קושר את ההיטל להשבחה עקב אישור תוכנית, הקלה או שימוש חורג. מחיר העסקה לבדו אינו מספיק. יש לקרוא את השומה ולברר מהו האירוע התכנוני ומהי ההשבחה שנקבעה בגינו.',
  },
  {
    question: 'האם מכתב מידע הוא שומה סופית?',
    answer: 'אין להתייחס לכל תשובה כאל שומה. המדריך העירוני מבחין בין מידע ראשוני, מידע רשמי והזמנת שומה. בדקו מה סוג המסמך שקיבלתם, מה הוא מכסה והאם נדרשת בקשה נוספת בוועדה שבתחומה נמצא הנכס.',
  },
  {
    question: 'איך מתחילים לבדוק חיוב שנראה שגוי?',
    answer: 'שמרו את השומה המלאה ואת תיעוד קבלתה. הגדירו עם עורך דין ושמאי מקרקעין אם המחלוקת נוגעת לעצם החבות, לנתוני הנכס או לסכום. בדקו את ההליך והמועד החלים לפני הגשה; שירות מינוי שמאי מכריע עוסק במחלוקת על גובה החיוב.',
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

export default function BettermentLevyPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-cream text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'נדל״ן', url: '/real-estate' }, { name: 'היטל השבחה', url: PATH }]} />
      <FAQSchema items={faq} />
      <article className="mx-auto max-w-4xl px-5 py-10">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'נדל״ן', href: '/real-estate' }, { label: 'היטל השבחה' }]} />
        <header className="my-8">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{TITLE}</h1>
          <p className="text-lg leading-relaxed">קיבלתם שומת היטל השבחה, או שאתם מבררים חבות לפני חתימה? המדריך מתמקד בקריאת המסמך ובארגון הבדיקה מול הוועדה המקומית. הוא אינו מחשבון ואינו מעריך את שווי הזכויות בנכס שלכם.</p>
          <p className="mt-4 text-sm text-ink/70">מאת <Link href="/about" className="underline">אנדרי פלטונוב, רו״ח</Link> · נבדק ועודכן: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-labelledby="quick-answer" className="mb-8 border-r-4 border-gold bg-cream-2 p-6">
          <h2 id="quick-answer" className="mb-3 text-xl font-bold">תשובה מהירה</h2>
          <p className="leading-relaxed">היטל השבחה קשור לעליית ערך עקב פעולה תכנונית. שיעור הבסיס שמציג מינהל התכנון הוא מחצית ההשבחה, כלומר 50%, ולא מחצית מחיר הדירה. לפני מכירה מבררים חבות בוועדה המקומית ומבקשים מסמך המתייחס לנכס ולפעולה המתוכננת. קביעה אישית מחייבת בדיקת שומה, דין וחריגים; אין להסיק משיעור הבסיס מהו התשלום בעסקה מסוימת. <a href={sources.planning} className="underline">מקור: מדריך מינהל התכנון</a>.</p>
        </section>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <section>
            <h2>מהו האירוע שבגללו נערכה השומה?</h2>
            <p>מדריך מינהל התכנון מגדיר השבחה בעקבות אישור תוכנית, מתן הקלה או התרת שימוש חורג, ומייחס את הטלת ההיטל לוועדה המקומית. לכן השאלה הראשונה היא איזו פעולה תכנונית נבדקה. סמנו בשומה את התוכנית, ההחלטה והנכס שאליהם היא מתייחסת. אל תסתפקו בכותרת או בשובר התשלום: בקשו גם את ההסבר שמחבר בין האירוע התכנוני לבין ההשבחה שנקבעה. <a href={sources.planning}>להגדרת ההיטל במינהל התכנון</a>.</p>
            <p>רשמו בנפרד מה ידוע לכם ומה דורש בירור: תיאור הדירה, הזכויות הרשומות, השימוש בפועל ומסמכים מעסקאות קודמות. מטרת הרשימה היא לאפשר לאיש מקצוע לאתר פערים ולשאול שאלות ממוקדות. אין בה השגה שמאית או מסקנה משפטית, ומידע שמסר מתווך או שכן אינו מחליף את מסמכי הנכס.</p>
          </section>
          <section>
            <h2>מידע מוקדם, שומה ומימוש זכויות</h2>
            <p>המדריך העירוני של תל אביב־יפו מבחין בין מידע ראשוני, מידע מפורט ורשמי והזמנת שומה. זו דוגמה להליך מקומי; את הבקשה בפועל מגישים לפי הנחיות הוועדה הרלוונטית לנכס. בדקו איזו תשובה ביקשתם ומה קיבלתם, ושמרו את הבקשה לצד התשובה. <a href={sources.property}>להבחנה במדריך העירוני</a>.</p>
            <p>בדף ההיטל העירוני מפורטים מכירה הטעונה רישום, קבלת היתר ושימוש לפי תוכנית משביחה כמקרי מימוש. לפני פעולה, בקשו בירור של האירוע הרלוונטי ואל תניחו שבדיקה שנעשתה לצורך אחר עונה גם על השאלה הנוכחית. <a href={sources.municipality}>לפרק מימוש הזכויות</a>.</p>
          </section>
          <section>
            <h2>תיק מסמכים שאפשר לבדוק ביעילות</h2>
            <p>כתהליך הכנה, רכזו תיק אחד עם המסמכים שכבר נמצאים בידיכם: חוזים, מסמכי זכויות, תוכניות, היתרים, שומות ותכתובות. זוהי הצעה לארגון העבודה ולא רשימת מסמכים מחייבת להגשה. רשימת הדרישות נמצאת בשירות של הוועדה המקומית, והיא עשויה להשתנות לפי סוג הבקשה. לפני שליחה ודאו מה נדרש במקרה שלכם.</p>
            <p>תנו לכל מסמך שם ברור ותאריך, וציינו אם הוא מלא או שחסרים נספחים. ליד כל פנייה רשמו את השאלה שנשאלה ואת התשובה שהתקבלה. אם התיאור בשומה שונה מהמסמכים שבידיכם, הציגו את ההבדל כנקודה לבירור. הימנעו מעריכת המסמך המקורי או מהחלפת נתון בו לפי הערכה עצמית.</p>
          </section>
          <section>
            <h2>פטור ומחלוקת מצריכים בדיקה נפרדת</h2>
            <p>דף העירייה מפנה לפטורים שבסעיף 19 לתוספת השלישית לחוק התכנון והבנייה. עצם קיומו של סעיף פטור אינו אישור זכאות לנכס שלכם. בקשו מעורך הדין לזהות את ההוראה הרלוונטית ואת האסמכתאות הדרושות, ואל תתכננו את כספי העסקה כאילו התקבל פטור לפני בירור. <a href={sources.municipality}>לפרק הפטורים הרשמי</a>.</p>
            <p>הדף העירוני מתאר מסלולי ערר, שמאי מכריע ושומה מוסכמת בתנאים המתאימים. <a href={sources.appraiser}>שירות משרד המשפטים למינוי שמאי מכריע</a> מיועד, בין היתר, למחלוקת על גובה חיוב בהיטל. בחירת המסלול צריכה להתבסס על סוג המחלוקת ועל הדין העדכני, ולא רק על הרצון להפחית את הסכום. <a href={sources.municipality}>למסלולי הבירור בדף העירייה</a>.</p>
          </section>
          <section>
            <h2>איך מתעדים קבלת שומה ומועד לטיפול?</h2>
            <p>שמרו את הודעת המסירה, הדואר או האישור המקוון יחד עם השומה. העבירו לאיש המקצוע גם את התאריך שבו התקבל המסמך ואת פרטי הנמען. בקשו ממנו לזהות את ההליך המתאים ולרשום את המועד החל עליו לפי המקור הרשמי, לרבות הודעות הארכה אם חלות. אין כאן מניין ימים אחיד לכל סוגי הבקשות.</p>
            <p>לצורך מעקב, רשמו מי מטפל בפנייה, מה טרם נבדק ומתי אמורה להתקבל תשובה. אם אתם ממתינים להשלמת מסמך, בקשו לברר במפורש כיצד הדבר משתלב במועד ההגשה. אל תסיקו משיחה כללית עם נותן שירות שהבקשה כבר הוגשה או שהטיפול במועדים הוסדר.</p>
          </section>
          <section>
            <h2>החיבור לתכנון המכירה</h2>
            <p>צרפו את תוצאת הבירור ל<Link href="/real-estate/sale-costs">ריכוז עלויות המכירה</Link>, בציון המקור והסטטוס של הסכום. הבדילו בין סכום שנקבע, סכום שעדיין נבדק ותשלום שבוצע. כך אפשר להציג לעורך הדין תמונה ברורה בלי להפוך הערכה מוקדמת לנתון סופי.</p>
            <p>לבדיקת מס שבח השתמשו ב<Link href="/real-estate/capital-gains-tax">עמוד מס השבח</Link> וב<a href={sources.assessment}>מערכת השומה העצמית של רשות המסים</a>. המערכת עוסקת במס שבח; אין להעתיק ממנה תוצאה לשורת היטל ההשבחה. שמרו בתיק מסמך נפרד לכל בדיקה וציינו מי ערך אותה.</p>
          </section>
        </div>
        <section className="my-8">
          <h2 className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faq.map((item) => <details key={item.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed">{item.answer}</p></details>)}
        </section>
        <section className="my-8 text-sm leading-relaxed">
          <h2 className="mb-3 text-xl font-bold">מקורות ותאריך בדיקה</h2>
          <p>נבדקו ב־24.10.2026: <a className="underline" href={sources.planning}>מינהל התכנון — מדריך להיטל השבחה</a>; <a className="underline" href={sources.municipality}>עיריית תל אביב־יפו — היטל השבחה</a>; <a className="underline" href={sources.property}>המדריך העירוני לבירור לפני עסקה</a>; <a className="underline" href={sources.appraiser}>משרד המשפטים — מינוי שמאי מכריע</a>; <a className="underline" href={sources.assessment}>רשות המסים — שומה עצמית למס שבח</a>. ההנחיות העירוניות מתייחסות לתל אביב־יפו; בדקו את השירות המקומי ואת הוראות הדין החלות בנכס שלכם.</p>
        </section>
        <aside className="mb-8 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed">מידע כללי בלבד, שאינו ייעוץ מס, ייעוץ משפטי או ייעוץ משכנתאות, ואינו חוות דעת שמאית. לפני עסקה או הליך יש להתייעץ עם עורך דין ושמאי מקרקעין, ועם רואה חשבון או איש מקצוע בתחום המשכנתאות לפי הצורך והנסיבות.</aside>
        <AuthorBox />
      </article>
    </main>
  );
}
