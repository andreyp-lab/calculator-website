import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/mandatory-employee';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = "פנסיה חובה לשכירים: הפקדות, שכר מבוטח ובדיקת התלוש";
const DESCRIPTION = "מדריך לבדיקת הפקדות פנסיה לשכירים: חלק העובד והמעסיק, בסיס השכר, קליטת הכספים והסדרים מיוחדים. מקורות ממשלתיים ורשימת מסמכים לבירור.";
const sources = [
  {
    "title": "משרד העבודה — הזכות לביטוח פנסיוני: מועד העברת הכספים",
    "url": "https://www.gov.il/he/pages/pension-insurance?chapterIndex=5"
  },
  {
    "title": "משרד העבודה — שיעור ההפרשות לפנסיה והשכר המבוטח",
    "url": "https://www.gov.il/he/pages/pension-insurance?chapterIndex=3"
  },
  {
    "title": "משרד העבודה — הפרשות לפיצויי פיטורים וצווי ההרחבה המצורפים",
    "url": "https://www.gov.il/he/pages/provisions-for-severance-pay?chapterIndex=1"
  },
  {
    "title": "משרד האוצר — פנסיה צוברת: ההבדלים בין סוגי המוצרים",
    "url": "https://www.gov.il/he/pages/cumulative-pension?chapterIndex=1"
  },
  {
    "title": "צו ההרחבה לפנסיית חובה — תחילת זכאות והפקדה ראשונה, סעיף 6(ה)",
    "url": "https://www.gov.il/BlobFolder/guide/labor-wage/he/workers-rights_working-conditions_pension_H096.pdf"
  }
];
const faqs = [
  {
    "question": "מהם שיעורי הבסיס של פנסיית החובה?",
    "answer": "במדריך משרד העבודה מתוארים, החל משנת 2017, תגמולי עובד של 6%, תגמולי מעסיק של 6.5% והפקדת מעסיק לפיצויים של 6%. אלה שיעורי בסיס לבירור, ולא קביעה שכל השכר או כל הסדר אישי מחושבים כך. הסדר מיטיב וסוג המוצר דורשים בדיקה."
  },
  {
    "question": "האם שורה בתלוש מוכיחה שהכסף הגיע לקרן?",
    "answer": "לא ניתן לקבוע זאת מהתלוש בלבד. יש להשוות את הניכוי ואת הפקדות המעסיק לפירוט הקליטה בחשבון הפנסיוני, לפי חודש השכר והרכיב. כשיש פער, בקשו מהשכר ומהגוף המנהל הסבר מתועד."
  },
  {
    "question": "האם ההפקדות מחושבות תמיד מכל הברוטו?",
    "answer": "אין לקבוע זאת בלי לזהות את השכר המבוטח ואת ההסדר החל. בקשו פירוט של רכיבי השכר ובסיס ההפקדה, ובדקו את החוזה, צו ההרחבה וההסכם הרלוונטי. סך הברוטו לבדו אינו מפת זכאות."
  },
  {
    "question": "האם הפקדה לפיצויים מסיימת כל התחשבנות בעזיבה?",
    "answer": "אין להסיק זאת מההפקדה בלבד. תחולת ההסדר, השכר והתקופות שכוסו ושאלת ההשלמה דורשים בדיקה נפרדת. העמוד אינו קובע זכאות לפיצויים או נותן הוראת משיכה."
  }
];


