'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  LayoutDashboard,
  Wallet,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function StartPage() {
  const { scenario, scenariosList } = useTools();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);

  // אם יש כבר תרחיש פעיל עם נתונים - הצע לדלג
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const skipStart = localStorage.getItem('skipStartScreen');
    if (skipStart === 'true' && scenario && scenario.budget.income.length > 0) {
      router.replace('/tools/unified');
    }
  }, [scenario, router]);

  const hasExistingData =
    scenario && (scenario.budget.income.length > 0 || scenario.budget.expenses.length > 0);

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          ברוך הבא — איך תרצה להתחיל?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          בחר את המצב שמתאים לך. כל מצב נותן לך גישה מלאה לכל הכלים, אבל מתאים את המסע לפי הצרכים שלך.
        </p>
      </div>

      {/* Existing data banner */}
      {hasExistingData && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <div className="font-semibold text-blue-900">יש לך תרחיש קיים</div>
              <div className="text-sm text-blue-800">
                "{scenario?.name}" - {scenario?.budget.income.length} הכנסות,{' '}
                {scenario?.budget.expenses.length} הוצאות
              </div>
            </div>
          </div>
          <Link
            href="/tools/unified"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
          >
            המשך לעבוד עליו
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3 Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Wizard */}
        <ModeCard
          href="/tools/budget-wizard"
          icon={Sparkles}
          gradient="from-violet-500 via-purple-600 to-fuchsia-600"
          badge="🚀 מומלץ למתחילים"
          title="אשף תקציב חכם"
          subtitle="10 שאלות → תקציב מוכן"
          description="מתאים אם זו פעם ראשונה ואתה לא יודע מאיפה להתחיל. נשאל אותך שאלות פשוטות וניצור עבורך תקציב מקצועי תוך 3 דקות."
          features={[
            'בנצ\'מרק ענפי בכל שלב',
            'שמירת התקדמות אוטומטית',
            'בסוף - תקציב + תזרים + ניתוח מוכנים',
          ]}
          time="~3 דקות"
        />

        {/* Card 2: Full */}
        <ModeCard
          href="/tools/unified"
          icon={LayoutDashboard}
          gradient="from-blue-500 via-indigo-600 to-purple-700"
          badge="🎯 הכי מקיף"
          title="מערכת מלאה"
          subtitle="תקציב + תזרים + ניתוח"
          description="מתאים לעסק שיודע מה הוא צריך. תקבל גישה מיידית ל-30+ כלים: תקציב, תזרים, ניתוח דוחות, חיזוי, הערכת שווי, Cap Table."
          features={[
            'KPI Bar חי + תובנות חוצות-מערכת',
            '11 טאבי ניתוח כולל DuPont, DSCR, סיכונים',
            'מודל 5 שנים + DCF + Cap Table',
          ]}
          time="גישה מיידית"
        />

        {/* Card 3: Solo */}
        <ModeCard
          href="/tools/cashflow-solo"
          icon={Wallet}
          gradient="from-emerald-500 via-teal-600 to-cyan-700"
          badge="⚡ הכי מהיר"
          title="תזרים בלבד"
          subtitle="ללא תקציב, רק תזרים מזומנים"
          description="מתאים אם יש לך כבר נתונים מהבנק או רוצה רק לחזות תזרים ל-6 חודשים. תזין תקבולים ותשלומים ישירות, בלי צורך בתקציב מובנה."
          features={[
            'הזנה ישירה של פריטים לפי תאריך',
            'פריטים חוזרים (חודשי/רבעוני/שנתי)',
            'אפשרות לעבור לתקציב מלא בכל שלב',
          ]}
          time="~5 דקות"
        />
      </div>

      {/* Bottom info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          מה שצריך לדעת
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>תוכל לעבור בין מצבים בכל זמן</strong> — אם בחרת תזרים סולו ואחר כך תרצה תקציב מלא, זה אפשרי.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>הנתונים שלך נשמרים מקומית</strong> — דפדפן בלבד, אין חיוב, אין הרשמה.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>אפשר לייצא את הכל ל-Excel ו-PDF</strong> בכל שלב.
            </span>
          </li>
        </ul>
      </div>

      {/* Skip option */}
      <div className="text-center mt-6">
        <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem('skipStartScreen', 'true');
              } else {
                localStorage.removeItem('skipStartScreen');
              }
            }}
            className="w-4 h-4"
          />
          <span>אל תציג את המסך הזה שוב (אם יש לי תרחיש פעיל)</span>
        </label>
      </div>
    </div>
  );
}

function ModeCard({
  href,
  icon: Icon,
  gradient,
  badge,
  title,
  subtitle,
  description,
  features,
  time,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  gradient: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  time: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
        <div className="flex items-start justify-between mb-3">
          <Icon className="w-12 h-12" />
          <span className="bg-white/25 backdrop-blur px-2 py-0.5 rounded-full text-xs font-medium">
            {badge}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{description}</p>

        <ul className="space-y-2 mb-4 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </span>
          <span className="text-blue-600 group-hover:text-blue-800 font-medium text-sm flex items-center gap-1">
            התחל
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </span>
        </div>
      </div>
    </Link>
  );
}
