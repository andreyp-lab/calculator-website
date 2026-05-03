import Link from 'next/link';
import { navigation } from '@/lib/config/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            מחשבוני זכויות פיננסיות בישראל
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            מחשבונים מקצועיים ודיוקים לחישוב פיצויי פיטורין, מס הכנסה, משכנתא וזכויות עובדים.
            כל התוצאות מבוססות על החוק הישראלי העדכני.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#calculators"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
            >
              בואו נתחיל
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 bg-white p-8 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
            <p className="text-gray-600">מחשבונים מקצועיים</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-600">דיוק חוקי</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">עדכני</div>
            <p className="text-gray-600">2026</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="calculators" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">בחר קטגוריה</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {navigation.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                {category.label}
              </h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <div className="flex items-center gap-2 mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm font-medium">עבור למחשבונים</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-12 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">אודות האתר</h2>
          <p className="text-gray-600 max-w-3xl mb-4">
            FinCalc הוא אתר מחשבונים פיננסיים בעברית, נבנה על ידי רואה חשבון מוסמך עם ניסיון רב בתחום.
            כל המחשבונים בנויים בהתאם לחוק ותקנות בישראל, ועדכנים לשנה הנוכחית.
          </p>
          <p className="text-gray-600">
            <strong>הערה חשובה:</strong> התוכן באתר זה אינו מהווה ייעוץ משפטי או מקצועי, והוא מיועד לעזר כללי בלבד.
            אנא התייעץ עם רואה חשבון או עורך דין לפני קבלת החלטות פיננסיות חשובות.
          </p>
        </div>
      </section>
    </div>
  );
}
