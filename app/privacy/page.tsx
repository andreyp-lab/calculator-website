import Link from 'next/link';
import { SITE_INFO } from '@/lib/config/site-info';

export const metadata = {
  title: 'מדיניות פרטיות | חשבונאי',
  description: 'מדיניות הפרטיות של cheshbonai.co.il - אנו לא אוספים נתונים אישיים. גילוי מלא לגבי שרתי Vercel.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <article className="max-w-3xl mx-auto px-4 text-gray-700">

        {/* כותרת */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">מדיניות פרטיות</h1>
        <p className="text-sm text-gray-500 mb-4">
          תאריך עדכון אחרון: {SITE_INFO.legal.privacyLastUpdated}
        </p>

        {/* 1. מבוא */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            1. מבוא
          </h2>
          <p className="mb-3">
            ברוכים הבאים ל-<strong>{SITE_INFO.name}</strong> ({SITE_INFO.domain}).
            אתר זה מציע מחשבונים פיננסיים חינמיים בעברית, ללא כל הרשמה, חברות או תשלום.
          </p>
          <p className="mb-3">
            האתר מנוהל על ידי יחיד פרטי (להלן: &quot;מפעיל האתר&quot;).
            הפרטים המלאים של מפעיל האתר: {SITE_INFO.owner.name},
            כתובת: {SITE_INFO.owner.address}.
          </p>
          <p className="mb-3">
            מדיניות פרטיות זו מתארת בשקיפות מלאה אילו נתונים, אם בכלל, נאספים בעת ביקורך באתר,
            על ידי מי, ולאיזה מטרה. היא חלה על כל משתמשי האתר, לרבות תושבי ישראל ותושבי האיחוד האירופי.
          </p>
          <p>
            המדיניות עומדת בדרישות <strong>חוק הגנת הפרטיות, התשמ&quot;א-1981</strong> ותקנותיו,
            וכן ב-<strong>תקנת הגנת המידע הכללית של האיחוד האירופי (GDPR)</strong>.
          </p>
        </section>

        {/* 2. מידע שאנחנו אוספים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            2. איזה מידע אנחנו אוספים?
          </h2>

          <div className="bg-green-50 border border-green-300 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold text-green-800 mb-2">
              התשובה הקצרה: כמעט כלום.
            </h3>
            <p className="text-green-700">
              אנחנו <strong>לא</strong> מפעילים מסד נתונים. אנחנו <strong>לא</strong> שומרים שום
              מידע על המשתמשים שלנו. אין הרשמה, אין חשבון משתמש, אין עוגיות ניתוח (Analytics),
              ואין פיקסל פרסומי (Facebook Pixel, Google Ads וכד&apos;).
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 מידע שאתה מזין במחשבונים</h3>
          <p className="mb-3">
            נתונים שאתה מזין במחשבונים (סכומי כסף, שכר, תאריכים וכו&apos;) <strong>אינם נשלחים לשרת</strong>.
            כל החישובים מתבצעים <strong>בדפדפן שלך בלבד</strong>, בזיכרון זמני.
            הנתונים לא נשמרים, לא מועברים, ולא מנותחים על ידינו.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 אנחנו לא אוספים</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>שם, כתובת דוא&quot;ל, מספר טלפון</li>
            <li>מידע פיננסי אישי</li>
            <li>מיקום גיאוגרפי מדויק</li>
            <li>היסטוריית גלישה (מעבר לבקשת הדף הנוכחי)</li>
            <li>עוגיות פרסומיות או ניתוחיות</li>
            <li>פרופיל משתמש מכל סוג</li>
          </ul>
        </section>

        {/* 3. מידע טכני - Vercel */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            3. מידע טכני שנאסף על ידי Vercel (ספק האחסון)
          </h2>
          <p className="mb-3">
            האתר מתארח על שרתי <strong>{SITE_INFO.hosting.provider}</strong>,
            חברה אמריקאית ({SITE_INFO.hosting.location}).
            כמו כל שרת אינטרנט, Vercel שומרת <strong>יומני גישה (access logs)</strong> אוטומטיים
            לצורכי אבטחה, ביצועים ואיתור תקלות.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 מה יומני Vercel כוללים (בדרך כלל):</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>כתובת IP של המבקר (מוסתרת/מקוצרת בדרך כלל)</li>
            <li>סוג דפדפן ומערכת הפעלה (User-Agent)</li>
            <li>תאריך ושעת הבקשה</li>
            <li>כתובת הדף המבוקש</li>
            <li>קוד תגובת שרת (200, 404 וכד&apos;)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 חשוב לדעת:</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>מידע זה <strong>אינו מקושר לזהות אישית</strong></li>
            <li>אנחנו <strong>לא ניגשים</strong> ליומנים אלה בשגרה</li>
            <li>הנתונים נשמרים לפרק זמן מוגבל על ידי Vercel</li>
            <li>Vercel היא המעבדת (Data Processor) — אנחנו הבקר (Data Controller)</li>
          </ul>

          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            לפרטים על מדיניות הפרטיות של Vercel:{' '}
            <a
              href={SITE_INFO.hosting.privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {SITE_INFO.hosting.privacyPolicyUrl}
            </a>
          </p>
        </section>

        {/* 4. עוגיות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            4. עוגיות (Cookies)
          </h2>
          <p className="mb-3">
            אנחנו <strong>לא</strong> משתמשים בעוגיות לצורכי ניתוח, שיווק או מעקב.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 עוגיות פונקציונליות (אופציונלי)</h3>
          <p className="mb-3">
            ייתכן שהאתר שומר העדפות מקומיות (כגון הגדרות נגישות) ב-<strong>localStorage</strong> של
            הדפדפן שלך — זה שמור אצלך בלבד, ולא נשלח לשרת.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 עוגיות תשתית (Vercel)</h3>
          <p className="mb-3">
            Vercel עשויה להציב עוגיות טכניות הכרחיות לתפעול השרת (ניהול עומסים, אבטחה).
            אלה <strong>אינן עוגיות שיווקיות</strong> ואינן עוקבות אחר פעילותך באתרים אחרים.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 מה אנחנו לא עושים:</h3>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>אין Google Analytics</li>
            <li>אין Facebook Pixel</li>
            <li>אין TikTok Pixel</li>
            <li>אין Hotjar, Clarity, או כלי הקלטת משתמשים</li>
            <li>אין רשת פרסום של צד שלישי</li>
          </ul>
        </section>

        {/* 5. צד שלישי */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            5. שירותי צד שלישי
          </h2>
          <p className="mb-3">
            האתר משתמש בשירותים חיצוניים מוגבלים הבאים:
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">Vercel Inc. — אחסון אתר</h3>
              <p className="text-sm text-gray-600 mt-1">
                ספק האחסון. ראה סעיף 3 למעלה. מדיניות פרטיות:{' '}
                <a href={SITE_INFO.hosting.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  vercel.com/legal/privacy-policy
                </a>
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">Google Fonts — פונטים</h3>
              <p className="text-sm text-gray-600 mt-1">
                האתר משתמש בפונט &quot;Heebo&quot; מ-Google Fonts. טעינת הפונט כרוכה בבקשה לשרתי Google,
                אשר עשויה לכלול כתובת IP שלך. Google Fonts אינה שומרת מידע זיהוי אישי לפי
                מדיניות Google הנוכחית.{' '}
                <a href="https://fonts.google.com/about" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  קרא עוד
                </a>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            <strong>לא</strong> משולבים: Google Analytics, Facebook SDK, Twitter SDK, LinkedIn Pixel,
            Hotjar, Intercom, Crisp Chat, או כל שירות ניתוח/פרסום אחר.
          </p>
        </section>

        {/* 6. העברת מידע לחו"ל */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            6. העברת מידע לחו&quot;ל
          </h2>
          <p className="mb-3">
            השרתים שמאחסנים את האתר ממוקמים ב<strong>ארצות הברית</strong> (Vercel).
            בגלישה באתר, בקשות ה-HTTP שלך מגיעות לשרתים אלה — זוהי ה&quot;העברה&quot; היחידה של מידע
            טכני לחו&quot;ל.
          </p>
          <p className="mb-3">
            מכיוון שלא נאסף מידע אישי על ידינו, <strong>אין העברת מידע אישי</strong> לצדדים שלישיים,
            לא בישראל ולא בחו&quot;ל.
          </p>
          <p className="text-sm text-gray-600">
            Vercel פועלת בהתאם לסטנדרטים של GDPR ו-SCCs (Standard Contractual Clauses)
            לצורך העברת מידע מהאיחוד האירופי לארה&quot;ב.
          </p>
        </section>

        {/* 7. זכויותיך */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            7. זכויותיך על פי חוק
          </h2>
          <p className="mb-4">
            חוק הגנת הפרטיות הישראלי ו-GDPR מעניקים לך זכויות שונות בנוגע למידע אישי.
            מכיוון שאיננו אוספים מידע אישי, רוב הזכויות הבאות אינן ישימות מעשית — אך אנו
            מפרטים אותן לשלמות:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">1.</span>
              <div>
                <strong>זכות עיון (Right of Access)</strong> — לדעת אילו נתונים שמורים עליך.
                <span className="text-gray-500 text-sm block">מצבנו: אין נתונים לעיין בהם.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">2.</span>
              <div>
                <strong>זכות תיקון (Right to Rectification)</strong> — לתקן מידע שגוי.
                <span className="text-gray-500 text-sm block">מצבנו: אין נתונים לתיקון.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">3.</span>
              <div>
                <strong>זכות מחיקה (Right to Erasure)</strong> — &quot;הזכות להישכח&quot;.
                <span className="text-gray-500 text-sm block">מצבנו: אין נתונים למחיקה.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">4.</span>
              <div>
                <strong>זכות אי-שימוש / התנגדות (Right to Object)</strong> — להתנגד לעיבוד.
                <span className="text-gray-500 text-sm block">מצבנו: אין עיבוד מידע אישי.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">5.</span>
              <div>
                <strong>זכות ניוד (Data Portability)</strong> — לקבל נתוניך בפורמט מובנה.
                <span className="text-gray-500 text-sm block">מצבנו: אין נתונים להעביר.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600 w-8 flex-shrink-0">6.</span>
              <div>
                <strong>זכות הגבלה (Right to Restrict Processing)</strong> — להגביל את השימוש.
                <span className="text-gray-500 text-sm block">מצבנו: אין עיבוד לצמצם.</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            אם ברצונך לממש זכויות אלה בנוגע למידע שנאסף על ידי <strong>Vercel</strong>,
            ניתן לפנות ישירות לפרטיות Vercel:{' '}
            <a href={SITE_INFO.hosting.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              vercel.com/legal/privacy-policy
            </a>.
          </p>
        </section>

        {/* 8. קטינים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            8. קטינים
          </h2>
          <p className="mb-3">
            האתר אינו מיועד לילדים מתחת לגיל 13. אנחנו לא אוספים במודע מידע מקטינים.
            מכיוון שאיננו אוספים מידע אישי כלל, אין לנו אפשרות לדעת את גיל המשתמש,
            ואין לנו צורך לדעת זאת.
          </p>
          <p className="text-sm text-gray-600">
            אם הנך הורה או אפוטרופוס וסבור שילדך מסר מידע אישי כלשהו, אנא{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-blue-600 hover:underline">
              פנה אלינו
            </Link>{' '}
            ונפעל בהתאם.
          </p>
        </section>

        {/* 9. שינויים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            9. שינויים במדיניות הפרטיות
          </h2>
          <p className="mb-3">
            אנחנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יסומנו בראש הדף.
            השימוש המתמשך באתר לאחר פרסום שינויים מהווה הסכמה למדיניות המעודכנת.
          </p>
          <p className="text-sm text-gray-600">
            תאריך עדכון אחרון: <strong>{SITE_INFO.legal.privacyLastUpdated}</strong>
          </p>
        </section>

        {/* 10. יצירת קשר */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            10. יצירת קשר בנושא פרטיות
          </h2>
          <p className="mb-3">
            לשאלות, הערות או בקשות בנוגע למדיניות פרטיות זו, אנא{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-blue-600 hover:underline font-medium">
              פנה אלינו דרך טופס יצירת הקשר
            </Link>
            {' '}או ישירות לכתובת:{' '}
            <a href={`mailto:${SITE_INFO.contact.email}`} className="text-blue-600 hover:underline">
              {SITE_INFO.contact.email}
            </a>.
          </p>
          <p className="text-sm text-gray-600">
            נשתדל להשיב בתוך 7 ימי עסקים.
          </p>
        </section>

        {/* תחתית */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-10">
          <p className="text-sm text-gray-700">
            <strong>סיכום:</strong> האתר {SITE_INFO.domain} אינו אוסף נתונים אישיים. המידע הטכני היחיד
            שנאסף הוא יומני שרת סטנדרטיים של Vercel (IP, User-Agent, Timestamp), שאינם מקושרים לזהות אישית.
            לשאלות:{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-blue-600 hover:underline">
              {SITE_INFO.contact.contactPage}
            </Link>
          </p>
        </div>

      </article>
    </div>
  );
}
