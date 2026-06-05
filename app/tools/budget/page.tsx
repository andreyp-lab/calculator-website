'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScenarioBar } from '@/components/tools/ScenarioBar';
import { SettingsCard } from '@/components/tools/SettingsCard';
import { IncomeManager } from '@/components/tools/IncomeManager';
import { ExpenseManager } from '@/components/tools/ExpenseManager';
import { LoanManager } from '@/components/tools/LoanManager';
import { EmployeeManager } from '@/components/tools/EmployeeManager';
import { PLSummary } from '@/components/tools/PLSummary';
import { ExportImportBar } from '@/components/tools/ExportImportBar';
import { BudgetCharts } from '@/components/tools/BudgetCharts';
import { EmployeeAnalysis } from '@/components/tools/EmployeeAnalysis';
import { AdvancedAnalytics } from '@/components/tools/AdvancedAnalytics';
import { IndustryBenchmarks } from '@/components/tools/IndustryBenchmarks';
import { TemplatesLibrary } from '@/components/tools/TemplatesLibrary';
import { WorkingCapitalOptimizer } from '@/components/tools/WorkingCapitalOptimizer';
import { GoalsTracker } from '@/components/tools/GoalsTracker';
import {
  TrendingUp,
  ChartBar,
  Users,
  Sparkles,
  Trophy,
  Layout,
  Settings as SettingsIcon,
  Target,
} from 'lucide-react';

type AnalyticsTab =
  | 'templates'
  | 'charts'
  | 'employees'
  | 'advanced'
  | 'benchmarks'
  | 'wc'
  | 'goals';

