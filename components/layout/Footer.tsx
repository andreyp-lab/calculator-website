import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main grid - 4 balanced columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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
                  מחשבון מע&quot;מ
                </Link>
              </li>
              <li>
                <Link href="/self-employed/hourly-rate" className="hover:text-blue-600">
                  תמחור שעת עבודה
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. הלוואות + נדל"ן */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">🏠 הלוואות ונדל&quot;ן</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/loans" className="hover:text-blue-600 font-semibold">
                  כל המחשבונים
                </Link>
              </li>
              <li>
                <Link href="/real-estate/mortgage" className="hover:text-blue-600">
                  מחשבון משכנתא
                </Link>
              </li>
              <li>
                <Link href="/real-estate/mortgage-optimizer" className="hover:text-blue-600">
                  🆕 אופטימייזר תמהיל
                </Link>
              </li>
              <li>
                <Link href="/savings/personal-loan" className="hover:text-blue-600">
                  הלוואה אישית
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. אודות + משפטי */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">📂 על האתר</h3>
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
              <li>
                <Link href="/guides" className="hover:text-blue-600">
                  מדריכים
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-blue-600">
                  מילון מונחים
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600">
                  השוואות
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-blue-600">
                  עדכוני שוק
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
              <li>
                <Link href="/accessibility" className="hover:text-blue-600">
                  נגישות
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Secondary row - business tools + market data (compact) */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-purple-700">🚀 כלים לעסקים:</span>
              <Link href="/tools" className="text-gray-600 hover:text-purple-600">
                מרכז הכלים
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/tools/unified" className="text-gray-600 hover:text-purple-600">
                מערכת מאוחדת
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/tools/budget-wizard" className="text-gray-600 hover:text-purple-600">
                אשף תקציב
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/tools/cashflow-solo" className="text-gray-600 hover:text-purple-600">
                תזרים סולו
              </Link>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">📊 עדכוני שוק:</span>
              <Link href="/news/prime-rate" className="text-gray-600 hover:text-blue-600">
                פריים
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/news/cpi" className="text-gray-600 hover:text-orange-600">
                מדד
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/news/average-wage" className="text-gray-600 hover:text-green-600">
                שכר ממוצע
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/news" className="text-gray-600 hover:text-blue-600">
                כל הנתונים
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>© {currentYear} FinCalc. כל הזכויות שמורות.</p>
          <p className="mt-2 text-xs">
            התוכן באתר זה אינו ייעוץ משפטי או מקצועי. כל המחשבונים מבוססים על החוק הישראלי 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
