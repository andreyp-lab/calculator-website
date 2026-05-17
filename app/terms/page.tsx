import Link from 'next/link';
import { SITE_INFO } from '@/lib/config/site-info';

export const metadata = {
  title: 'תנאי שימוש | חשבונאי',
  description: 'תנאי השימוש של cheshbonai.co.il - כתב ויתור פיננסי מקיף, הגבלת אחריות, קניין רוחני.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <article className="max-w-3xl mx-auto px-4 text-gray-700">

        {/* כותרת */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">תנאי שימוש</h1>
        <p className="text-sm text-gray-500 mb-4">
          תאריך עדכון אחרון: {SITE_INFO.legal.termsLastUpdated}
        </p>

        {/* הערת תבנית */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6 text-sm">
          <p className="font-semibold text-amber-800">הערה: תבנית - מומלץ בדיקה משפטית</p>
          <p className="text-amber-700 mt-1">
            מסמך זה הוכן באמצעות תבנית. לפני שימוש מסחרי — בדיקה משפטית של עו&quot;ד מומלצת.
            ל{SITE_INFO.name} אין אחריות לנכונות המשפטית של מסמך זה.
          </p>
        </div>

        {/* אזהרה פיננסית בולטת */}
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold text-red-800 mb-3">אזהרה פיננסית חשובה</h2>
          <p className="text-red-700 font-medium mb-2">
            המידע באתר זה אינו מהווה ייעוץ פיננסי, ייעוץ השקעות, ייעוץ מס, ייעוץ משפטי או ייעוץ
            פנסיוני. אנו איננו יועצי השקעות מורשים לפי חוק הסדרת העיסוק בייעוץ השקעות, התשנ&quot;ה-1995.
          </p>
          <p className="text-red-600 text-sm">
            לפני קבלת כל החלטה פיננסית — התייעץ עם רואה חשבון מוסמך, עורך דין, יועץ פנסיוני
            או יועץ השקעות מורשה.
          </p>
        </div>

        {/* 1. קבלת תנאים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            1. קבלת תנאים
          </h2>
          <p className="mb-3">
            גלישה ושימוש באתר <strong>{SITE_INFO.domain}</strong> (להלן: &quot;האתר&quot;) מהווים
            הסכמה מלאה ובלתי מסויגת לתנאי שימוש אלה (להלן: &quot;התנאים&quot;).
            אם אינך מסכים לתנאים אלה — אנא הפסק את השימוש באתר לאלתר.
          </p>
          <p className="mb-3">
            תנאים אלה חלים על כל שימוש באתר, לרבות גלישה, שימוש במחשבונים, קריאת תוכן,
            ושימוש בכל שירות המוצע.
          </p>
          <p>
            תנאים אלה מהווים הסכם משפטי מחייב בינך לבין מפעיל האתר: {SITE_INFO.owner.name}
            (להלן: &quot;אנחנו&quot; או &quot;המפעיל&quot;).
          </p>
        </section>

        {/* 2. תיאור השירות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            2. תיאור השירות
          </h2>
          <p className="mb-3">
            {SITE_INFO.name} מציע <strong>מחשבונים פיננסיים חינמיים</strong> ו<strong>תוכן עיוני</strong>
            בעברית, לרבות:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>מחשבוני מס הכנסה, ביטוח לאומי ומע&quot;מ</li>
            <li>מחשבוני משכנתא ונדל&quot;ן</li>
            <li>מחשבוני השקעות, חיסכון ופנסיה</li>
            <li>מחשבוני רכב, ליסינג ועלות בעלות</li>
            <li>מחשבוני שכר, פיצויים וזכויות עובד</li>
            <li>מאמרים, מדריכים ומילון מונחים פיננסיים</li>
          </ul>
          <p className="mb-3">
            השירות ניתן <strong>ללא תשלום</strong>, ללא הרשמה, וללא כל התחייבות מצד המפעיל.
            המפעיל רשאי לשנות, להוסיף, להפחית או להפסיק שירותים בכל עת וללא הודעה מוקדמת.
          </p>
        </section>

        {/* 3. כתב ויתור פיננסי */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            3. כתב ויתור פיננסי מקיף
          </h2>

          <div className="bg-red-50 border border-red-300 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold text-red-800 mb-3">3.1 אינו ייעוץ מקצועי</h3>
            <p className="text-red-700 mb-2">
              כל המידע, החישובים, הגרפים, המאמרים, ההסברים, הטיפים וכל תוכן אחר באתר זה:
            </p>
            <ul className="list-disc list-inside space-y-1 text-red-700 mr-2">
              <li><strong>אינו מהווה ייעוץ פיננסי</strong> כמשמעותו בחוק הסדרת העיסוק בייעוץ השקעות, התשנ&quot;ה-1995</li>
              <li><strong>אינו מהווה ייעוץ השקעות</strong> — אנחנו לא בעלי רישיון לייעוץ השקעות</li>
              <li><strong>אינו מהווה ייעוץ מס</strong> — אין לסמוך עליו לצרכי הגשת דוחות לרשות המסים</li>
              <li><strong>אינו מהווה ייעוץ משפטי</strong> — אין לראות בו פרשנות משפטית מחייבת</li>
              <li><strong>אינו מהווה ייעוץ פנסיוני</strong> — אין לקבל החלטות פנסיוניות על בסיסו בלבד</li>
              <li><strong>אינו מהווה המלצת רכישה/מכירה</strong> של ניירות ערך, נכסים, ביטוח או כל מוצר פיננסי</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 אחריות המשתמש לנתונים</h3>
          <p className="mb-3">
            המחשבונים מסתמכים <strong>אך ורק</strong> על הנתונים שאתה מזין.
            תוצאות המחשבונים משקפות נוסחאות כלליות ועשויות:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>לא לכלול גורמים אישיים ייחודיים למצבך</li>
            <li>להיות מבוססות על חקיקה שהשתנתה מאז עדכון אחרון</li>
            <li>לסטות מהחישוב האמיתי של רשות המסים / בנק ישראל</li>
            <li>לא לכלול עלויות נסתרות, עמלות, או השפעות מיסוי אישיות</li>
          </ul>
          <p className="font-medium text-gray-800">
            <strong>אין ערובה לדיוק התוצאות. השתמש בכלים על אחריותך בלבד.</strong>
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.3 המלצה להתייעצות מקצועית</h3>
          <p className="mb-3">
            <strong>לפני כל החלטה פיננסית משמעותית</strong>, בין אם מדובר ברכישת נכס,
            לקיחת הלוואה, החלטת פנסיה, הגשת דוח מס או כל פעולה אחרת — אנא התייעץ עם:
          </p>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>רואה חשבון (CPA) מוסמך</li>
            <li>יועץ השקעות מורשה (לפי חוק הסדרת העיסוק, 1995)</li>
            <li>יועץ פנסיוני מוסמך</li>
            <li>עורך דין המתמחה בתחום הרלוונטי</li>
            <li>מתכנן פיננסי מוסמך (CFP)</li>
          </ul>
        </section>

        {/* 4. שימוש מותר */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            4. שימוש מותר
          </h2>
          <p className="mb-3">מותר לך לעשות שימוש באתר לצרכים הבאים:</p>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>שימוש אישי, לא-מסחרי בכלים ובתוכן</li>
            <li>הפניה לאתר / לדפים ספציפיים (Linking) בהקשר חיובי</li>
            <li>שימוש חינוכי / לצרכי לימוד אישי</li>
            <li>ציטוט קצר עם קרדיט ו-link לאתר</li>
          </ul>
        </section>

        {/* 5. שימוש אסור */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            5. שימוש אסור
          </h2>
          <p className="mb-3">אסור לעשות שימוש באתר לצרכים הבאים:</p>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>גרידה אוטומטית (Scraping) של תוכן האתר ללא אישור מפורש בכתב</li>
            <li>שכפול תוכן האתר לצרכים מסחריים ללא רישיון</li>
            <li>הנדסה לאחור (Reverse Engineering) של המחשבונים</li>
            <li>גישה אוטומטית / בוטים לצורך הפעלת המחשבונים בהיקף גדול</li>
            <li>הצגת תוכן האתר כאילו הוא ייעוץ מקצועי שלך</li>
            <li>כל פעולה שעלולה לפגוע בביצועי האתר או בזמינותו</li>
            <li>כל שימוש שעלול לגרום לנזק לצד שלישי</li>
          </ul>
        </section>

        {/* 6. קניין רוחני */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            6. קניין רוחני
          </h2>
          <p className="mb-3">
            כל התוכן באתר זה — לרבות טקסטים, מחשבונים, קוד, גרפיקה, מדריכים, שמות,
            ועיצוב — הוא רכושו הבלעדי של <strong>{SITE_INFO.owner.name}</strong>
            ומוגן בזכויות יוצרים לפי <strong>חוק זכות יוצרים, התשס&quot;ח-2007</strong>.
          </p>
          <p className="mb-3">
            <strong>כל הזכויות שמורות</strong> — &copy; {SITE_INFO.name}.
            אין להעתיק, לשכפל, להפיץ, לשדר, לשנות, להציג פומבית או לפרסם כל חלק מהתוכן
            ללא אישור מפורש בכתב מהמפעיל.
          </p>
          <p className="text-sm text-gray-600">
            לבקשות שימוש / רישיון / שיתופי פעולה:{' '}
            <a href={`mailto:${SITE_INFO.contact.email}`} className="text-blue-600 hover:underline">
              {SITE_INFO.contact.email}
            </a>
          </p>
        </section>

        {/* 7. קישורים חיצוניים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            7. קישורים לאתרים חיצוניים
          </h2>
          <p className="mb-3">
            האתר עשוי לכלול קישורים לאתרי צד שלישי, לרבות: בנק ישראל, רשות המסים, המוסד לביטוח לאומי,
            הרשות לניירות ערך ואתרים נוספים.
          </p>
          <p className="mb-3">
            אנחנו <strong>לא אחראים</strong> לתוכן, מדיניות הפרטיות, דיוק, זמינות, או כל היבט
            אחר של אתרים חיצוניים. קישור לאתר חיצוני אינו מהווה המלצה על תוכנו.
          </p>
          <p>
            כניסה לאתרים חיצוניים היא על אחריותך הבלעדית.
          </p>
        </section>

        {/* 8. הגבלת אחריות */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            8. הגבלת אחריות
          </h2>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">8.1 כתב ויתור על אחריות</h3>
            <p className="mb-3 font-medium">
              האתר וכל תוכנו ניתנים &quot;כפי שהם&quot; (<em>AS IS</em>) ו&quot;כפי שזמינים&quot;
              (<em>AS AVAILABLE</em>), ללא כל מצג או אחריות מכל סוג — מפורשת או משתמעת — לרבות:
            </p>
            <ul className="list-disc list-inside space-y-1 mr-2">
              <li>אחריות לדיוק, שלמות, עדכניות או מהימנות המידע</li>
              <li>אחריות לכשירות לצורך מסוים</li>
              <li>אחריות לזמינות רציפה של האתר</li>
              <li>אחריות לתוצאות שהתקבלו על בסיס שימוש בכלים</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 פטור מנזקים</h3>
          <p className="mb-3">
            <strong>באף מקרה</strong> לא יהיה המפעיל אחראי לנזקים מכל סוג, לרבות:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3 mr-2">
            <li>נזקים ישירים, עקיפים, מקריים, תוצאתיים, עונשיים או מיוחדים</li>
            <li>אובדן הכנסה, רווח, חיסכון, עסקים או מוניטין</li>
            <li>נזק שנגרם מהסתמכות על תוצאות מחשבון</li>
            <li>נזק שנגרם מהחלטה פיננסית שהתקבלה על בסיס תוכן האתר</li>
            <li>נזק שנגרם מגישה לא מורשית, פריצה, וירוסים, הפרעות שירות</li>
          </ul>

          <div className="bg-gray-100 border border-gray-400 rounded p-4 mt-4">
            <p className="font-medium text-gray-800">
              <strong>8.3 תקרת אחריות:</strong> אם בית משפט מוסמך יחליט כי חלה אחריות על המפעיל
              בכל מקרה שהוא, אחריות זו מוגבלת לסכום של <strong>עשרה שקלים חדשים (10 ₪)</strong>.
            </p>
          </div>
        </section>

        {/* 9. שיפוי */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            9. שיפוי
          </h2>
          <p className="mb-3">
            אתה מסכים לשפות, להגן ולפטור את המפעיל ואת כל מי מטעמו (עובדים, שותפים, נציגים)
            מכל תביעה, הוצאה, נזק, עלות ושכר טרחת עורך דין, הנובעים מ:
          </p>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>הפרה של תנאי שימוש אלה על ידך</li>
            <li>שימוש שעשית באתר בניגוד לתנאים אלה</li>
            <li>הפרת זכויות של צד שלישי בשל פעולותיך</li>
          </ul>
        </section>

        {/* 10. שינויי תנאים */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            10. שינויי תנאים
          </h2>
          <p className="mb-3">
            אנחנו שומרים לעצמנו את הזכות לשנות תנאי שימוש אלה בכל עת.
            שינויים מהותיים יסומנו בראש הדף עם תאריך העדכון.
          </p>
          <p>
            המשך השימוש באתר לאחר פרסום שינויים מהווה <strong>הסכמה</strong> לתנאים המעודכנים.
            אם אינך מסכים לשינויים — הפסק את השימוש באתר.
          </p>
        </section>

        {/* 11. דין חל */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            11. דין חל וסמכות שיפוט
          </h2>
          <p className="mb-3">
            תנאי שימוש אלה, השימוש באתר, וכל תביעה הנובעת מהם יהיו כפופים ל<strong>דין מדינת ישראל</strong>,
            ללא התחשבות בכללי ברירת הדין.
          </p>
          <p>
            סמכות השיפוט הבלעדית לכל מחלוקת הנובעת מתנאים אלה או מהשימוש באתר תהיה
            לבתי המשפט המוסמכים ב<strong>{SITE_INFO.legal.jurisdictionCity}</strong>.
          </p>
        </section>

        {/* 12. הפרדה */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            12. הפרדה (Severability)
          </h2>
          <p>
            אם בית משפט מוסמך יקבע כי סעיף כלשהו בתנאים אלה אינו תקף, בלתי אכיף, או בטל —
            שאר התנאים ימשיכו לחול במלואם. הסעיף הבטל ייחשב כמוחלף בתנאי התקף ביותר
            שניתן להחיל.
          </p>
        </section>

        {/* 13. גרסה מחייבת */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            13. גרסה מחייבת
          </h2>
          <p>
            תנאי שימוש אלה נכתבו בעברית. <strong>הגרסה העברית היא הגרסה המחייבת</strong>.
            תרגום לשפות אחרות, אם יתפרסם, הוא לנוחות בלבד ואין לו תוקף משפטי.
          </p>
        </section>

        {/* 14. יצירת קשר */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            14. יצירת קשר
          </h2>
          <p className="mb-3">
            לשאלות בנוגע לתנאים אלה, אנא פנה אלינו:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>טופס יצירת קשר:</strong>{' '}
              <Link href={SITE_INFO.contact.contactPage} className="text-blue-600 hover:underline">
                {SITE_INFO.domain}{SITE_INFO.contact.contactPage}
              </Link>
            </li>
            <li>
              <strong>דוא&quot;ל:</strong>{' '}
              <a href={`mailto:${SITE_INFO.contact.email}`} className="text-blue-600 hover:underline">
                {SITE_INFO.contact.email}
              </a>
            </li>
          </ul>
        </section>

        {/* תחתית */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-10">
          <p className="text-sm text-gray-700">
            <strong>סיכום:</strong> האתר {SITE_INFO.domain} מספק כלים חינמיים לחישוב וחינוך פיננסי.
            הכלים אינם ייעוץ מקצועי. לפני החלטות פיננסיות — התייעץ עם בעל מקצוע.
            לשאלות:{' '}
            <Link href={SITE_INFO.contact.contactPage} className="text-blue-600 hover:underline">
              {SITE_INFO.contact.contactPage}
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            תאריך עדכון אחרון: {SITE_INFO.legal.termsLastUpdated}
          </p>
        </div>

      </article>
    </div>
  );
}
