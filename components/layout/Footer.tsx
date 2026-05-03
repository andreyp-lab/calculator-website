import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">אודות</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  אודות הרואה חשבון
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

          <div>
            <h3 className="font-bold text-gray-900 mb-4">קטגוריות</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/employee-rights" className="hover:text-blue-600">
                  זכויות עובדים
                </Link>
              </li>
              <li>
                <Link href="/personal-tax" className="hover:text-blue-600">
                  מיסוי אישי
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">עקוב</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>© {currentYear} FinCalc. כל הזכויות שמורות.</p>
          <p className="mt-2 text-xs">התוכן באתר זה אינו ייעוץ משפטי או מקצועי.</p>
        </div>
      </div>
    </footer>
  );
}
