import Link from 'next/link';
import { SITE_INFO } from '@/lib/config/site-info';

export const metadata = {
  alternates: { canonical: '/accessibility' },
  title: 'הצהרת נגישות | חשבונאי',
  description: 'הצהרת הנגישות של cheshbonai.co.il - תקן ישראלי 5568, WCAG 2.0 AA, חוק שוויון זכויות לאנשים עם מוגבלות.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-cream py-12">
      <article className="max-w-3xl mx-auto px-4 text-ink/70">

        {/* כותרת */}
        <h1 className="text-4xl font-bold text-ink mb-2">הצהרת נגישות</h1>
        <p className="text-sm text-ink/50 mb-8">
          תאריך עדכון: {SITE_INFO.legal.accessibilityLastUpdated}
        </p>

        {/* 1. רקע */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            1. רקע
          </h2>
          <p className="mb-3">
            <strong>{SITE_INFO.name}</strong> ({SITE_INFO.domain}) מחויב להנגשת האתר לכלל המשתמשים,
            לרבות אנשים עם מוגבלויות, בהתאם לחוקים ולתקנות הישראליים החלים.
          </p>
          <p className="mb-3">
            הצהרה זו מתארת את מצב הנגישות הנוכחי של האתר, הפעולות שנקטנו לשיפורו,
            והמגבלות הידועות שאנו עובדים על פתרונן.
          </p>
          <p>
            ביצענו מאמצים סבירים להבטיח שהאתר יהיה נגיש לאנשים עם מגוון מוגבלויות,
            לרבות: לקויות ראייה, לקויות שמיעה, לקויות מוטוריות, לקויות קוגניטיביות, ועוד.
          </p>
        </section>

        {/* 2. רמת תאימות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            2. רמת תאימות
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-cream-2 border border-ink/15 p-4">
              <h3 className="font-bold text-ink mb-1">תקן ישראלי</h3>
              <p className="text-ink/70 text-sm">ת&quot;י 5568 (IS-5568)</p>
              <p className="text-ink/60 text-xs mt-1">תקן ישראלי לנגישות רשת</p>
            </div>
            <div className="bg-cream-2 border border-ink/15 p-4">
              <h3 className="font-bold text-ink mb-1">תקן בינלאומי</h3>
              <p className="text-ink/70 text-sm">WCAG 2.0 רמה AA</p>
              <p className="text-ink/60 text-xs mt-1">Web Content Accessibility Guidelines</p>
            </div>
            <div className="bg-cream-2 border border-ink/15 p-4">
              <h3 className="font-bold text-ink mb-1">חוק ישראלי</h3>
              <p className="text-ink/70 text-sm">חוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998</p>
            </div>
            <div className="bg-cream-2 border border-ink/15 p-4">
              <h3 className="font-bold text-ink mb-1">תקנות</h3>
              <p className="text-ink/70 text-sm">תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013</p>
            </div>
          </div>
        </section>

        {/* 3. מה הונגש */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            3. מה הונגש באתר
          </h2>
          <p className="mb-4">
            הפעולות הבאות בוצעו לשיפור נגישות האתר:
          </p>

          <div className="space-y-3">
            {[
              {
                title: 'ניווט מקלדת מלא',
                desc: 'ניתן לנווט בכל האתר באמצעות מקלדת (Tab, Enter, Esc, מקשי חצים). כל האלמנטים האינטרקטיביים נגישים ממקלדת.',
              },
              {
                title: 'קוראי מסך',
                desc: 'האתר תואם לקוראי מסך מובילים: NVDA, JAWS, VoiceOver (Mac/iOS), TalkBack (Android).',
              },
              {
                title: 'ניגודיות צבעים',
                desc: 'יחס ניגודיות של לפחות 4.5:1 לטקסט רגיל ו-3:1 לטקסט גדול, בהתאם לדרישות WCAG AA.',
              },
              {
                title: 'קישור דילוג לתוכן (Skip to Content)',
                desc: 'קישור "דלג לתוכן הראשי" מופיע בראש כל דף בעת ניווט מקלדת, המאפשר לדלג על ניווט חוזר.',
              },
              {
                title: 'תוויות ARIA',
                desc: 'כל הכפתורים, הקישורים, הטפסים ושדות הקלט מסומנים עם תוויות ARIA (aria-label, aria-describedby, role) ברורות.',
              },
              {
                title: 'שפה וכיוון',
                desc: 'האתר מוגדר כהלכה עם lang="he" ו-dir="rtl" ב-HTML, כך שקוראי המסך ידעו שמדובר בעברית RTL.',
              },
              {
                title: 'גודל טקסט גמיש',
                desc: 'ניתן להגדיל את גודל הטקסט עד 200% ללא אובדן תוכן או פונקציונליות.',
              },
              {
                title: 'תפריט נגישות צף',
                desc: 'תפריט נגישות צף (ראה סעיף 4) מאפשר התאמות אישיות: גודל טקסט, ניגודיות, פונט קריא ועוד.',
              },
              {
                title: 'אינדיקטורי פוקוס (Focus Indicators)',
                desc: 'כל האלמנטים הפוקוסים מסומנים בגבול ברור וגלוי, להנחיית משתמשי מקלדת.',
              },
              {
                title: 'היררכיית כותרות',
                desc: 'כל הדפים מיושמים עם היררכיית כותרות תקנית: H1 אחד לדף, H2 לסעיפים ראשיים, H3 לתתי-סעיפים.',
              },
              {
                title: 'תיאורי תמונות (Alt Text)',
                desc: 'לכל התמונות, האייקונים והגרפים יש תיאור alt טקסטואלי משמעותי.',
              },
              {
                title: 'תוויות טפסים',
                desc: 'כל שדות הקלט בטפסים ובמחשבונים מקושרים לתוויות (labels) ברורות ומפורשות.',
              },
              {
                title: 'אזהרת קישורים חדשים',
                desc: 'קישורים הנפתחים בחלון חדש מסומנים בהתאם (aria-label, אייקון), להפחתת בלבול.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <span className="text-gold text-lg flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <div>
                  <strong className="text-ink">{item.title}</strong>
                  <p className="text-sm text-ink/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. תפריט נגישות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            4. תפריט הנגישות הצף — הסבר
          </h2>
          <p className="mb-4">
            תפריט הנגישות ממוקם בפינה הימנית-תחתונה של המסך (בהתאם לאתרי RTL).
            לחיצה על אייקון הנגישות (♿) פותחת את התפריט עם האפשרויות הבאות:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'גודל טקסט — 4 רמות (ברירת מחדל / גדול / גדול יותר / גדול ביותר)',
              'ניגודיות גבוהה — רקע שחור, טקסט צהוב',
              'ניגודיות הפוכה — היפוך צבעי הדף',
              'הדגשת קישורים — קו תחתי + מודגש לכל הקישורים',
              'הדגשת כותרות — הבלטה ויזואלית לכותרות H1-H3',
              'פונט קריא — מעבר לפונט Arial / Verdana',
              'עצירת אנימציות — ביטול מעברים ואנימציות',
              'הגדלת סמן — גדלת כובל המשתמש לפי 3×',
              'מקלדת מודגשת — גבולות פוקוס עבים',
              'רווח שורות מוגדל — מרווח שורה של 2',
              'איפוס — ביטול כל ההתאמות',
            ].map((feature) => (
              <div key={feature} className="bg-cream-2 border border-ink/15 p-3 text-sm">
                {feature}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-ink/60">
            ההגדרות נשמרות באופן מקומי בדפדפן שלך (localStorage) וישמרו בין ביקורים.
            ניתן לסגור את התפריט בלחיצה על Esc, לחיצה מחוץ לתפריט, או לחיצה חוזרת על הכפתור.
          </p>
        </section>

        {/* 5. מגבלות ידועות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            5. מגבלות ידועות
          </h2>
          <p className="mb-4">
            למרות מאמצינו, ישנם חלקים באתר שטרם הונגשו במלואם:
          </p>

          <div className="space-y-4">
            <div className="border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-800 mb-2">גרפים אינטרקטיביים (Recharts)</h3>
              <p className="text-sm text-amber-700">
                הגרפים הפיננסיים (עוגה, קו, עמודות) מוצגים כאלמנטי SVG אינטרקטיביים.
                הגישה שלהם לקוראי מסך היא חלקית בלבד — ניתן לראות את נתוני הגרף בטבלאות
                הנתונים שלצידם (כאשר קיימות), אך חוויית הגרף עצמו אינה מלאה.
              </p>
              <p className="text-xs text-amber-600 mt-1">סטטוס: בעבודה — מוסיפים alt-text ו-data tables לגרפים.</p>
            </div>

            <div className="border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-800 mb-2">תוצאות מחשבונים</h3>
              <p className="text-sm text-amber-700">
                חלק מהמחשבונים מציגים תוצאות כמספרים בלבד, ללא הקשר תיאורי מספיק לקוראי מסך.
                אנחנו עובדים על הוספת aria-live regions שיקראו את התוצאות בקול עם שינויים.
              </p>
              <p className="text-xs text-amber-600 mt-1">סטטוס: בשיפור מתמיד.</p>
            </div>

            <div className="border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-800 mb-2">תוכן PDFs חיצוניים</h3>
              <p className="text-sm text-amber-700">
                האתר מקשר לקבצי PDF של רשויות ממשלתיות (מס הכנסה, בנק ישראל).
                הנגשת קבצים אלה אינה בשליטתנו.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-ink">
            אנחנו מחויבים לשיפור מתמיד של הנגישות. אם נתקלת בבעיה —
            <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline mr-1 ml-1">
              אנא דווח לנו
            </Link>
            ונפעל לפתרונה.
          </p>
        </section>

        {/* 6. דיווח על בעיה */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            6. דיווח על בעיית נגישות
          </h2>
          <p className="mb-3">
            נתקלת בבעיית נגישות? ברצוננו לדעת ולתקן. ניתן לפנות בכל אחד מהאפשרויות הבאות:
          </p>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>טופס יצירת קשר:</strong>{' '}
              <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline">
                {SITE_INFO.domain}{SITE_INFO.contact.contactPage}
              </Link>
            </li>
            <li>
              <strong>דוא&quot;ל נגישות:</strong>{' '}
              <a href={`mailto:${SITE_INFO.contact.accessibilityEmail}`} className="text-gold hover:underline">
                {SITE_INFO.contact.accessibilityEmail}
              </a>
            </li>
          </ul>
          <div className="bg-cream-2 border border-ink/15 p-3 text-sm text-ink">
            <strong>זמן תגובה:</strong> נשתדל להשיב תוך 7 ימי עסקים. לבעיות דחופות — ציין זאת בנושא
            הפנייה.
          </div>
        </section>

        {/* 7. לא יכולת לגשת */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            7. לא יכולת לגשת לתוכן?
          </h2>
          <p className="mb-3">
            אם התקשית לגשת לתוכן ספציפי באתר ונדרשת לו, אנא פנה אלינו ונסייע לך לקבל את
            המידע בפורמט נגיש אחר:
          </p>
          <ul className="space-y-2">
            <li>
              פנייה בדוא&quot;ל:{' '}
              <a href={`mailto:${SITE_INFO.contact.accessibilityEmail}`} className="text-gold hover:underline">
                {SITE_INFO.contact.accessibilityEmail}
              </a>
            </li>
            <li>
              טופס יצירת קשר:{' '}
              <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline">
                {SITE_INFO.contact.contactPage}
              </Link>
            </li>
          </ul>
          <p className="text-sm text-ink/60 mt-3">
            <em>הערה: האתר מנוהל על ידי יחיד פרטי. אין חובה חוקית למינוי רכז נגישות, אך
            כל פנייה תקבל מענה אישי.</em>
          </p>
        </section>

        {/* 8. חוקים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            8. חוקים, תקנות ותקנים
          </h2>
          <div className="space-y-3">
            <div className="border border-ink/15 p-3">
              <h3 className="font-semibold text-ink text-sm">
                חוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998
              </h3>
              <p className="text-xs text-ink/60 mt-1">
                הבסיס החוקי לזכות לנגישות בישראל.
              </p>
            </div>
            <div className="border border-ink/15 p-3">
              <h3 className="font-semibold text-ink text-sm">
                תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013
              </h3>
              <p className="text-xs text-ink/60 mt-1">
                התקנות הקובעות את דרישות הנגישות לאתרי אינטרנט בישראל.
              </p>
            </div>
            <div className="border border-ink/15 p-3">
              <h3 className="font-semibold text-ink text-sm">
                תקן ישראלי 5568 (ת&quot;י 5568)
              </h3>
              <p className="text-xs text-ink/60 mt-1">
                תקן ישראלי לנגישות אתרי אינטרנט, המבוסס על WCAG 2.0.
              </p>
            </div>
            <div className="border border-ink/15 p-3">
              <h3 className="font-semibold text-ink text-sm">
                WCAG 2.0 Level AA — Web Content Accessibility Guidelines
              </h3>
              <p className="text-xs text-ink/60 mt-1">
                הקווים המנחים הבינלאומיים של ארגון W3C לנגישות תוכן ברשת.
              </p>
            </div>
          </div>
        </section>

        {/* תאריכים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            9. תאריכים
          </h2>
          <ul className="space-y-2 text-sm">
            <li><strong>תאריך הצהרת נגישות:</strong> {SITE_INFO.legal.accessibilityLastUpdated}</li>
            <li><strong>תאריך עדכון אחרון:</strong> {SITE_INFO.legal.accessibilityLastUpdated}</li>
            <li><strong>מועד נגישות מערכת:</strong> {SITE_INFO.legal.accessibilityLastUpdated}</li>
          </ul>
        </section>

        {/* תחתית */}
        <div className="bg-cream-2 border border-ink/15 p-5 mt-10">
          <p className="text-sm text-ink/70">
            הנגישות היא עדיפות עבורנו. אנחנו ממשיכים לשפר את האתר כדי שיהיה נגיש לכלל
            המשתמשים. לפניות בנושא נגישות:{' '}
            <a href={`mailto:${SITE_INFO.contact.accessibilityEmail}`} className="text-gold hover:underline">
              {SITE_INFO.contact.accessibilityEmail}
            </a>
          </p>
        </div>

      </article>
    </div>
  );
}
