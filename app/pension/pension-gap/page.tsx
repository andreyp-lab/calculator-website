import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/pension-gap';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'פער פנסיוני בדוח: איך בודקים את אומדן הקצבה';
const DESCRIPTION = 'מה יכול להסביר פער בין הציפייה לפנסיה לבין האומדן בדוח? בודקים יתרה, הנחות, חשבונות והפקדות, בלי להבטיח קצבה ובלי להמליץ על מוצר או השקעה.';
const sources = [
  { title: 'רשות שוק ההון — דוח שנתי ורבעוני לעמיתים ולמבוטחים: שדות הקצבה והנחות האומדן, נוסח 2020', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/r_2020-9-22/he/2020-9-22.pdf' },
  { title: 'רשות שוק ההון — שירות איתור חסכונות פנסיוניים ומגבלות תוצאות החיפוש', url: 'https://www.gov.il/he/service/pension_savings_search' },
  { title: 'ביטוח לאומי — מחשבון לבדיקת זכאות וחישוב קצבת אזרח ותיק', url: 'https://www.btl.gov.il/benefits/old_age/Pages/BdikatZacautZikna.aspx' },
  { title: 'רשות שוק ההון — עדכון זכויות וחובות בקרן חדשה מקיפה: השלכות משיכת כספים, מאי 2025', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-22/he/instructions_regarding_the_rights_and_obligations_of_members_in_the_regulations_of_a_new_pension_fund.pdf' },
];
const faqs = [
  { question: 'האם הקצבה שמופיעה בדוח היא הסכום שאקבל בפרישה?', answer: 'זהו אומדן המבוסס על יתרה והנחות חישוב, כפי שמתואר בהוראות הדיווח של הרשות. בקשו מהגוף המנהל להסביר אילו הנחות שימשו בדוח שלכם ומה כלול בו. אין באומדן התחייבות לסכום עתידי.' },
  { question: 'האם פער לעומת השכר הנוכחי מוכיח שחסרות הפקדות?', answer: 'לא ניתן להסיק זאת מההשוואה לבדה. שכר נוכחי, יתרת חיסכון ואומדן קצבה הם נתונים שונים. חוסר בהפקדה בודקים לפי תלושים ופירוט קליטה; את האומדן בודקים לפי הנחותיו והחשבונות הכלולים בו.' },
  { question: 'האם אפשר לחבר אומדנים מכל הדוחות?', answer: 'לפני ריכוז הסכומים צריך לבדוק זהות חשבון, מועדי דוחות, גיל חישוב והנחות. יש לברר גם אם סכום הועבר בין חשבונות או כבר נכלל בריכוז אחר. רשימה שאינה מתואמת עלולה לספור אותו חיסכון שוב.' },
  { question: 'האם מוסיפים לדוח הפנסיה קצבת אזרח ותיק אוטומטית?', answer: 'הזכאות בביטוח הלאומי נבדקת בנפרד. השתמשו במחשבון הרשמי לפי הנתונים האישיים וקראו את מגבלותיו. הביטוח הלאומי מבהיר שהזכאות נקבעת בידי פקיד הסניף; אין לראות בתוצאת המחשבון אישור לתשלום.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: TITLE, description: DESCRIPTION, alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
});

export default function PensionGapPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24', author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: sources.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${URL}#faq`, mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: 'פער פנסיוני בדוח', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: 'פער פנסיוני בדוח' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מבררים מה עומד מאחורי האומדן לפני שמסיקים שהחיסכון אינו מספיק.</p>
          <p className="mt-4 text-sm text-ink/70">בדיקת מקורות ועדכון: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>פער פנסיוני שמתגלה בקריאת דוח דורש קודם בירור של הנתונים: איזו יתרה נכללה, לאיזה גיל חושבה הקצבה, אילו הנחות שימשו והאם קיימים חשבונות נוספים. <a className="underline" href={sources[0].url}>הוראות הדיווח של הרשות</a> מתארות אומדן המבוסס על יתרה במועד הדוח. אין להשוות אותו לשכר או לתקציב עתידי בלי להבין את בסיסו, ואין לראות בו הבטחה לקצבה.</p>
        </section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, השקעות, מס או משפטי. אין המלצה על מוצר, קרן או מסלול ואין הבטחת תשואה או סכום עתידי. המדריך מסייע לארגן בירור ואינו מחשב חיסכון דרוש או קצבה אישית.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מגדירים איזה פער מנסים להסביר</h2>
          <p>כתבו מה עורר את השאלה: קצבה שנראית נמוכה מהצפוי, ירידה לעומת דוח קודם, או סכום שאינו תואם את ההפקדות שהכרתם. לכל שאלה דרושים מסמכים אחרים. המדריך מתמקד בבדיקת הנתונים שבדוח; מיפוי הוצאות והכנסות של משק הבית מופיע בנפרד ב<Link href="/investments/retirement">מדריך תכנון הפרישה</Link>. הבחנה זו מאפשרת לנסח פנייה שאפשר לענות עליה באמצעות אסמכתאות.</p>
          <p>רכזו דוח מלא ועדכני מכל גוף מוכר, ולא רק צילום של שורת הקצבה. רשמו ליד כל מסמך את תקופת הדיווח, מספר החשבון וסוג המוצר. אם התקבל גם סיכום באפליקציה, שמרו אותו בנפרד ובקשו הסבר להבדלים בינו לבין הדוח. התצוגות עשויות להתייחס למועדים או לריכוזי נתונים שונים; יש לבדוק זאת לפני שמפרשים פער כתוצאה כספית.</p>
          <h2>קוראים את ההנחות שמתחת לקצבה</h2>
          <p>ב<a href={sources[0].url}>מסגרת הדיווח הרשמית</a> אומדן הקצבה בקרן פנסיה חדשה מחושב מהיתרה שנצברה במועד הדוח ובהנחה שלא יהיו הפקדות נוספות. אל תחליפו את הערות הדוח בתשואה שבחרתם בעצמכם. תחזית נפרדת הכוללת הפקדות עתידיות אינה אותו נתון; יש לבדוק את הנחותיה לפני השוואה. בקשו מהקרן לפרט גם את גיל החישוב ואת אופן הטיפול בדמי הניהול. אין כאן שיעור תשואה להמחשה או נוסחת קצבה.</p>
          <p>קראו גם אם הסכום מוצג לפני מס ומהי משמעות הערכים הכספיים שבהם הוא נקוב. כאשר התשובה אינה כתובה בבירור, סמנו אותה כשאלה פתוחה. השוואה להכנסה פנויה מחייבת בסיס מתאים ובדיקת מס אישית. אין להפוך אומדן לסכום נטו באמצעות שיעור מס כללי, ואין לחלק יתרה במקדם אחיד שלא אושר לגבי המוצר והנתונים האישיים.</p>
          <h2>מבחינים בין חיסכון, הפקדות ותשלומי ביטוח</h2>
          <p>הכינו רשימת תנועות מתוך הדוח: יתרה בתחילת התקופה, הפקדות, העברות, משיכות, עלויות ויתרה בסופה, ככל שהן מופיעות. מטרת הרשימה היא להבין אילו מסמכים מסבירים את השינוי. אם היתרה השתנתה, אל תייחסו את כל ההפרש לתשואה או לדמי ניהול בלי פירוט. בקשו מהגוף המנהל להסביר שורה לא מוכרת ואת שיוכה לחשבון.</p>
          <p>כאשר החשש הוא להפקדה חסרה, השוו את חודשי השכר לפירוט הקליטה והמשיכו ל<Link href="/pension/mandatory-employee">בדיקת הפקדות לשכירים</Link>. אם השאלה נוגעת לסכום המופיע במקרה נכות או פטירה, עברו ל<Link href="/pension/insurance-cover">מדריך הכיסוי הביטוחי</Link>. סכומי ביטוח וקצבת זקנה משרתים בדיקות שונות, ולכן אין להכניס את כולם לאותו אומדן הכנסה מפרישה.</p>
          <h2>בודקים אם תמונת החשבונות מלאה</h2>
          <p>לחשבון שאבד עמו הקשר אפשר להיעזר ב<a href={sources[1].url}>מנוע האיתור של רשות שוק ההון</a>. דף השירות מבהיר שהתוצאה מצביעה על אפשרות לקיום חיסכון לא פעיל; הפרטים הקובעים נמצאים בגוף המנהל. במדריך <Link href="/pension/inactive-fund">קרן פנסיה לא פעילה</Link> מוסבר איך ממשיכים את הבירור. אין להוסיף לריכוז סכום על בסיס עצם הופעת שם חברה בתוצאת החיפוש.</p>
          <p>אם כספים הועברו בין גופים, השוו את מסמכי ההעברה בשני הצדדים. בדקו שהיתרה הישנה לא נספרה לצד היתרה שקלטה אותה, ושהאומדן אינו מופיע גם בדוח חשבון וגם בריכוז כולל. שמרו את הקישור בין כל סכום למסמך שממנו נלקח. כך אפשר לעדכן נתון שגוי בלי לאבד את ההסבר לשינוי בריכוז כולו.</p>
          <h2>מפרידים קצבת אזרח ותיק מהאומדן בקרן</h2>
          <p><a href={sources[2].url}>מחשבון הביטוח הלאומי</a> מאפשר בדיקה נפרדת של זכאות וקצבת אזרח ותיק ומציין שההכרעה היא בידי פקיד הסניף. שמרו תוצאת בדיקה עם ההנחות שלה ואל תציגו אותה כקצבה מאושרת. למועדי הזכאות הפנו ל<Link href="/pension/retirement-age">מדריך גיל הפרישה</Link>; המועד המופיע בדוח הקרן אינו מאשר תחילת תשלום מכל מקור אחר.</p>
          <h2>מה מעבירים לבדיקה מקצועית?</h2>
          <p>בסיום הכינו ריכוז חשבונות, הערות האומדן ורשימת פערים עם תשובות הגופים. <a href={sources[3].url}>עדכון הרשות ממאי 2025</a> עוסק בהשלכות משיכות על קצבאות; לפני פעולה בקשו הסבר אישי. המדריך אינו מציע הגדלת סיכון, מעבר קרן או משיכה כפתרון לפער. תחילה נדרש לברר אם הפער נובע ממידע חסר, מהנחת חישוב או מצורך בתכנון אישי.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. יש לקרוא את הדוח האישי והערותיו; מסמך המסגרת אינו תחזית לקצבה שלכם.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מרכז מקורות רשמיים לבירור נתוני הדוח ואינו אישור של תחזית פנסיונית. החלטות פנסיוניות ומיסוי דורשים בדיקה מקצועית אישית." />
      </div>
    </article>
  );
}