export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function MandatoryEmployeePensionPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${URL}#article`,
        headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL,
        inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24',
        author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' },
        publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
        citation: sources.map((source) => source.url),
      },
      {
        '@type': 'FAQPage', '@id': `${URL}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question', name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: "פנסיה חובה לשכירים", url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: "פנסיה חובה לשכירים" }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">איך מחברים בין ההסכם, תלוש השכר והכספים שנקלטו בחיסכון.</p>
          <p className="mt-4 text-sm text-ink/70">תאריך בדיקת מקורות: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>בדיקת פנסיה חובה לשכיר מתחילה בהסדר החל ובשכר המבוטח, ומסתיימת בהשוואה להפקדות שנקלטו בפועל. <a className="underline" href={sources[1].url}>משרד העבודה מפרט שיעורי בסיס</a> של 6% עובד, 6.5% תגמולי מעסיק ו־6% לפיצויים, החל משנת 2017. אין להסיק מהשיעורים לבדם מתי מתחילה הזכאות או מהו בסיס השכר האישי. <a className="underline" href={sources[2].url}>הצווים וההסדר הרלוונטי</a> נדרשים להשלמת הבדיקה.</p>
        </section>
        <aside aria-label="הבהרה פנסיונית ומשפטית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, משפטי, מס או השקעות. אין בו המלצה על מוצר, משיכה, העברה או מסלול השקעה, ואין בו קביעת זכאות אישית. היישום דורש בדיקת מסמכים עם בעל מקצוע מתאים; לא מוצג כאן אישור של יועץ פנסיוני או עורך דין.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>מה בודקים לפני חישוב האחוזים?</h2>
          <p>רכזו את חוזה העבודה, נספח התנאים הפנסיוניים, תאריך תחילת ההעסקה והמידע על ביטוח קודם. שאלו את מחלקת השכר מהו המקור שלפיו היא פועלת: צו ההרחבה הכללי, הסכם ענפי, הסכם קיבוצי או תנאי חוזה. <a href={sources[2].url}>משרד העבודה</a> מציין כי לצד זכויות המינימום עשויות לחול זכויות נוספות מכוח הסכמים וצווים. לכן אין להחליף תנאי אישי בטבלה כללית בלי לבדוק את תחולתה.</p>
          <p>אם זו עבודה חדשה, הפרידו בין מועד תחילת הזכאות לבין מועד התשלום הראשון. לפי <a href={sources[4].url}>סעיף 6(ה) לצו ההרחבה</a>, עובד שאינו מבוטח בתחילת העבודה זכאי ככלל לאחר שישה חודשי עבודה; עובד שמתקבל כשהוא מבוטח זכאי מהיום הראשון, וההפקדה מבוצעת לאחר שלושה חודשי עבודה או בתום שנת המס — המוקדם — רטרואקטיבית מתחילת העבודה. מצב חשבון קודם שאינו פעיל והסדר מיטיב דורשים בדיקה פרטנית.</p>
          <h2>מפרידים בין רכיבי ההפקדה</h2>
          <p>לפי <a href={sources[1].url}>מדריך משרד העבודה לשיעורי ההפרשות</a>, שיעורי הבסיס שהונהגו משנת 2017 כוללים תגמולי עובד, תגמולי מעסיק ופיצויים במימון המעסיק. הבדיקה נעשית לכל רכיב בנפרד: מה נוכה מהעובד, מה נוסף על ידי המעסיק ומה סווג לפיצויים. אין להשוות את סכום הניכוי מהנטו לכל הסכום שהתקבל בחיסכון, משום שהמעסיק מממן גם רכיבים שאינם ניכוי משכר העובד.</p>
          <p>אותו פרסום מציין גם הסדרים עם שיעורי הפקדה גבוהים יותר. הנתונים בעמוד הם נקודת השוואה כללית שנבדקה באוקטובר 2026, ולא הוראה לשנות שיעור בתלוש. כשמוצג שיעור אחר, בקשו את המקור שלו ואת חלוקת העלויות. בדיקה פרטנית נדרשת גם כאשר תנאי המוצר כוללים כיסוי ביטוחי, כדי להבין מה נזקף לכל רכיב ולא להניח שכל התשלום הוא חיסכון בלבד.</p>
          <h2>השכר המבוטח הוא שאלה נפרדת</h2>
          <p>פתחו את התלוש וחפשו את בסיס ההפקדה, לצד פירוט רכיבי הברוטו. הכינו רשימה של שכר יסוד, תוספות ותשלומים משתנים, ובקשו הסבר מה נכלל בבסיס ומכוח איזה הסדר. זו דרך לארגן בירור; אין כאן הכרעה שכל רכיב מסוים חייב או פטור מהפקדה. אם הייתה העלאת שכר או השתנה היקף המשרה, השוו גם תלושים מלפני השינוי ואחריו.</p>
          <p>את האחוז מחשבים לצורך בדיקת התאמה רק לאחר שמזהים את בסיסו. תוצאה הנראית נמוכה ביחס לברוטו עשויה לשקף בסיס שונה, אך היא יכולה גם להצביע על טעות. אין לבחור בהסבר בלי מסמך. אפשר להיעזר ב<Link href="/employee-rights/salary-deductions">מדריך הניכויים בתלוש</Link> לזיהוי השורות, ולשמור ליד כל נתון את התלוש או ההסכם שממנו נלקח.</p>
          <h2>מתי הכספים צריכים להגיע?</h2>
          <p><a href={sources[0].url}>משרד העבודה קובע במדריך להעברת הכספים</a> שהמעסיק יעביר את חלקו ואת חלק העובדים במועד המוקדם מבין שבעה ימי עסקים מתשלום השכר לבין 15 ימים מתום החודש שבעדו הופרשו הכספים. זהו כלל העברה, כפי שנבדק ביום 24.10.2026. הוא אינו מחליף את הבדיקה הנפרדת של תחילת הזכאות אצל עובד חדש.</p>
          <p>השוו פירוט הפקדות מהגוף המנהל לתלוש לפי חודש השכר, שם המעסיק והרכיבים. אם התשלום אינו מופיע, בקשו מהשכר אסמכתת העברה ומהגוף המנהל תשובה אם הכסף התקבל ושויך לחשבון. תשלום שנשלח ותשלום שנקלט אינם אותה ראיה. תעדו גם תיקונים והחזרים, כדי שלא לספור הפקדה מתקנת כהפקדה נוספת לאותו חודש.</p>
          <h2>מה עושים כשנמצא פער?</h2>
          <p>הכינו פנייה קצרה עם החודש הרלוונטי, הסכום בתלוש והנתון בדוח. בקשו תשובה שמבהירה אם מדובר בחוסר תשלום, בבעיה בפרטי הזיהוי או בפער בשיוך. שמרו מספר פנייה ותשובה כתובה, ובדקו את הדוח המעודכן אחרי תיקון. אין בעמוד חישוב פיצוי, ריבית או מסלול משפטי מחייב; אם המחלוקת נמשכת, העבירו את התיעוד לבחינה מקצועית.</p>
          <h2>הפקדה, כיסוי ופיצויים</h2>
          <p><a href={sources[3].url}>מדריך משרד האוצר לפנסיה צוברת</a> מסביר שקיימים מוצרים שונים ושנדרשת בחינת התאמה אישית. דוח הפקדות אינו לבדו תשובה לשאלת הכיסוי הביטוחי או הקצבה העתידית. בסיום עבודה יש לבדוק בנפרד גם את רכיב הפיצויים ואת תחולת <Link href="/employee-rights/section-14">סעיף 14</Link>. למיפוי החשבון כולו עברו ל<Link href="/insurance/pension">מדריך בדיקת הפנסיה</Link>; החלטות אישיות מצריכות ייעוץ מתאים.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => (
            <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4">
              <summary className="cursor-pointer font-bold">{faq.question}</summary>
              <p className="mt-3 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">
            {sources.map((source) => (
              <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>
            ))}
          </ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. הדין ותנאי ההסדר האישי גוברים על הסבר כללי; תאריך הבדיקה אינו אישור לזכאות.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מרכז מידע ממקורות רשמיים ואינו חוות דעת משפטית או ייעוץ פנסיוני. בחינת הזכאות, הכיסוי והמיסוי דורשת בעל מקצוע מתאים לפי העניין." />
      </div>
    </article>
  );
}
