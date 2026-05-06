import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">📐 פיננסי אישי</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/salaried" className="hover:text-blue-600 font-semibold">
                  👤 שכירים
                </Link>
              </li>
              <li>
                <Link href="/self-employed" className="hover:text-blue-600 font-semibold">
                  💼 עצמאיים
                </Link>
              </li>
              <li>
                <Link href="/personal-tax" className="hover:text-blue-600 text-xs">
                  → מיסוי אישי
                </Link>
              </li>
              <li>
                <Link href="/employee-rights" className="hover:text-blue-600 text-xs">
                  → זכויות עובדים
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="hover:text-blue-600">
                  משכנתא ונדל&quot;ן
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">💰 חיסכון וצמיחה</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/investments" className="hover:text-blue-600">
                  השקעות
                </Link>
              </li>
              <li>
                <Link href="/savings" className="hover:text-blue-600">
                  חיסכון וחובות
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-blue-600">
                  ביטוחים
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="hover:text-blue-600">
                  רכב ותחבורה
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-purple-700 mb-4">🚀 כלים לבעלי עסקים</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/tools/unified" className="hover:text-purple-600">
                  מערכת מאוחדת
                </Link>
              </li>
              <li>
                <Link href="/tools/budget" className="hover:text-purple-600">
                  תכנון תקציב
                </Link>
              </li>
              <li>
                <Link href="/tools/cash-flow" className="hover:text-purple-600">
                  תזרים מזומנים
                </Link>
              </li>
              <li>
                <Link href="/tools/financial-analysis" className="hover:text-purple-600">
                  ניתוח דוחות
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">אודות</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  אודותינו
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  יצירת קשר
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-600">
                  בלוג
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">משפטי</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  תנאי שימוש
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>© {currentYear} FinCalc. כל הזכויות שמורות.</p>
          <p className="mt-2 text-xs">
            התוכן באתר זה אינו ייעוץ משפטי או מקצועי. כל המחשבונים מבוססים על החוק הישראלי 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
