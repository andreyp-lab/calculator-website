import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/job-change-continuity';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = "רציפות פנסיונית במעבר עבודה: הפקדות וכיסוי ביטוחי";
const DESCRIPTION = "מה בודקים בפנסיה בין עבודות: מועד ההפקדה האחרונה, מצב הכיסוי, מסמכים למעסיק החדש וקליטת התשלום. מדריך בירור המבוסס על מקורות רשמיים.";
const sources = [
  {
    "title": "רשות שוק ההון — הוראות לבחירת קופת גמל; המסגרת החוקית לבחירת העובד",
    "url": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1092/he/regulation_h_2016-9-8.pdf"
  },
  {
    "title": "רשות שוק ההון — הוראות זכויות וחובות בקרן פנסיה חדשה מקיפה, נספח התקנון: ארכת ביטוח והסדר ביטוח",
    "url": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1075/he/regulation_h_2016-3-4-appendixb.pdf"
  },
  {
    "title": "משרד העבודה — הזכות לביטוח פנסיוני: העברת הכספים לגוף הפנסיוני",
    "url": "https://www.gov.il/he/pages/pension-insurance?chapterIndex=5"
  },
  {
    "title": "רשות שוק ההון — עדכון הוראות זכויות וחובות עמיתים בקרן חדשה מקיפה, מאי 2025",
    "url": "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-22/he/instructions_regarding_the_rights_and_obligations_of_members_in_the_regulations_of_a_new_pension_fund.pdf"
  },
  {
    "title": "רשות שוק ההון — חיפוש סוכנים ויועצים פנסיוניים בעלי רישיון",
    "url": "https://www.gov.il/he/service/agents_and_consultants_search"
  },
  {
    "title": "צו ההרחבה לפנסיית חובה — תחילת זכאות והפקדה ראשונה, סעיף 6(ה)",
    "url": "https://www.gov.il/BlobFolder/guide/labor-wage/he/workers-rights_working-conditions_pension_H096.pdf"
  }
];
const faqs = [
  {
    "question": "האם תחילת עבודה חדשה מוכיחה שהכיסוי הפנסיוני נשמר?",
    "answer": "לא ניתן לקבוע זאת מעצם תחילת העבודה. צריך לבדוק מול הגוף המנהל מהו מצב הכיסוי ובאילו מועדים נקלטו ההפקדות. תאריך החוזה, חודש השכר ותאריך הקליטה הם נתונים שונים שצריך לחבר בבדיקה האישית."
  },
  {
    "question": "מה ההבדל בין ארכת ביטוח להסדר ביטוח?",
    "answer": "בקרן פנסיה חדשה מקיפה, התקנון קובע ככלל ארכת ביטוח של חמישה חודשים, בכפוף לתנאים ולאפשרות הפסקה מוקדמת, והסדר ביטוח צריך להיעשות עד תום הארכה. יש לבקש מהקרן את התקנון החל ואת מועד הסיום האישי; אין בכך המלצה לבחור בהסדר."
  },
  {
    "question": "האם הפניית הפקדות חדשות מעבירה גם את החיסכון הישן?",
    "answer": "אין להסיק שהיתרה הועברה רק מפני שנמסרו למעסיק פרטי הפקדה. בדקו בנפרד אם ניתנה בקשת העברה ומה נקלט בכל חשבון. כל שינוי מחייב להבין על איזה חשבון ועל אילו כספים הוא חל."
  },
  {
    "question": "מה עושים כשמגלים פער אחרי המעבר?",
    "answer": "רכזו תלושים, אסמכתאות תשלום ותשובות מהגוף המנהל. בקשו בירור נפרד של החוב הכספי ושל מצב הביטוח בתקופה החסרה. אם מדובר במחלוקת על זכויות או באירוע ביטוחי, נדרשת בדיקה מקצועית של המסמכים והדין החל."
  }
];


