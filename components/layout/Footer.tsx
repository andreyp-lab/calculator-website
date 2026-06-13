import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-cream py-12 px-[6%]">
      <div className="max-w-6xl mx-auto">

        {/* Top row: wordmark + tagline */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-8 border-b border-cream/10">
          <div>
            <div className="font-serif font-black text-2xl leading-none mb-1">
              <span className="text-cream">חשבונ</span><span className="text-gold-light">אי</span>
            </div>
            <span className="font-mono text-[10px] text-cream/40 tracking-[0.14em] uppercase">/ FINSCHOOL</span>
          </div>
          <p className="font-mono text-[10px] text-cream/35 tracking-[0.12em] uppercase">
            כלי פיננסים חינמיים לישראלים ✦ 2026
          </p>
        </div>

        {/* Main link grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* 1. שכירים */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">
              // שכירים
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/salaried" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  כל הכלים לשכירים
                </Link>
              </li>
              <li>
                <Link href="/personal-tax/tax-refund" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  החזר מס
                </Link>
              </li>
              <li>
                <Link href="/personal-tax/salary-net-gross" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  שכר נטו / ברוטו
                </Link>
              </li>
              <li>
                <Link href="/employee-rights/severance" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  פיצויי פיטורין
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. עצמאיים */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">
              // עצמאיים
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/self-employed" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  כל הכלים לעצמאיים
                </Link>
              </li>
              <li>
                <Link href="/self-employed/net" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  נטו לעצמאי
                </Link>
              </li>
              <li>
                <Link href="/self-employed/vat" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  מחשבון מע&quot;מ
                </Link>
              </li>
              <li>
                <Link href="/self-employed/hourly-rate" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  תמחור שעת עבודה
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. הלוואות ונדל"ן */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">
              // הלוואות ונדל&quot;ן
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/loans" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  כל המחשבונים
                </Link>
              </li>
              <li>
                <Link href="/real-estate/mortgage" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  מחשבון משכנתא
                </Link>
              </li>
              <li>
                <Link href="/real-estate/mortgage-optimizer" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  אופטימייזר תמהיל
                </Link>
              </li>
              <li>
                <Link href="/savings/personal-loan" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  הלוואה אישית
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. על האתר */}
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">
              // על האתר
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/course" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  הקורסים
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  אודותינו
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  יצירת קשר
                </Link>
              </li>
              <li>
                <Link href="/blog" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  בלוג
                </Link>
              </li>
              <li>
                <Link href="/guides" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  מדריכים
                </Link>
              </li>
              <li>
                <Link href="/topics" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  נושאים נוספים
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  מילון מונחים
                </Link>
              </li>
              <li>
                <Link href="/compare" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  השוואות
                </Link>
              </li>
              <li>
                <Link href="/news" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  עדכוני שוק
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  פרטיות
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  תנאי שימוש
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                  נגישות
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Secondary: business tools + market data */}
        <div className="border-t border-cream/10 pt-6 mb-8">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4">

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">// כלים לעסקים</span>
              <Link href="/tools" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                מרכז הכלים
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/tools/unified" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                מערכת מאוחדת
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/tools/budget-wizard" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                אשף תקציב
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/tools/cashflow-solo" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                תזרים סולו
              </Link>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">// עדכוני שוק</span>
              <Link href="/news/prime-rate" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                פריים
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/news/cpi" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                מדד
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/news/average-wage" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                שכר ממוצע
              </Link>
              <span className="text-cream/20">✦</span>
              <Link href="/news" className="font-mono text-[11px] text-cream/55 hover:text-gold-light transition-colors">
                כל הנתונים
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom bar: copyright + disclaimer */}
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-sans text-xs text-cream/35">
            © {currentYear} חשבונאי ✦ כל הזכויות שמורות
          </p>
          <p className="font-sans text-xs text-cream/35 sm:text-end max-w-md">
            התוכן באתר אינו ייעוץ משפטי או מקצועי. המחשבונים מבוססים על החוק הישראלי {currentYear}.
          </p>
        </div>

      </div>
    </footer>
  );
}
