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
  LineChart,
  Lock,
  Database,
  HelpCircle,
} from 'lucide-react';

export default function StartPage() {
  const { scenario } = useTools();
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <div className="max-w-7xl mx-auto py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          איך תרצה להתחיל?
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          בחר את המסלול שמתאים למצב שלך. כל מסלול נותן גישה לכל הכלים — רק נקודת ההתחלה משתנה.
        </p>
      </div>

      {/* Existing data banner */}
      {hasExistingData && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
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
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
          >
            המשך לעבוד עליו
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* === 4 PRIMARY PATHS === */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Path 1: Wizard - For beginners */}
        <PathCard
          href="/tools/budget-wizard"
          icon={Sparkles}
          gradient="from-violet-500 via-purple-600 to-fuchsia-600"
          recommendedFor="🚀 למתחילים"
          title="אשף תקציב חכם"
          subtitle="10 שאלות מודרכות → תקציב + תזרים + ניתוח מוכנים"
          description="נשאל אותך שאלות פשוטות על העסק (ענף, הכנסות, עובדים, הוצאות) וניצור עבורך תקציב מקצועי. מוצג בנצ'מרק ענפי בכל שלב."
          duration="~3 דקות"
          features={[
            'שאלות צעד-אחר-צעד',
            'הזנה פרטנית של עובדים וספקים',
            'בנצ\'מרק לפי 10 ענפים',
            'יוצר אוטומטית תקציב + תזרים + ניתוח',
          ]}
          when="כשאני לא יודע מאיפה להתחיל"
        />

        {/* Path 2: Full Unified */}
        <PathCard
          href="/tools/unified"
          icon={LayoutDashboard}
          gradient="from-blue-600 via-indigo-700 to-purple-700"
          recommendedFor="🎯 למקצוענים"
          title="מערכת מאוחדת"
          subtitle="תקציב + תזרים + ניתוח + חיזוי במקום אחד"
          description="גישה ישירה לכל 30+ הכלים. הזן בעצמך הכנסות, הוצאות, עובדים, הלוואות. כל המודולים מסונכרנים — שינוי באחד מתעדכן בכולם."
          duration="גישה מיידית"
          features={[
            '5 מודולים בדף אחד',
            'KPI Bar חי בראש',
            'תובנות חוצות-מערכת',
            'תרחישים מרובים + השוואה',
          ]}
          when="כשיש לי נתונים ואני יודע מה לעשות"
        />

        {/* Path 3: Cash Flow Solo */}
        <PathCard
          href="/tools/cashflow-solo"
          icon={Wallet}
          gradient="from-emerald-500 via-teal-600 to-cyan-700"
          recommendedFor="⚡ לרואי חשבון"
          title="תזרים בלבד (סולו)"
          subtitle="תזרים מזומנים ללא תקציב — הזנה ישירה"
          description="אם יש לך כבר נתונים מהבנק או רוצה רק לחזות תזרים. הזן תקבולים ותשלומים לפי תאריכים, פריטים חוזרים אוטומטית. ללא תלות בתקציב."
          duration="~5 דקות"
          features={[
            'הזנת פריטים לפי תאריך',
            'פריטים חוזרים (חודשי/רבעוני/שנתי)',
            'דשבורד מלא + גרפים + פאיים',
            'מתאים לפגישה בבנק',
          ]}
          when="כשרק תזרים מעניין אותי"
        />

        {/* Path 4: Forecast & Valuation */}
        <PathCard
          href="/tools/forecast"
          icon={LineChart}
          gradient="from-rose-500 via-pink-600 to-fuchsia-600"
          recommendedFor="💎 ליזמים ומשקיעים"
          title="חיזוי + הערכת שווי"
          subtitle="מודל 3-דוחות (P&L+מאזן+תזרים) + DCF + Cap Table"
          description="אם יש לך נתוני עבר ורוצה לבנות תחזית 3-5 שנים, להעריך את שווי החברה (DCF), או לסמלץ סבבי גיוס וChart. כולל Monte Carlo ו-Cohort."
          duration="~10 דקות"
          features={[
            'תחזית 3-5 שנים (P&L+מאזן+תזרים)',
            'DCF Valuation מלא',
            'Cap Table + סבבי גיוס',
            'Monte Carlo + Cohort (LTV/CAC)',
          ]}
          when="כשאני יזם, משקיע, או מכין pitch"
        />
      </div>

      {/* Trust signals */}
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <TrustSignal icon={Lock} title="פרטיות מלאה" description="הנתונים נשמרים בדפדפן שלך בלבד" />
        <TrustSignal icon={Database} title="שמירה אוטומטית" description="עובד גם offline אחרי טעינה" />
        <TrustSignal icon={HelpCircle} title="בלי הרשמה" description="אין צורך במייל או סיסמה" />
      </div>

      {/* Skip option */}
      <div className="text-center mb-4">
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

      {/* Advanced - direct deep links (collapsed by default) */}
      <div className="border-t border-gray-200 pt-5">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
        >
          <span>{showAdvanced ? '▾' : '▸'}</span>
          קישורים ישירים (Power Users)
        </button>

        {showAdvanced && (
          <div className="mt-4 grid md:grid-cols-3 gap-2 text-sm">
            <DeepLink href="/tools/budget" label="תקציב נפרד" description="רק טאב Budget" />
            <DeepLink href="/tools/cash-flow" label="תזרים נפרד" description="רק טאב Cash Flow" />
            <DeepLink
              href="/tools/financial-analysis"
              label="ניתוח דוחות נפרד"
              description="רק טאב Analysis"
            />
            <DeepLink
              href="/tools/capital"
              label="הון ושווי"
              description="DCF + Cap Table"
            />
            <DeepLink
              href="/tools/forecast"
              label="חיזוי בלבד"
              description="3-Statement + Monte Carlo"
            />
            <DeepLink
              href="/tools"
              label="כל המחשבונים"
              description="חזרה לדף הראשי"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

function PathCard({
  href,
  icon: Icon,
  gradient,
  recommendedFor,
  title,
  subtitle,
  description,
  duration,
  features,
  when,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  gradient: string;
  recommendedFor: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  features: string[];
  when: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${gradient} p-5 text-white`}>
        <div className="flex items-start justify-between mb-3">
          <Icon className="w-10 h-10" />
          <span className="bg-white/25 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-medium">
            {recommendedFor}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-1.5">{title}</h3>
        <p className="text-sm opacity-95 leading-relaxed">{subtitle}</p>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{description}</p>

        <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-4 text-xs text-purple-900">
          <strong>מתי לבחור:</strong> {when}
        </div>

        <ul className="space-y-1.5 mb-4 flex-1">
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
            {duration}
          </span>
          <span className="text-purple-600 group-hover:text-purple-800 font-bold text-sm flex items-center gap-1">
            התחל
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function TrustSignal({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Lock;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
      <div className="bg-white rounded-full p-2 shrink-0">
        <Icon className="w-4 h-4 text-gray-700" />
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
    </div>
  );
}

function DeepLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded p-2 flex items-center justify-between transition"
    >
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <ArrowLeft className="w-3 h-3 text-gray-400" />
    </Link>
  );
}
