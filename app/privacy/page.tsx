import Link from 'next/link';
import { SITE_INFO } from '@/lib/config/site-info';

export const metadata = {
  alternates: { canonical: '/privacy' },
  title: 'מדיניות פרטיות',
  description: 'מדיניות הפרטיות של cheshbonai.co.il: נתוני שימוש, Google Analytics, Vercel Analytics, אחסון וקישורים לקורסים.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper py-12">
      <article className="max-w-3xl mx-auto px-4 text-ink/70">

        {/* כותרת */}
        <h1 className="text-4xl font-bold text-ink mb-2">מדיניות פרטיות</h1>
        <p className="text-sm text-ink/70 mb-4">
          תאריך עדכון אחרון: {SITE_INFO.legal.privacyLastUpdated}
        </p>

        {/* 1. מבוא */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            1. מבוא
          </h2>
          <p className="mb-3">
            ברוכים הבאים ל-<strong>{SITE_INFO.name}</strong> ({SITE_INFO.domain}).
            אתר זה מציע כלים ומדריכים פיננסיים חינמיים בעברית וקישורים לקורסים בתשלום.
          </p>
          <p className="mb-3">
            האתר מנוהל על ידי יחיד פרטי (להלן: &quot;מפעיל האתר&quot;).
            הפרטים המלאים של מפעיל האתר: {SITE_INFO.owner.name},
            כתובת: {SITE_INFO.owner.address}.
          </p>
          <p className="mb-3">
            מדיניות פרטיות זו מתארת אילו נתוני שימוש נשלחים לספקי האחסון והניתוח,
            ואילו פרטים אתם בוחרים לשלוח בפנייה בדוא״ל או ברכישת קורס באתר חיצוני.
          </p>
        </section>

        {/* 2. מידע שאנחנו אוספים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            2. איזה מידע אנחנו אוספים?
          </h2>

          <div className="bg-green-50 border border-green-300 rounded-none p-5 mb-4">
            <h3 className="text-lg font-bold text-green-800 mb-2">
              נתוני שימוש ופרטים שאתם בוחרים למסור
            </h3>
            <p className="text-green-700">
              אין באתר חשבון משתמש או הרשמה להפעלת הכלים. האתר משתמש ב־Google Analytics
              וב־Vercel Web Analytics למדידת ביקורים ופעולות באתר. פרטים שתשלחו אלינו בדוא״ל
              יופיעו בתיבת הדוא״ל, ורכישת קורס מתבצעת אצל ספק הקורס החיצוני.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-ink mb-2">2.1 מידע שאתה מזין במחשבונים</h3>
          <p className="mb-3">
            המחשבונים באתר מבצעים את החישוב בדפדפן. אין צורך בחשבון משתמש כדי להשתמש בהם.
            במקביל, ספקי הניתוח עשויים לקבל נתונים על ביקור בדף ועל לחיצה על קישור לקורס;
            אין להזין פרטים אישיים בשדות שאינם מיועדים לכך.
          </p>

          <h3 className="text-lg font-semibold text-ink mb-2">2.2 מידע שלא נדרש להפעלת המחשבונים</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>אין צורך למסור שם, כתובת דוא&quot;ל או מספר טלפון לשימוש בכלים.</li>
            <li>אין צורך לפתוח חשבון משתמש באתר.</li>
            <li>מסירת פרטים בדוא״ל או באתר רכישת הקורס היא פעולה נפרדת שתבחרו לבצע.</li>
          </ul>
        </section>

        {/* 3. מידע טכני - Vercel */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            3. מידע טכני שנאסף על ידי Vercel (ספק האחסון)
          </h2>
          <p className="mb-3">
            האתר מתארח על שרתי <strong>{SITE_INFO.hosting.provider}</strong>,
            חברה אמריקאית ({SITE_INFO.hosting.location}).
            כמו כל שרת אינטרנט, Vercel שומרת <strong>יומני גישה (access logs)</strong> אוטומטיים
            לצורכי אבטחה, ביצועים ואיתור תקלות.
          </p>

          <h3 className="text-lg font-semibold text-ink mb-2">3.1 מה יומני Vercel כוללים (בדרך כלל):</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>כתובת IP של המבקר</li>
            <li>סוג דפדפן ומערכת הפעלה (User-Agent)</li>
            <li>תאריך ושעת הבקשה</li>
            <li>כתובת הדף המבוקש</li>
            <li>קוד תגובת שרת (200, 404 וכד&apos;)</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink mb-2">3.2 חשוב לדעת:</h3>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>המידע עשוי לשמש לתפעול, אבטחה, איתור תקלות וניתוח שימוש באתר.</li>
            <li>משך השמירה והטיפול בנתונים נקבעים גם לפי הגדרות ספק האחסון.</li>
          </ul>

          <p className="text-sm text-ink/70 bg-cream-2 p-3 rounded-none">
            לפרטים על מדיניות הפרטיות של Vercel:{' '}
            <a
              href={SITE_INFO.hosting.privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              {SITE_INFO.hosting.privacyPolicyUrl}
            </a>
          </p>
        </section>

        {/* 4. עוגיות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            4. עוגיות (Cookies)
          </h2>
          <p className="mb-3">
            האתר טוען את Google Analytics למדידת שימוש. לפי תיעוד Google, התג עשוי להציב
            עוגיות כגון _ga לצורך זיהוי ביקורים ומפגשים. Vercel Web Analytics מודד ביקורים
            ללא עוגיות צד שלישי.
          </p>

          <h3 className="text-lg font-semibold text-ink mb-2">4.1 העדפות נגישות בדפדפן</h3>
          <p className="mb-3">
            האתר שומר העדפות נגישות ב־<strong>localStorage</strong> של הדפדפן שלך.
            ההעדפות נשמרות במכשיר ואינן נשלחות לשרת כחלק מתכונת הנגישות.
          </p>

          <h3 className="text-lg font-semibold text-ink mb-2">4.2 עוגיות תשתית</h3>
          <p className="mb-3">
            ספק האחסון עשוי להשתמש במנגנונים טכניים לתפעול ולאבטחת האתר.
            מידע על סוגי עוגיות נוספים ותוקפן מופיע במדיניות הספקים המקושרות להלן.
          </p>

          <h3 className="text-lg font-semibold text-ink mb-2">4.3 שירותי פרסום שלא שולבו בקוד האתר:</h3>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>אין Facebook Pixel</li>
            <li>אין TikTok Pixel</li>
            <li>אין Hotjar, Clarity, או כלי הקלטת משתמשים</li>
            <li>אין רשת פרסום של צד שלישי</li>
          </ul>
        </section>

        {/* 5. צד שלישי */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            5. שירותי צד שלישי
          </h2>
          <p className="mb-3">
            האתר משתמש בשירותים חיצוניים מוגבלים הבאים:
          </p>

          <div className="space-y-4">
            <div className="border border-ink/15 rounded-none p-4">
              <h3 className="font-semibold text-ink">Vercel Inc. — אחסון אתר</h3>
              <p className="text-sm text-ink/70 mt-1">
                ספק האחסון. ראה סעיף 3 למעלה. מדיניות פרטיות:{' '}
                <a href={SITE_INFO.hosting.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  vercel.com/legal/privacy-policy
                </a>
              </p>
            </div>

            <div className="border border-ink/15 rounded-none p-4">
              <h3 className="font-semibold text-ink">Google Analytics — מדידת שימוש</h3>
              <p className="text-sm text-ink/70 mt-1">
                תג Google נטען בדפי האתר ובדפי הקורסים. הוא מודד צפיות בדפים ובחלק מהדפים
                גם לחיצות על קישורים לדפי קורס ולרכישה. מידע על עוגיות ושימוש בנתונים מופיע ב
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">מדיניות הפרטיות של Google</a>.
              </p>
            </div>

            <div className="border border-ink/15 rounded-none p-4">
              <h3 className="font-semibold text-ink">Vercel Web Analytics — מדידת ביקורים</h3>
              <p className="text-sm text-ink/70 mt-1">
                רכיב המדידה של Vercel שולח נתוני צפייה בדפים לצורך נתונים סטטיסטיים מצטברים.
                לפי תיעוד Vercel, רכיב זה אינו משתמש בעוגיות לזיהוי מבקרים.
              </p>
            </div>

            <div className="border border-ink/15 rounded-none p-4">
              <h3 className="font-semibold text-ink">אתרי הקורסים החיצוניים</h3>
              <p className="text-sm text-ink/70 mt-1">
                לחיצה על רכישת קורס מעבירה לאתר Schooler; קורס Claude AI מקושר לאתר קורס חיצוני.
                בעת מעבר לאתר חיצוני חלה גם מדיניות הפרטיות שלו.
              </p>
            </div>

            <div className="border border-ink/15 rounded-none p-4">
              <h3 className="font-semibold text-ink">Google Fonts — פונטים</h3>
              <p className="text-sm text-ink/70 mt-1">
                האתר משתמש בפונטים ממאגר Google Fonts באמצעות next/font; קובצי הפונט מוגשים
                מתוך האתר. פרטים על הגופנים במאגר:{' '}
                <a href="https://fonts.google.com/about" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  קרא עוד
                </a>
              </p>
            </div>
          </div>

        </section>

        {/* 6. העברת מידע לחו"ל */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            6. העברת מידע לחו&quot;ל
          </h2>
          <p className="mb-3">
            נתוני גלישה וניתוח עשויים להישלח אל ספקי השירות המפורטים לעיל, לרבות Vercel ו־Google,
            ולעבור עיבוד מחוץ לישראל לפי תנאי השירות וההגדרות של כל ספק.
          </p>
          <p className="mb-3">
            אם תעברו לאתר רכישה חיצוני או תפנו אלינו בדוא״ל, המידע שתמסרו יטופל גם לפי מדיניות
            השירות החיצוני שבו בחרתם להשתמש.
          </p>
        </section>

        {/* 7. זכויותיך */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            7. זכויותיך על פי חוק
          </h2>
          <p className="mb-4">
            זכויות ביחס למידע אישי תלויות בדין החל ובנסיבות. לפנייה לגבי מידע שנמסר אלינו
            בדוא״ל או לגבי נתוני שימוש באתר, השתמשו בפרטי הקשר שבסוף הדף.
          </p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">1.</span>
              <div>
                <strong>זכות עיון (Right of Access)</strong> — לדעת אילו נתונים שמורים עליך.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">2.</span>
              <div>
                <strong>זכות תיקון (Right to Rectification)</strong> — לתקן מידע שגוי.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">3.</span>
              <div>
                <strong>זכות מחיקה (Right to Erasure)</strong> — &quot;הזכות להישכח&quot;.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">4.</span>
              <div>
                <strong>זכות אי-שימוש / התנגדות (Right to Object)</strong> — להתנגד לעיבוד.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">5.</span>
              <div>
                <strong>זכות ניוד (Data Portability)</strong> — לקבל נתוניך בפורמט מובנה.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-gold w-8 flex-shrink-0">6.</span>
              <div>
                <strong>זכות הגבלה (Right to Restrict Processing)</strong> — להגביל את השימוש.
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-ink/70">
            לפניות הנוגעות למידע שעשוי להימצא אצל ספקים חיצוניים, אפשר לעיין גם במדיניות
            הפרטיות שלהם או לפנות אלינו באמצעות פרטי הקשר להלן.
          </p>
        </section>

        {/* 8. קטינים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            8. קטינים
          </h2>
          <p className="mb-3">
            האתר אינו מיועד לילדים מתחת לגיל 13. אין צורך למסור פרטים אישיים כדי להשתמש בכלים.
          </p>
          <p className="text-sm text-ink/70">
            אם הנך הורה או אפוטרופוס וסבור שילדך מסר מידע אישי כלשהו, אנא{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline">
              פנה אלינו
            </Link>{' '}
            ונפעל בהתאם.
          </p>
        </section>

        {/* 9. שינויים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            9. שינויים במדיניות הפרטיות
          </h2>
          <p className="mb-3">
            אנחנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יסומנו בראש הדף.
            השימוש המתמשך באתר לאחר פרסום שינויים מהווה הסכמה למדיניות המעודכנת.
          </p>
          <p className="text-sm text-ink/70">
            תאריך עדכון אחרון: <strong>{SITE_INFO.legal.privacyLastUpdated}</strong>
          </p>
        </section>

        {/* 10. יצירת קשר */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4 pb-2 border-b border-ink/15">
            10. יצירת קשר בנושא פרטיות
          </h2>
          <p className="mb-3">
            לשאלות, הערות או בקשות בנוגע למדיניות פרטיות זו, אנא{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline font-medium">
              פנה אלינו דרך דף יצירת הקשר
            </Link>
            {' '}או ישירות לכתובת:{' '}
            <a href={`mailto:${SITE_INFO.contact.email}`} className="text-gold hover:underline">
              {SITE_INFO.contact.email}
            </a>.
          </p>
          <p className="text-sm text-ink/70">
            נשתדל להשיב בתוך 7 ימי עסקים.
          </p>
        </section>

        {/* תחתית */}
        <div className="bg-cream-2 border border-ink/15 rounded-none p-5 mt-10">
          <p className="text-sm text-ink/70">
            <strong>סיכום:</strong> באתר {SITE_INFO.domain} פועלים Google Analytics ו־Vercel Web Analytics,
            וספק האחסון עשוי לעבד נתוני בקשות. שימוש בכלים אינו דורש חשבון משתמש.
            לשאלות:{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-gold hover:underline">
              {SITE_INFO.contact.contactPage}
            </Link>
          </p>
        </div>

      </article>
    </div>
  );
}
