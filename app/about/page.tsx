const SITE_URL = 'https://cheshbonai.co.il';

export const metadata = {
  alternates: { canonical: '/about' },
  title: 'אודות — אנדרי פלטונוב, רו״ח וסמנכ״ל כספים | חשבונאי',
  description:
    'חשבונאי נבנה על ידי אנדרי פלטונוב — רואה חשבון מוסמך וסמנכ״ל כספים (CFO) עם 15+ שנות ניסיון בייצור, הייטק, קמעונאות, תקשורת ושירותים. מחשבונים פיננסיים מדויקים בעברית, מעודכנים לחוק 2026.',
  openGraph: {
    title: 'אודות — אנדרי פלטונוב, רו״ח וסמנכ״ל כספים | חשבונאי',
    description:
      'חשבונאי נבנה על ידי אנדרי פלטונוב — רו״ח וסמנכ״ל כספים עם 15+ שנות ניסיון. מחשבונים פיננסיים מדויקים בעברית, מעודכנים לחוק 2026.',
    url: '/about',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'אנדרי פלטונוב',
  jobTitle: 'רואה חשבון מוסמך וסמנכ״ל כספים (CFO)',
  description:
    'רואה חשבון מוסמך וסמנכ״ל כספים עם 15+ שנות ניסיון בניהול פיננסי בענפי הייצור, ההייטק, הקמעונאות, התקשורת והשירותים. מתמחה בניהול כספים והבראת חברות.',
  knowsAbout: [
    'ניהול כספים',
    'הבראת חברות',
    'מיסוי',
    'תזרים מזומנים',
    'בינה מלאכותית בעבודה פיננסית',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'רישיון רואה חשבון',
  },
  worksFor: { '@type': 'Organization', name: 'חשבונאי' },
  url: `${SITE_URL}/about`,
  sameAs: ['https://www.linkedin.com/in/andreypl/'],
};

export default function About() {
  return (
    <div className="min-h-screen bg-cream py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <article className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-6">אודות</h1>

        {/* כרטיס מנחה */}
        <div className="bg-ink p-8 mb-8 text-cream">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-gold text-2xl font-black text-ink">
              א
            </div>
            <div>
              <h2 className="text-2xl font-bold">אנדרי פלטונוב</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-gold-light">
                רו״ח מוסמך · סמנכ״ל כספים (CFO)
              </p>
              <p className="mt-4 leading-relaxed text-cream/80">
                רואה חשבון מוסמך וסמנכ״ל כספים עם <strong className="text-gold-light">15+ שנות ניסיון</strong> בניהול
                פיננסי, בענפי הייצור, ההייטק, הקמעונאות, התקשורת והשירותים. מתמחה בניהול כספים
                ובהבראת חברות — תרגום של מספרים מורכבים להחלטות עסקיות חכמות.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">הרקע המקצועי</h2>
          <p className="text-ink/70 mb-4 leading-relaxed">
            לאורך הקריירה ליוויתי חברות ועצמאים בכל שלב — מהקמת העסק ועד הבראה וצמיחה.
            מתוך הניסיון הזה נולד חשבונאי: מטרת האתר היא להנגיש לכל אדם בישראל מחשבונים פיננסיים
            מדויקים, בלי צורך בייעוץ יקר. כל המחשבונים נבנים בהתאם לחוק ולחוזרי רשות המסים העדכניים,
            עם הסברים מלאים, דוגמאות מציאותיות ומקורות רשמיים.
          </p>
          <p className="text-ink/70 leading-relaxed">
            בשנים האחרונות אני מהמובילים בישראל בשילוב <strong className="text-ink">בינה מלאכותית (Claude)</strong> בעבודה
            הפיננסית — עם אלפי שעות ניסיון מעשי בבניית מחשבונים, אוטומציות וכלים פיננסיים.
            את הידע הזה אני מעביר הלאה בקורסים הדיגיטליים של{' '}
            <a href="/course" className="text-gold hover:text-gold-2 underline">FinSchool</a>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-4">מי יכול להשתמש?</h2>
          <p className="text-ink/70 leading-relaxed">
            כל אדם בישראל — שכירים, עצמאיים ובעלי עסקים קטנים. המחשבונים מתאימים גם ללא ידע טכני,
            ופועלים במלואם במובייל ובדסקטופ.
          </p>
        </section>

        <section className="bg-cream-2 p-8 border-r-4 border-gold">
          <h3 className="text-xl font-bold text-ink mb-3">📋 הערה משפטית חשובה</h3>
          <p className="text-ink/70">
            המחשבונים באתר זה מהווים עזר כללי בלבד ואינם מהווים ייעוץ משפטי, מס או פיננסי.
            אנא התייעצו עם בעל מקצוע מוסמך (רואה חשבון, עורך דין) לפני קבלת החלטות חשובות.
          </p>
        </section>
      </article>
    </div>
  );
}
