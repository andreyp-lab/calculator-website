import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/insurance-cover';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'כיסוי ביטוחי בקרן פנסיה: נכות, שאירים ובדיקת הדוח';
const DESCRIPTION = 'איך בודקים כיסוי לנכות ולשאירים בקרן פנסיה: השכר הקובע, מסלול הביטוח, מצב משפחתי והמסמכים לבירור. מקורות רשות שוק ההון, ללא המלצת מסלול.';
const sources = [
  { title: 'רשות שוק ההון — נספח התקנון לקרן פנסיה חדשה מקיפה: הגדרות וכיסויים ביטוחיים', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1075/he/regulation_h_2016-3-4-appendixb.pdf' },
  { title: 'רשות שוק ההון — דוח שנתי ורבעוני לעמיתים ולמבוטחים, נוסח תיקון מדצמבר 2020', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/r_2020-9-22/he/2020-9-22.pdf' },
  { title: 'רשות שוק ההון — עדכון זכויות וחובות עמיתים בקרן חדשה מקיפה, מאי 2025', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-22/he/instructions_regarding_the_rights_and_obligations_of_members_in_the_regulations_of_a_new_pension_fund.pdf' },
  { title: 'רשות שוק ההון — איתור סוכנים, יועצים ומשווקים פנסיוניים בעלי רישיון', url: 'https://www.gov.il/he/service/agents_and_consultants_search' },
];
const faqs = [
  { question: 'האם יתרה בקרן מוכיחה שקיים כיסוי ביטוחי?', answer: 'יתרה מציגה חיסכון בחשבון. את מצב הביטוח צריך לברר בנפרד לפי התקנון, מסלול הביטוח ומעמד העמית. בקשו מהקרן אישור עדכני המתייחס למועד הבדיקה, במיוחד אם ההפקדות הופסקו או חודשו.' },
  { question: 'האם השכר הקובע לביטוח זהה לברוטו בתלוש?', answer: 'אין להניח זהות. בדוח הפנסיה מוצגת משכורת קובעת לנכות ולשאירים, המחושבת לפי התקנון. השוו אותה לנתוני השכר וההפקדות, ובקשו מהקרן הסבר אם יש פער. המדריך אינו קובע את בסיס השכר האישי.' },
  { question: 'האם רישום מוטב קובע מי יקבל קצבת שאירים?', answer: 'לשאירים ולמוטבים יש מעמד שונה בתקנון. אין להסיק מרישום מוטב בלבד שקיימת זכאות לקצבת שאירים. בקשו בירור לפי ההגדרות, המצב המשפחתי ומצב הביטוח, והפרידו בין קצבה לבין תשלום מתוך היתרה.' },
  { question: 'האם שינוי במסלול ההשקעה מעדכן גם את הביטוח?', answer: 'מסלול השקעה ומסלול ביטוח הם שדות נפרדים בדוח. לאחר כל בקשת שינוי בדקו מה בדיוק אושר, על איזה רכיב הוא חל וממתי. אין כאן המלצה לשינוי מסלול או להקטנת כיסוי.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: TITLE, description: DESCRIPTION, alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
});

export default function PensionInsuranceCoverPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24', author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: sources.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${URL}#faq`, mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: 'כיסוי ביטוחי בפנסיה', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: 'כיסוי ביטוחי בפנסיה' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">קוראים את נתוני הביטוח לצד התקנון והאישורים האישיים.</p>
          <p className="mt-4 text-sm text-ink/70">בדיקת מקורות ועדכון: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>לבדיקת הכיסוי הביטוחי בפנסיה אספו דוח מפורט, אישור מסלול ביטוח ותקנון תקף. בדקו בנפרד נכות, שאירים והשכר הקובע לכל כיסוי. <a className="underline" href={sources[1].url}>מסגרת הדיווח של רשות שוק ההון</a> מבחינה בין נתונים אלה לבין החיסכון וקצבת הזקנה הצפויה. סכום בדוח הוא נקודת מוצא לבירור; הזכאות בפועל תלויה בתנאי התקנון ובנסיבות האישיות.</p>
        </section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, השקעות, מס או משפטי. אין המלצה על מוצר, קרן או מסלול, ואין הבטחת תשואה, סכום עתידי או זכאות ביטוחית. החלטה אישית דורשת בדיקת מסמכים עם בעל מקצוע מתאים.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מזהים איזה מוצר ואיזה ביטוח בודקים</h2>
          <p>התחילו בשם המלא של הקרן ובסוגה, כפי שהם מופיעים במסמך האישי. המדריך מתמקד בקרן פנסיה חדשה מקיפה ובמונחי הביטוח שלה. אין להחיל את ההסבר אוטומטית על ביטוח מנהלים, קרן ותיקה או קופת גמל. שמרו לצד הדוח את תאריך הפקתו ומספר החשבון, כדי שפנייה לקרן תעסוק בחשבון הנכון ובמצב שהיה בתאריך הרלוונטי.</p>
          <p><a href={sources[0].url}>נספח התקנון שפרסמה הרשות</a> מפריד בין הגדרות, מסלולי ביטוח ותנאים לקבלת קצבאות. זהו מקור למסגרת הבדיקה; בקשו מהקרן גם את התקנון המעודכן החל עליכם ואת אישורי ההצטרפות והשינויים. אל תסיקו משם שיווקי של מסלול מה בדיוק נכלל בו, ואל תחליפו אישור אישי בתיאור כללי של המוצר.</p>
          <h2>נכות: מה מופיע לצד השכר הקובע?</h2>
          <p>בדקו בדוח את המשכורת הקובעת לנכות ולשאירים ואת נתוני קצבת הנכות. <a href={sources[1].url}>הוראות הדיווח</a> מתייחסות גם לרכיב של שחרור מתשלום הפקדות במקרה נכות. בקשו הסבר נפרד לכל שורה: מהו בסיס החישוב, לאיזה מועד הנתון מתייחס והאם הוא מציג תשלום לעמית או הפקדה לחשבון. כך נמנעת השוואה בין רכיבים בעלי משמעות שונה.</p>
          <p>אם השכר בתלוש השתנה, הכינו רצף תלושים ופירוט הפקדות והציגו אותם לקרן. עצם העלאת השכר אינה מספיקה כדי לקבוע מהו הכיסוי המעודכן. בקשו הסבר מתועד לאופן חישוב השכר הקובע ולכל פער שמצאתם. לבירור הפקדות המעסיק עצמו הפנו את הבדיקה ל<Link href="/pension/mandatory-employee">מדריך פנסיה חובה לשכירים</Link>, שבו מפורטים מסמכי השכר הרלוונטיים.</p>
          <h2>שאירים: בודקים הגדרות ומצב משפחתי</h2>
          <p>ב<a href={sources[0].url}>תקנון הרשמי</a> קיימות הגדרות לשאירים והוראות לקצבאות במקרה פטירה. לפני שמפרשים סכום בדוח, בררו מי עשוי להיחשב שאיר בנסיבות שלכם, ועל אילו מסמכים נשענת הבדיקה. אין כאן קביעה שכל קרוב משפחה או כל אדם שנרשם כמוטב זכאי לאותה קצבה. שאלת הזכאות דורשת קריאה של ההגדרה החלה.</p>
          <p>כאשר חל שינוי משפחתי, בדקו אילו פרטים רשומים בקרן ואם קיימת בקשת ויתור קודמת על כיסוי. בקשו העתק של הבקשה ושל אישור הטיפול בה, ולא רק תשובה שהפרטים עודכנו במערכת. אין במדריך הנחיה לוותר על כיסוי או לחדש אותו בתנאי מסוים. המטרה היא לזהות מה רשום, מה אושר ואיזו שאלה נותרה פתוחה לבדיקה מקצועית.</p>
          <h2>אכשרה, חיתום וחריגים הם בירור אישי</h2>
          <p>המסגרת התקנונית כוללת הוראות על תקופת אכשרה וחיתום רפואי. אין בעמוד תקופה מספרית או הבטחה שמצב רפואי מסוים מכוסה. שאלו את הקרן מה חל על ההצטרפות, חידוש הביטוח או שינוי הכיסוי שלכם, ובקשו הפניה לסעיף ולמסמך ההחלטה. אם התקבלה החרגה, שמרו את נוסחה המלא ואת המועד שאליו היא מתייחסת.</p>
          <h2>רציפות ומשיכת כספים מצריכות בדיקה נוספת</h2>
          <p>כשמפסיקות הפקדות, עברו ל<Link href="/pension/job-change-continuity">מדריך הרציפות במעבר עבודה</Link> לבדיקת מצב הביטוח. חיסכון שנותר בקרן אינו תחליף לתשובה על הכיסוי. <a href={sources[2].url}>עדכון הרשות ממאי 2025</a> עוסק גם בהשלכות משיכת כספים על קצבאות וביידוע העמית. לפני פעולה בקשו פירוט אישי של ההשפעות; אין להסתפק בסכום שניתן למשיכה במסך החשבון.</p>
          <h2>מסיימים עם רשימת שאלות שניתן לבדוק</h2>
          <p>רכזו מסמך שבו מצוינים סוג הקרן, מסלול הביטוח, השכר הקובע, הכיסויים והאסמכתה לכל נתון. הפרידו בין תשובה מהקרן לבין הנחה שטרם אושרה, וציינו ליד כל שאלה מי אמור להשיב עליה. לקראת ייעוץ אפשר לבדוק את הרישיון ב<a href={sources[3].url}>שירות הרשמי של הרשות</a>. בדיקת רישיון אינה המלצה על בעל מקצוע או אישור להתאמת מוצר.</p>
          <p>בפנייה לקרן אפשר לצטט את שם השדה שאינו ברור ולצרף את עמוד הדוח הרלוונטי בערוץ שהקרן מעמידה לכך. בקשו שהתשובה תזהה את החשבון, את מועד הבדיקה ואת המסמך שעליו היא נשענת. אם התקבל רק הסבר כללי, חזרו לשאלה האישית שנותרה ללא מענה. שמירת רצף הפניות מסייעת לבעל המקצוע להבין מה כבר נבדק ומה עוד צריך לברר.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. מסמכי המסגרת אינם תחליף לתקנון העדכני ולאישורי החשבון האישי.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מבוסס על מקורות רשמיים ואינו מוצג כבדיקה או אישור של יועץ פנסיוני. בירור כיסוי וזכאות דורש בעל מקצוע מתאים לפי העניין." />
      </div>
    </article>
  );
}
