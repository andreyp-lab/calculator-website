import { withPageSocialMetadata } from '@/lib/config/site-info';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const PATH = '/pension/default-funds';
const URL = `https://cheshbonai.co.il${PATH}`;
const TITLE = 'קרנות פנסיה נבחרות: ברירת מחדל ותנאי ההצטרפות';
const DESCRIPTION = 'הסבר על קרנות הפנסיה הנבחרות: תקופת ההליך, דמי הניהול, שיוך לפי ספרת ביקורת ובדיקת ההצטרפות. מקורות רשות שוק ההון בלבד, ללא המלצת קרן.';
const sources = [
  { title: 'רשות שוק ההון — תוצאות ההליך הרביעי לקביעת קרנות נבחרות, 19.9.2024; תקופה, דמי ניהול וחלופות', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2024-101/he/Results_of_the_fourth_procedure_for_determining_selected_funds_pdf.pdf' },
  { title: 'רשות שוק ההון — הבהרה סופית להליך הקרנות הנבחרות, 10.6.2025; תחולת מנגנון הצירוף', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2025-26/he/clarification_regarding_the_selected_funds_procedure_pdf.pdf' },
  { title: 'רשות שוק ההון — הוראות לעניין בחירת קופת גמל: המסגרת לבחירת העובד ולהסדר ברירת מחדל', url: 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1092/he/regulation_h_2016-9-8.pdf' },
  { title: 'רשות שוק ההון — מחשבון דמי ניהול להשוואת הצעות לפי נתונים אישיים', url: 'https://www.gov.il/he/service/management_fee_calculator' },
];
const fundRows = [
  ['אינפיניטי', '7, 8, 9'],
  ['מור', '4, 5, 6'],
  ['אלטשולר שחם', '2, 3'],
  ['מיטב', '0, 1'],
];
const faqs = [
  { question: 'מהי תקופת ההליך הנוכחי לקרנות נבחרות?', answer: 'בתוצאות ההליך הרביעי ובהבהרת הרשות נקבעה תקופה מיום 1.11.2024 ועד 31.10.2028. זו תקופת המעמד לפי ההליך, והיא שונה מתקופת תנאי דמי הניהול לעמית. הנתונים נבדקו ביום 24.10.2026.' },
  { question: 'האם ספרת הביקורת מונעת ממני לבחור קרן אחרת?', answer: 'המנגנון עוסק בצירוף במסגרת ברירת המחדל בתנאים שנקבעו. בחירה אישית של העובד היא מסלול בירור נפרד. אין להסיק שהצטרפות יזומה לקרן אחרת מקנה אוטומטית את תנאי ההליך; בקשו אישור הצטרפות ותנאים כתובים.' },
  { question: 'האם כל מעסיק חייב לפעול לפי טבלת הספרות?', answer: 'לפי הבהרת הרשות, מנגנון החלוקה חל מיום 1.6.2025 על מעסיק המעסיק 50 עובדים ומעלה, כשהעובד לא בחר קופה ולא נערך הליך תחרותי מתאים. למעסיק קטן יותר שהעביר הצהרה כנדרש נקבע הסדר אחר.' },
  { question: 'האם קרן נבחרת מבטיחה תשואה או התאמה אישית?', answer: 'המעמד בהליך אינו הבטחת תשואה או קצבה ואינו קביעה שהמוצר מתאים לכל חוסך. בדיקת דמי ניהול, כיסוי וזכויות דורשת מסמכים אישיים. העמוד מציג את מנגנון ההליך ואינו ממליץ על קרן או מסלול.' },
];

export const metadata: Metadata = withPageSocialMetadata({
  title: TITLE, description: DESCRIPTION, alternates: { canonical: URL },
  openGraph: { images: ['/opengraph-image'], title: TITLE, description: DESCRIPTION, url: URL, type: 'article', locale: 'he_IL' },
});

export default function PensionDefaultFundsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${URL}#article`, headline: TITLE, description: DESCRIPTION, mainEntityOfPage: URL, inLanguage: 'he-IL', datePublished: '2026-10-24', dateModified: '2026-10-24', author: { '@type': 'Person', name: 'אנדרי פלטונוב', url: 'https://cheshbonai.co.il/about' }, publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' }, citation: sources.map((source) => source.url) },
      { '@type': 'FAQPage', '@id': `${URL}#faq`, mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
  return (
    <article dir="rtl" className="bg-cream">
      <BreadcrumbSchema items={[{ name: 'דף הבית', url: '/' }, { name: 'מדריך פנסיה', url: '/insurance/pension' }, { name: 'קרנות נבחרות', url: PATH }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'מדריך פנסיה', href: '/insurance/pension' }, { label: 'קרנות נבחרות' }]} />
        <header className="my-8 border-b border-ink/15 pb-6">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">{TITLE}</h1>
          <p className="text-lg text-ink/75">מנגנון צירוף מוגדר דורש בדיקה של נסיבות ההצטרפות ושל התנאים שנקלטו.</p>
          <p className="mt-4 text-sm text-ink/70">בדיקת מקורות ועדכון: <time dateTime="2026-10-24">24.10.2026</time></p>
        </header>
        <section aria-label="תשובה מהירה" className="answer-box mb-8 border-r-4 border-gold bg-cream-2 p-5">
          <h2 className="mb-2 text-xl font-bold">תשובה מהירה</h2>
          <p>קרנות נבחרות הן קרנות שנקבעו בהליך רשות שוק ההון לצורך הסדר ברירת המחדל. <a className="underline" href={sources[0].url}>ההליך הנוכחי</a> חל מ־1.11.2024 עד 31.10.2028. כשלא נבחרה קופה ולא נערך הליך תחרותי מתאים, בודקים את מסלול הצירוף לפי הוראות הרשות, גודל המעסיק ומועד ההצטרפות. שם הקרן לבדו אינו מוכיח שתנאי ההליך חלים בחשבון, ואינו המלצה לבחירה בה.</p>
        </section>
        <aside aria-label="הבהרה מקצועית" className="mb-8 border border-ink/15 p-5 text-sm leading-relaxed">
          המידע כללי ואינו ייעוץ פנסיוני, השקעות, מס או משפטי. שמות הקרנות מובאים לתיאור ההליך בלבד. אין המלצה על מוצר, מסלול או קרן, ואין הבטחת תשואה, קצבה או סכום עתידי.
        </aside>
        <div className="prose prose-lg max-w-none leading-relaxed text-ink">
          <h2>ברירת מחדל ובחירה אישית הן בדיקות שונות</h2>
          <p><a href={sources[2].url}>הוראות הרשות לבחירת קופת גמל</a> מתארות את המסגרת לבחירת העובד ואת הצורך בהסדר כאשר לא בחר. תחילה בררו אם נמסרה בחירה למעסיק, אם התקבל אישור מהגוף המנהל ובאיזה מסלול צורפתם. אל תחליפו את המסמכים במסקנה המבוססת על שם הקרן בתלוש. המונח נבחרת מתאר מעמד במסגרת ההליך, ואינו ציון איכות אישי לחוסך.</p>
          <p>בקשו ממחלקת השכר לציין אם הופעלה ברירת מחדל של ההליך הארצי או קופה שנבחרה בהליך תחרותי אחר. שמרו גם את מועד מסירת הבחירה, אם הייתה, ואת אישור קבלתה. אלה מסמכי עבודה לבירור, ולא קביעה שהצטרפות מסוימת תקינה או שגויה. כשיש סתירה בין תשובת המעסיק לתשובת הקרן, העבירו לשניהם את אותה שאלה עם האסמכתאות.</p>
          <h2>אילו קרנות נכללות ומתי?</h2>
          <p><a href={sources[0].url}>תוצאות ההליך מיום 19.9.2024</a> קבעו את הקרנות שבניהול אינפיניטי, מור, אלטשולר שחם ומיטב כקרנות נבחרות לתקופה שמתחילה ביום 1.11.2024 ומסתיימת ביום 31.10.2028. <a href={sources[1].url}>ההבהרה הסופית מיום 10.6.2025</a> מפרטת את יישום הצירוף. יש לקרוא את המסמכים יחד ולבדוק את ההוראות החלות במועד ההצטרפות, במיוחד כאשר מדובר בחידוש ביטוח או בתיקון דיווח.</p>
          <h2>מנגנון החלוקה לפי ספרת הביקורת</h2>
          <p>לפי ההבהרה, החל מיום 1.6.2025 חל מנגנון החלוקה על מעסיק המעסיק 50 עובדים ומעלה, כאשר העובד לא בחר קופה והמעסיק לא ערך הליך תחרותי לבחירת ברירת מחדל. המועד מתייחס לצירוף העובד, ולא למועד התשלום בעד שכר אותו חודש. הטבלה מרכזת את השיוך כפי שנקבע במקור; אין לה משמעות של דירוג או השוואת ביצועים.</p>
          <div className="overflow-x-auto">
            <table>
              <caption>שיוך במסגרת מנגנון ברירת המחדל — מקור: הבהרת רשות שוק ההון; נבדק 24.10.2026</caption>
              <thead><tr><th scope="col">קרן נבחרת</th><th scope="col">ספרת ביקורת בתעודת הזהות</th></tr></thead>
              <tbody>{fundRows.map(([fund, digits]) => <tr key={fund}><th scope="row">{fund}</th><td dir="ltr">{digits}</td></tr>)}</tbody>
            </table>
          </div>
          <p>למעסיק המעסיק פחות מ־50 עובדים נקבעה אפשרות לצרף לקרן נבחרת לפי שיקול דעתו, בכפוף להצהרה המתאימה. ההבהרה מתייחסת גם להצהרה באמצעות פורטל המעסיקים של החברה המנהלת. אין להסיק מהמספר לבדו שהצירוף הושלם: בקשו אישור למסלול שבו פעל המעסיק ולמסמכים שהועברו. במקרה של חוסר התאמה לספרת הביקורת נדרש בירור של אופן ההצטרפות.</p>
          <h2>דמי ניהול: מה בדיוק נקבע בהליך?</h2>
          <p>לפי <a href={sources[0].url}>תוצאות ההליך, כפי שנבדקו ביום 24.10.2026</a>, תנאי הבסיס הם דמי ניהול שלא יעלו על 1% מההפקדות ועל 0.22% מהיתרה הצבורה. תנאי דמי הניהול האלה נקבעו למשך 10 שנים ממועד הצטרפות העובד לקרן במסגרת ההליך. זו תקופה שונה מתקופת מעמד הקרן כנבחרת, והיא מתייחסת לדמי ניהול בלבד, ללא הבטחת הכנסה.</p>
          <p>אותו מסמך מתאר אפשרות לבקש המרה בין רכיבי דמי הניהול לפי התנאים שנקבעו. לכן בבדיקת חשבון יש לבקש את תנאי הבסיס או החלופה שאושרה ואת מועד תחולתם. אין כאן המלצה על חלופת המרה. ב<Link href="/pension/management-fees">מדריך דמי הניהול</Link> מוסבר איך לארגן השוואה, ואפשר להיעזר ב<a href={sources[3].url}>מחשבון הרשמי</a> תוך שמירת הנתונים שהוזנו.</p>
          <h2>מה בודקים לאחר הצירוף?</h2>
          <p>אספו אישור הצטרפות, תנאי דמי ניהול ופירוט קליטת הפקדות. השוו את שם המוצר ואת פרטי החשבון לאלה שנמסרו למעסיק, ושאלו במפורש האם ההצטרפות טופלה במסגרת הקרן הנבחרת או כבחירה יזומה. אם נאמר שנדרש מסמך נוסף, בקשו את פרטיו ואת אופן השלמתו. רישום ניכוי בתלוש לבדו אינו מספק תשובה על מצב הטיפול בקרן.</p>
          <p>בדקו גם את <Link href="/pension/insurance-cover">הכיסוי הביטוחי</Link> ואת מסמכי מסלול הביטוח. המעמד בהליך אינו מחליף תשובה אישית על זכאות לקצבה או תנאי ביטוח. במעבר עבודה היעזרו ב<Link href="/pension/job-change-continuity">מדריך הרציפות</Link> כדי לברר הפקדות וכיסוי בתקופת המעבר. המטרה היא לקבל תמונה מתועדת של החשבון לפני החלטה, בלי להסיק שהליך ברירת המחדל מתאים לכל נסיבה.</p>
          <h2>מתי מעבירים את הבירור לבעל מקצוע?</h2>
          <p>אם מסמכי המעסיק והקרן אינם מתיישבים, רכזו את מועד הצירוף, הבחירה שנמסרה והתנאים שאושרו. פרטו מה ידוע ומה עדיין חסר, והציגו את המקורות לצד המסמכים האישיים. בירור התאמה של מוצר או כיסוי דורש בעל רישיון מתאים; מחלוקת על הפקדות עשויה לדרוש גם בדיקה משפטית. מידע על ההליך אינו תחליף להכרעה פרטנית.</p>
        </div>
        <section aria-labelledby="faq-title" className="my-10">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">שאלות נפוצות</h2>
          {faqs.map((faq) => <details key={faq.question} className="mb-3 border border-ink/15 bg-paper p-4"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-3 leading-relaxed">{faq.answer}</p></details>)}
        </section>
        <section aria-labelledby="sources-title" className="my-10">
          <h2 id="sources-title" className="mb-4 text-2xl font-bold">מקורות רשמיים</h2>
          <ul className="list-disc space-y-3 pr-6">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
          <p className="mt-4 text-sm">נבדקו ביום 24.10.2026. ההבהרה הסופית נקראה לצד תוצאות ההליך; אין להסתמך על טיוטה או על פרטי מכרז קודם.</p>
        </section>
        <AuthorBox title="רו״ח · מידע פיננסי כללי" bio="אנדרי פלטונוב, רואה חשבון. המדריך מתאר הליך רשמי ואינו דירוג או ייעוץ לבחירת קרן. בדיקת התאמה, כיסוי וזכויות דורשת בעל מקצוע מתאים לפי העניין." />
      </div>
    </article>
  );
}
