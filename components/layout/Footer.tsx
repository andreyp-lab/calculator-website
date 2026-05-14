import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 1. שכירים */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">👤 שכירים</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/salaried" className="hover:text-blue-600 font-semibold">
                  כל הכלים לשכירים
                </Link>
              </li>
              <li>
                <Link href="/personal-tax/tax-refund" className="hover:text-blue-600">
                  ⭐ החזר מס
                </Link>
              </li>
              <li>
                <Link href="/personal-tax/salary-net-gross" className="hover:text-blue-600">
                  שכר נטו / ברוטו
                </Link>
              </li>
              <li>
                <Link href="/employee-rights/severance" className="hover:text-blue-600">
                  פיצויי פיטורין
                </Link>
              </li>
              <li>
                <Link href="/employee-rights/recreation-pay" className="hover:text-blue-600">
                  דמי הבראה
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. עצמאיים */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">💼 עצמאיים</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/self-employed" className="hover:text-blue-600 font-semibold">
                  כל הכלים לעצמאיים
                </Link>
              </li>
              <li>
                <Link href="/self-employed/net" className="hover:text-blue-600">
                  💰 נטו לעצמאי
                </Link>
              </li>
              <li>
                <Link href="/self-employed/vat" className="hover:text-blue-600">
                  מחשבון מע"מ
                </Link>
              </li>
              <li>
                <Link href="/self-employed/hourly-rate" className="hover:text-blue-600">
                  תמחור שעת עבודה
                </Link>
              </li>
              <li>
                <Link href="/self-employed/tax-advances" className="hover:text-blue-600">
                  מקדמות מס
                </Link>
              </li>
              <li>
                <Link href="/self-employed/employer-cost" className="hover:text-blue-600">
                  עלות מעסיק
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. כלים לבעלי עסקים */}
          <div>
            <h3 className="font-bold text-purple-700 mb-4">🚀 כלים לבעלי עסקים</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/tools" className="hover:text-purple-600 font-semibold">
                  מרכז הכלים
                </Link>
              </li>
              <li>
                <Link href="/tools/start" className="hover:text-purple-600">
                  התחל כאן
                </Link>
              </li>
              <li>
                <Link href="/tools/unified" className="hover:text-purple-600">
                  מערכת מאוחדת
                </Link>
              </li>
              <li>
                <Link href="/tools/budget-wizard" className="hover:text-purple-600">
                  אשף תקציב
                </Link>
              </li>
              <li>
                <Link href="/tools/cashflow-solo" className="hover:text-purple-600">
                  תזרים סולו
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. נושאים אחרים + אודות */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">📂 נושאים אחרים</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/topics" className="hover:text-blue-600 font-semibold">
                  כל הנושאים
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="hover:text-blue-600">
                  משכנתא ונדל"ן
                </Link>
              </li>
              <li>
                <Link href="/savings" className="hover:text-blue-600">
                  חיסכון והשקעות
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-blue-600">
                  ביטוחים ופנסיה
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="hover:text-blue-600">
                  רכב ותחבורה
                </Link>
              </li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-6 mb-3 text-sm">אודות</h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
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
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  פרטיות
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
