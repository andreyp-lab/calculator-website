import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'מדריך למשכנתא בישראל 2026 — מסלולים, מגבלות והשוואת הצעות',
  description: 'מה לבדוק לפני לקיחת משכנתא: שיעור מימון, יכולת החזר, מסלולי ריבית, אישור עקרוני, פירעון מוקדם ומיחזור.',
  alternates: { canonical: '/guides/mortgage-complete-guide-2026' },
};

const bankOfIsraelGuide = 'https://www.boi.org.il/information/bank-paymnts/financial-education/%D7%94%D7%A8%D7%A4%D7%95%D7%A8%D7%9E%D7%94-%D7%9C%D7%94%D7%92%D7%91%D7%A8%D7%AA-%D7%A9%D7%A7%D7%99%D7%A4%D7%95%D7%AA-%D7%94%D7%9E%D7%99%D7%93%D7%A2-%D7%95%D7%94%D7%AA%D7%97%D7%A8%D7%95%D7%AA-%D7%91%D7%9E%D7%A9%D7%9B%D7%A0%D7%AA%D7%90%D7%95%D7%AA/';

export default function MortgageCompleteGuide() {
  return <main dir="rtl" className="mx-auto max-w-4xl px-5 py-12 text-ink">
    <nav aria-label="פירורי לחם" className="mb-8 text-sm text-ink/70">
      <Link href="/">דף הבית</Link> / <Link href="/real-estate">נדל״ן</Link> / מדריך משכנתא
    </nav>
    <h1 className="mb-5 text-3xl font-bold md:text-4xl">מדריך למשכנתא בישראל 2026</h1>
    <p className="mb-10 text-lg leading-relaxed">משכנתא מורכבת לעיתים מכמה מסלולים, שלכל אחד מהם ריבית, הצמדה, מועדי שינוי ועלויות פירעון שונות. לפני בחירה, אספו אישורים עקרוניים כתובים והשוו הצעות לאותו סכום ולתקופות דומות.</p>

    <div className="space-y-10 leading-relaxed">
      <section>
        <h2 className="mb-3 text-2xl font-bold">1. בודקים הון עצמי ויכולת החזר</h2>
        <p>שיעור המימון הוא היחס בין סכום המשכנתא לשווי הנכס כפי שהוא מוכר לבנק. הוראת בנק ישראל 329 קובעת תקרות שונות לפי סוג הרכישה: עד 75% לדירה יחידה, עד 70% לדירה חליפית ועד 50% לדירה להשקעה, בכפוף להגדרות ולתנאי ההוראה. לבנק שיקול דעת להציע מימון נמוך מהתקרה.</p>
        <p className="mt-3">בדקו כמה הכנסה תישאר לאחר ההחזר, חובות אחרים והוצאות מחיה. שיעור החזר מרבי לפי ההוראה אינו יעד אישי מומלץ; הבנק בוחן גם את הכנסתם ואת מאפייני ההלוואה. הותירו כסף לעלויות עסקה ולמצבים שבהם ההכנסה יורדת או ההחזר עולה.</p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold">2. מבינים את המסלולים</h2>
        <ul className="list-disc space-y-2 pr-6">
          <li><strong>קבועה לא צמודה:</strong> הריבית והקרן אינן מושפעות משינוי במדד או בריבית לאחר העמדת ההלוואה, לפי תנאי המסלול.</li>
          <li><strong>קבועה צמודה:</strong> הריבית קבועה אך הקרן וההחזר מושפעים מהמדד.</li>
          <li><strong>פריים:</strong> הריבית עשויה להשתנות עם ריבית הפריים, כולל המרווח שנקבע בהסכם.</li>
          <li><strong>משתנה אחרת:</strong> בדקו את העוגן, מועדי שינוי הריבית והאם המסלול צמוד למדד.</li>
        </ul>
        <p className="mt-3">הוראה 329 מגבילה את החלק בריבית משתנה לשני שלישים לכל היותר. אין בה מגבלת שליש נפרדת למסלול פריים. עמידה במגבלה אינה מוכיחה שתמהיל מסוים מתאים למשפחה או יאושר על ידי הבנק.</p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold">3. משווים אישורים עקרוניים</h2>
        <p>באישורים העקרוניים מציג הבנק, בין היתר, את הריבית הכוללת החזויה, התשלום החודשי הראשון, התשלום החודשי הגבוה ביותר הצפוי ואת סך התשלומים החזוי. התחזיות תלויות בהנחות ולכן אינן הבטחה לעלות העתידית.</p>
        <p className="mt-3">השוו גם את סכום ותקופת כל מסלול, הצמדה, מועדי שינוי ריבית, עמלות, עלויות ביטוח ותנאי פירעון מוקדם. בקשו מהבנק להראות כיצד משתנה ההחזר אם הריבית או המדד עולים.</p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold">4. מתכננים פירעון מוקדם או מיחזור</h2>
        <p>עמלות פירעון מוקדם תלויות במסלול, במועד ובתנאי ההלוואה. גם כאשר עמלת הפרשי היוון אינה חלה, ייתכנו עמלות אחרות. לפני מיחזור בקשו מהבנק יתרת סילוק ופרטי עמלות לפי מסלול, והשוו את עלות ההלוואה הקיימת לעלות ההצעה החדשה כולל כל ההוצאות.</p>
      </section>
    </div>

    <div className="mt-12 border-r-4 border-gold bg-cream-2 p-6">
      <h2 className="mb-3 text-xl font-bold">כלים ומקורות להמשך בדיקה</h2>
      <ul className="list-disc space-y-2 pr-6">
        <li><Link className="text-gold underline" href="/real-estate/mortgage">אומדן שפיצר או קרן שווה</Link> למסלול אחד בריבית קבועה שתזינו. המחשבון אינו מדמה שינויי ריבית, הצמדה או תמהיל מלא.</li>
        <li><Link className="text-gold underline" href="/real-estate/mortgage-optimizer">מדריך השוואת תמהילים</Link> עם רשימת הנתונים שכדאי לבקש מכל בנק.</li>
        <li><a className="text-gold underline" href={bankOfIsraelGuide} target="_blank" rel="noopener noreferrer">מדריך בנק ישראל להשוואת הצעות משכנתא ↗</a></li>
        <li><a className="text-gold underline" href="https://www.boi.org.il/media/141cr3bf/111581.pdf" target="_blank" rel="noopener noreferrer">הוראת ניהול בנקאי תקין 329 ↗</a></li>
        <li><a className="text-gold underline" href="https://www.boi.org.il/information/interestrates/mortgage/" target="_blank" rel="noopener noreferrer">מידע בנק ישראל על ריביות ועמלות פירעון מוקדם ↗</a></li>
      </ul>
    </div>
    <p className="mt-6 text-sm text-ink/70">עודכן בספטמבר 2026. הנתונים במדריך כלליים; את תנאי ההלוואה האישיים יש לבדוק מול הבנק במסמכים הכתובים.</p>
  </main>;
}