export default function BudgetPage() {
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('charts');

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">תכנון תקציב</h2>
            <p className="text-sm text-gray-600">
              נהל הכנסות, הוצאות, עובדים והלוואות. קבל P&L מלא בזמן אמת.
            </p>
          </div>
        </div>
        <ExportImportBar />
      </div>

      <ScenarioBar />
      <SettingsCard />

      {/* Top: Inputs + P&L */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <IncomeManager />
          <ExpenseManager />
          <EmployeeManager />
          <LoanManager />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <PLSummary />
          </div>
        </div>
      </div>

      {/* Bottom: Analytics tabs */}
      <div className="mt-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-2 shadow-sm flex flex-wrap gap-1 mb-4">
          <TabButton
            active={analyticsTab === 'templates'}
            onClick={() => setAnalyticsTab('templates')}
            icon={Layout}
            label="תבניות מוכנות"
            color="violet"
          />
          <TabButton
            active={analyticsTab === 'charts'}
            onClick={() => setAnalyticsTab('charts')}
            icon={ChartBar}
            label="גרפים פיננסיים"
            color="blue"
          />
          <TabButton
            active={analyticsTab === 'employees'}
            onClick={() => setAnalyticsTab('employees')}
            icon={Users}
            label="ניתוח עובדים"
            color="purple"
          />
          <TabButton
            active={analyticsTab === 'advanced'}
            onClick={() => setAnalyticsTab('advanced')}
            icon={Sparkles}
            label="אנליזה מתקדמת"
            color="indigo"
          />
          <TabButton
            active={analyticsTab === 'benchmarks'}
            onClick={() => setAnalyticsTab('benchmarks')}
            icon={Trophy}
            label="בנצ'מרק ענפי"
            color="emerald"
          />
          <TabButton
            active={analyticsTab === 'wc'}
            onClick={() => setAnalyticsTab('wc')}
            icon={SettingsIcon}
            label="הון חוזר"
            color="cyan"
          />
          <TabButton
            active={analyticsTab === 'goals'}
            onClick={() => setAnalyticsTab('goals')}
            icon={Target}
            label="יעדים"
            color="rose"
          />
        </div>

        {analyticsTab === 'templates' && <TemplatesLibrary />}
        {analyticsTab === 'charts' && <BudgetCharts />}
        {analyticsTab === 'employees' && <EmployeeAnalysis />}
        {analyticsTab === 'advanced' && <AdvancedAnalytics />}
        {analyticsTab === 'benchmarks' && <IndustryBenchmarks />}
        {analyticsTab === 'wc' && <WorkingCapitalOptimizer />}
        {analyticsTab === 'goals' && <GoalsTracker />}
      </div>

      {/* SEO content section */}
      <article className="mt-10 prose prose-sm max-w-none text-right" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          מחשבון תקציב עסקי 2026 — תכנון הכנסות, הוצאות ורווח והפסד
        </h1>
        <p className="text-gray-700 mb-4">
          כלי תכנון התקציב של חשבונאי מאפשר לבעלי עסקים, מנהלי כספים ויזמים לבנות תקציב שנתי
          או חודשי מפורט בזמן אמת. הזינו הכנסות ממקורות שונים, הוצאות קבועות ומשתנות, עלויות
          עובדים והלוואות — וקבלו דוח רווח והפסד (P&L) מיידי עם גרפים, ניתוח עובדים ובנצ׳מרק ענפי.
        </p>
        <p className="text-gray-700 mb-4">
          המחשבון מעודכן לנתוני 2026: שכר מינימום 6,443.85 ₪ (מ-1.4.2026), מע״מ 18%, ודמי ביטוח
          לאומי עדכניים. כל השינויים בחקיקה ובתעריפים משתקפים אוטומטית בחישובי עלות העובד.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">כיצד להשתמש בכלי התקציב?</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1 mb-4">
          <li>הוסיפו שורות הכנסה תחת &quot;הכנסות&quot; — ניתן לפלח לפי מוצר, לקוח או ערוץ.</li>
          <li>הזינו הוצאות קבועות (שכר דירה, ביטוחים) והוצאות משתנות (חומרי גלם, שיווק).</li>
          <li>הוסיפו עובדים עם שכר ברוטו — המחשבון יחשב את עלות המעסיק כולל ביטוח לאומי.</li>
          <li>הזינו הלוואות ואשראי לצורך חישוב הון חוזר.</li>
          <li>עברו ללשונית &quot;גרפים פיננסיים&quot; לצפייה בתרשימי מגמה ופילוח הוצאות.</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          נתוני מפתח לתכנון תקציב 2026
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
          <li>
            <strong>שכר מינימום:</strong> 6,443.85 ₪ לחודש (182 שעות) החל מ-1.4.2026.
          </li>
          <li>
            <strong>עלות מעסיק — ביטוח לאומי:</strong> 4.51% על שכר עד 7,522 ₪, 7.6% על החלק שמעל.
          </li>
          <li>
            <strong>מע״מ:</strong> 18% החל מ-1.1.2025 (עלה מ-17%).
          </li>
          <li>
            <strong>דמי הבראה:</strong> 418 ₪ ליום (מגזר פרטי), 471.40 ₪ (מגזר ציבורי).
          </li>
          <li>
            <strong>פיצויי פיטורין:</strong> תקרת פטור 13,750 ₪ לשנת עבודה.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">שאלות נפוצות</h2>
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">
              האם המחשבון מתחשב במע״מ בחישוב ההכנסות וההוצאות?
            </h3>
            <p className="text-gray-700">
              ניתן לבחור בהגדרות האם לעבוד עם מחירים כולל מע״מ (18%) או ללא מע״מ. המערכת
              מציגה את הנתונים בהתאמה כך שה-P&L יהיה עקבי.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              כיצד מחושבת עלות העובד הכוללת?
            </h3>
            <p className="text-gray-700">
              עלות המעסיק כוללת את השכר ברוטו, דמי ביטוח לאומי (4.51% או 7.6% בהתאם לשכר),
              הפרשות לפנסיה, דמי הבראה וחופשה שנתית. לחישוב מפורט ראו את{' '}
              <Link href="/personal-tax/salary-net-gross" className="text-green-700 underline">
                מחשבון שכר ברוטו נטו
              </Link>
              .
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              מה ההבדל בין תקציב חודשי לשנתי?
            </h3>
            <p className="text-gray-700">
              ניתן להגדיר בהגדרות האם לתכנן בתצוגה חודשית או שנתית. הכלי מציג גם חיזוי שנתי
              בהתבסס על הנתונים החודשיים שהוזנו.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              האם ניתן לייצא את התקציב לאקסל?
            </h3>
            <p className="text-gray-700">
              כן. לחצו על כפתור הייצוא בחלק העליון של הדף להורדת הנתונים בפורמט CSV/Excel,
              או שמרו את הסצנריו לשימוש עתידי.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              האם ניתן להשוות מספר סצנריות תקציב?
            </h3>
            <p className="text-gray-700">
              כן. שורת הסצנריות בחלק העליון מאפשרת ליצור ולהשוות מספר גרסאות תקציב — לדוגמה,
              תרחיש אופטימי מול שמרני.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">כלים קשורים</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <Link href="/personal-tax/salary-net-gross" className="text-green-700 underline">
              מחשבון שכר ברוטו נטו
            </Link>{' '}
            — חשבו את עלות העובד המדויקת לכל תפקיד.
          </li>
          <li>
            <Link href="/employee-rights/severance" className="text-green-700 underline">
              מחשבון פיצויי פיטורין
            </Link>{' '}
            — תכננו את עתודות הפיצויים בתקציב.
          </li>
          <li>
            <Link href="/employee-rights/recreation-pay" className="text-green-700 underline">
              מחשבון דמי הבראה
            </Link>{' '}
            — 418 ₪ ליום במגזר הפרטי ב-2026.
          </li>
          <li>
            <Link href="/self-employed/vat" className="text-green-700 underline">
              מחשבון מע״מ
            </Link>{' '}
            — חישוב מע״מ 18% על עסקאות.
          </li>
          <li>
            <Link href="/real-estate/mortgage" className="text-green-700 underline">
              מחשבון משכנתה
            </Link>{' '}
            — שלבו החזרי משכנתה בתכנון הון חוזר.
          </li>
        </ul>
      </article>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Layout;
  label: string;
  color: 'blue' | 'purple' | 'indigo' | 'emerald' | 'violet' | 'cyan' | 'rose';
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    violet: 'bg-violet-600',
    cyan: 'bg-cyan-600',
    rose: 'bg-rose-600',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition ${
        active ? `${colorMap[color]} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
