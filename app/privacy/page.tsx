export const metadata = {
  title: 'מדיניות פרטיות - FinCalc',
  description: 'מדיניות הפרטיות של FinCalc',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-12">
      <article className="max-w-3xl mx-auto px-4 prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">מדיניות פרטיות</h1>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-8">
          <p className="text-gray-700">
            <strong>⚠️ דף זה עדיין בבנייה</strong>
          </p>
          <p className="text-gray-600 text-sm">
            מדיניות הפרטיות המלאה תתפרסם לאחר בדיקה משפטית על ידי עורך דין. הפעילות בשלב זה היא בדיקה בלבד.
          </p>
        </div>

        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">מבוא</h2>
            <p>
              מדיניות זו מתארת כיצד אנחנו אוספים, משתמשים ומגנים על המידע שלך.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">אוסף מידע</h2>
            <p>
              אנחנו אוספים מידע בכמה דרכים:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>מידע שאתה מספק הוא בעצמך (טופס, חיפוש וכו')</li>
              <li>מידע טכני ממערכות שלנו (IP, device, וכו')</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">זכויותיך</h2>
            <p>
              יש לך זכויות רבות בנוגע למידע שלך, כולל זכות לגישה, תיקון והסרה.
            </p>
          </div>
        </section>

        <div className="bg-blue-50 p-6 rounded mt-12 border border-blue-200">
          <p className="text-sm text-gray-600">
            למשאלות בנוגע למדיניות זו, אנא <a href="/contact" className="text-blue-600 hover:underline">פנה אלינו</a>.
          </p>
        </div>
      </article>
    </div>
  );
}
