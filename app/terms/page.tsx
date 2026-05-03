export const metadata = {
  title: 'תנאי שימוש - FinCalc',
  description: 'תנאי השימוש של FinCalc',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-12">
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">תנאי שימוש</h1>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-8">
          <p className="text-gray-700">
            <strong>⚠️ דף זה עדיין בבנייה</strong>
          </p>
          <p className="text-gray-600 text-sm">
            תנאי השימוש המלאים יתפרסמו לאחר בדיקה משפטית על ידי עורך דין. הפעילות בשלב זה היא בדיקה בלבד.
          </p>
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. קבלת תנאים</h2>
            <p>
              על ידי השימוש באתר זה, אתה מסכים לתנאים אלו.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. כתב ויתור</h2>
            <p>
              המחשבונים באתר זה מהווים עזר כללי בלבד. הם אינם מהווים ייעוץ משפטי, מסי או פיננסי.
              אנא התייעץ עם בעל מקצוע מוסמך לפני קבלת החלטות חשובות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. הגבלת אחריות</h2>
            <p>
              אנחנו אינם אחראים לנזקים שנגרמו לך מהשימוש באתר או מהמידע שבו.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. זכויות יוצרים</h2>
            <p>
              כל התוכן באתר זה מוגן בחוק זכויות יוצרים.
            </p>
          </section>
        </div>

        <div className="bg-blue-50 p-6 rounded mt-12 border border-blue-200">
          <p className="text-sm text-gray-600">
            למשאלות בנוגע לתנאים אלו, אנא <a href="/contact" className="text-blue-600 hover:underline">פנה אלינו</a>.
          </p>
        </div>
      </article>
    </div>
  );
}