export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function JobChangeContinuityPage() {
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
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: "רציפות במעבר עבודה", url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: "רציפות במעבר עבודה" }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מסיימים העסקה עם תיעוד מסודר, ומוודאים מה קרה בחשבון בתקופת המעבר.</p>
          <p className="mt-4 text-sm text-ink/70">תאריך בדיקת מקורות: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>במעבר עבודה בדקו בנפרד את ההפקדות ואת הכיסוי הביטוחי. מסרו למעסיק החדש פרטי חשבון מאומתים, ובקשו מהגוף המנהל אישור על מצב הביטוח ומועדיו. <a className="underline" href={sources[1].url}>הוראות התקנון לקרן חדשה מקיפה</a> כוללות מנגנונים של ארכת ביטוח והסדר ביטוח; תחולתם האישית דורשת בדיקה. הבטחה להפקדה בעתיד, או רישום בתלוש, אינם מספיקים כדי לקבוע שהכיסוי בתקופת המעבר נשמר.</p>
        </section>
        <aside aria-label="הבהרה פנסיונית ומשפטית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, משפטי, מס או השקעות. אין בו המלצה על מוצר, משיכה, העברה או מסלול השקעה, ואין בו קביעת זכאות אישית. היישום דורש בדיקת מסמכים עם בעל מקצוע מתאים; לא מוצג כאן אישור של יועץ פנסיוני או עורך דין.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>לפני העזיבה: יוצרים תמונת מצב</h2>
          <p>הפיקו מהאזור האישי פירוט הפקדות עדכני ושמרו את התלושים האחרונים ואת נספח התנאים הפנסיוניים. רשמו מי הגוף המנהל, מהו מספר החשבון, איזה מעסיק מופיע בו ומהי ההפקדה האחרונה שנקלטה. המטרה היא להכין נקודת השוואה: אם תתגלה תקופה חסרה, תוכלו לזהות אם היא שייכת למעסיק הקודם, למעסיק החדש או לתהליך הקליטה בגוף המנהל.</p>
          <p>בקשו ממחלקת השכר הקודמת פירוט של ההפקדות שעוד נותר להעביר ושל החודשים שאליהם הן מתייחסות. אם נאמר שהכול הועבר, בקשו אסמכתה המתאימה לחשבון שלכם. זהו תיעוד לצורך בירור, ולא קביעה שהחובות שולמו. סיום ההעסקה והשלמת קליטת ההפקדות הם אירועים שצריך לתעד בנפרד, במיוחד כאשר התלוש האחרון כולל תיקוני שכר.</p>
          <h2>לרציפות ההפקדות ולכיסוי יש בדיקות שונות</h2>
          <p><a href={sources[1].url}>הוראות רשות שוק ההון לתקנון קרן חדשה מקיפה</a> עוסקות גם בארכת ביטוח ובהסדר ביטוח. לכן יתרה כספית בחשבון אינה לבדה תשובה לשאלה מהו הכיסוי בתקופה ללא הפקדות. בקשו מהקרן את התקנון התקף ואת מועד תחילת הכיסוי וסיומו במקרה שלכם, לרבות אופן מימון העלות והאם קיימים תנאים נוספים.</p>
          <p>בקרן פנסיה חדשה מקיפה, סעיפים 36–37 בתקנון שב<a href={sources[1].url}>מקור הרשמי</a> קובעים ככלל ארכת ביטוח של חמישה חודשים, בכפוף לתנאים ולהפסקה מוקדמת במקרים המפורטים שם; הסדר ביטוח צריך להיעשות עד תום הארכה. אין להעתיק תקופה זו לפוליסה או למוצר אחר. בקשו מהגוף המנהל את מועד סיום הכיסוי האישי ואת התקנון החל, ופעלו לפני המועד שהוא מאשר.</p>
          <h2>מה לשאול את הגוף המנהל?</h2>
          <ul>
          <li>מהו המועד שבו החשבון חדל לקבל הפקדות שוטפות, ולאילו חודשי שכר יוחסו התשלומים האחרונים?</li>
          <li>אילו כיסויים קיימים כעת, ומהו המקור לקביעה בדבר תחולתם בתקופת המעבר?</li>
          <li>האם נדרש טיפול כדי לשמור על הביטוח, ומהם תנאי האפשרויות שהגוף מציג?</li>
          <li>כיצד מתקבל אישור כתוב לאחר הסדרה, ואילו פרטים יופיעו בו?</li>
          <li>מה נדרש לבדוק בעת חידוש ההפקדות, לרבות תנאי כיסוי או בירור רפואי אם הם רלוונטיים?</li>
          </ul>
          <p>הציגו את התשובות לבעל המקצוע עם המסמכים שעליהם הן נשענות. שירות <a href={sources[4].url}>איתור בעלי הרישיון של רשות שוק ההון</a> מאפשר לבדוק בעלי רישיון בתחום. התאימו את סוג הבירור לשאלה: כיסוי ומוצר מצריכים מומחיות פנסיונית; מחלוקת עם מעסיק עשויה להצריך ייעוץ משפטי. בדיקת רישיון אינה קובעת איזה מוצר מתאים לכם.</p>
          <h2>בקליטה לעבודה: מאמתים את פרטי ההפקדה</h2>
          <p><a href={sources[0].url}>המסגרת החוקית שמביאה רשות שוק ההון</a> מכירה בבחירת העובד בקופת גמל, בכפוף למגבלות הדין וההצטרפות. העבירו למעסיק החדש פרטים מתוך אישור עדכני של הגוף המנהל ובקשו אישור קבלה. אל תסתפקו בשם מסחרי: שם מוצר, מספר קופה ומספר חשבון יכולים להתייחס לנתונים שונים, וטעות בהעתקה מקשה על איתור התשלום.</p>
          <p>לפי <a href={sources[5].url}>סעיף 6(ה) לצו ההרחבה</a>, עובד שאינו מבוטח בתחילת העבודה זכאי ככלל לאחר שישה חודשי עבודה; עובד שמתקבל כשהוא מבוטח זכאי מהיום הראשון, וההפקדה מבוצעת לאחר שלושה חודשי עבודה או בתום שנת המס — המוקדם — רטרואקטיבית מתחילת העבודה. מצב חשבון קודם שאינו פעיל והסדר מיטיב מחייבים בדיקה פרטנית. ראו גם <Link href="/pension/mandatory-employee">פנסיה חובה לשכירים</Link>.</p>
          <h2>אחרי התלוש הראשון: סוגרים את הבדיקה</h2>
          <p><a href={sources[2].url}>מדריך משרד העבודה</a> מפריד את העברת הכספים לגוף הפנסיוני מתשלום השכר. בדקו את החודשים שאליהם מתייחסת ההפקדה החדשה ואת חלוקתה לרכיבים, מול התלוש ופרטי המעסיק. אם לא נמצאה קליטה, בקשו בירור משני הצדדים. אם הועבר תיקון עבור תקופת עבר, בקשו גם תשובה מפורשת מהקרן כיצד היא מתייחסת למצב הביטוח בתקופה הזאת.</p>
          <h2>הפקדה חדשה, העברה ומשיכה</h2>
          <p>מסירת יעד להפקדות המעסיק אינה מסמך המאשר מה נעשה ביתרה הישנה. אם הוצע שינוי, בקשו פירוט של הפעולה ושל החשבונות שעליהם היא חלה. <a href={sources[3].url}>עדכון רשות שוק ההון ממאי 2025</a> מתייחס להשפעות משיכת כספים על קצבאות וכיסויים. כאן אין המלצה להעביר או למשוך, והחלטה אישית דורשת בחינה פנסיונית ומיסויית.</p>
          <p>לבדיקת חשבון שאיבדתם קשר עמו עברו ל<Link href="/pension/inactive-fund">מדריך קרן לא פעילה</Link>. את שאלת הפיצויים בסיום העבודה בודקים בנפרד באמצעות מסמכי <Link href="/employee-rights/section-14">סעיף 14</Link> וגמר החשבון. כך ניתן להעביר לבירור מקצועי תיק שמציג מה נקלט, מה אושר ומה עדיין פתוח, בלי לערבב בין יתרה בחיסכון, ביטוח וחבות המעסיק.</p>
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
