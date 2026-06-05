export const metadata = {
  alternates: { canonical: '/about' },
  title: 'אודות חשבונאי – מחשבונים פיננסיים בעברית 2026',
  description: 'חשבונאי הוא אתר מחשבונים פיננסיים בעברית, שנבנה על ידי רואה חשבון מוסמך. חשב מס הכנסה, מע"מ, זכויות עובדים ועוד – בחינם, בקלות ובדיוק מלא לשנת 2026.',
  openGraph: {
    title: 'אודות חשבונאי – מחשבונים פיננסיים בעברית 2026',
    description: 'חשבונאי הוא אתר מחשבונים פיננסיים בעברית, שנבנה על ידי רואה חשבון מוסמך. חשב מס הכנסה, מע"מ, זכויות עובדים ועוד – בחינם, בקלות ובדיוק מלא לשנת 2026.',
    url: '/about',
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-white py-12">
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">אודות הרואה חשבון</h1>

        <div className="bg-blue-50 p-8 rounded-lg mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            חשבונאי בנה על ידי רואה חשבון מוסמך עם ניסיון של יותר מ-15 שנים בתחום המיסוי, זכויות עובדים וייעוץ פיננסי בישראל.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">הרקע המקצועי</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            המטרה של אתר זה היא לספק מחשבונים מדויקים וזולים לכל אדם בישראל, בלי צורך להיכנס לייעוץ יקר.
            כל המחשבונים נבנים בהתאם לחוקים וחוזרי רשות המסים העדכניים.
          </p>
          <p className="text-gray-700 leading-relaxed">
            כל המחשבונים אומתו על ידי בעלי מקצוע בתחומם, וכוללים הסברים מלאים, דוגמאות מציאותיות ומקורות חוקיים.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">מי יכול להשתמש?</h2>
          <p className="text-gray-700 leading-relaxed">
            כל אדם בישראל - עובדים שכירים, עצמאיים, בעלי עסקים קטנים, ועדיין עוד קטגוריות רבות.
            המחשבונים מתאימים גם ללא ידע טכני ופונקציונליים במובייל וגם בדסקטופ.
          </p>
        </section>

        <section className="bg-green-50 p-8 rounded-lg border-l-4 border-green-600">
          <h3 className="text-xl font-bold text-gray-900 mb-3">📋 הערה משפטית חשובה</h3>
          <p className="text-gray-700">
            המחשבונים באתר זה מהווים עזר כללי בלבד ואינם מהווים ייעוץ משפטי, מס או פיננסי.
            אנא התייעץ עם בעל מקצוע מוסמך (רואה חשבון, עורך דין) לפני קבלת החלטות חשובות.
          </p>
        </section>
      </article>
    </div>
  );
}
