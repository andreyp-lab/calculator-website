import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ToolsProvider } from '@/lib/tools/ToolsContext';
import { LayoutDashboard, TrendingUp, Wallet, BarChart3, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'כלים פיננסיים מקצועיים | FinCalc Pro',
  description: 'מערכת מאוחדת לתכנון תקציב, ניהול תזרים מזומנים וניתוח דוחות כספיים',
};

const tools = [
  {
    href: '/tools/unified',
    label: 'מערכת מאוחדת',
    icon: LayoutDashboard,
    description: 'תקציב + תזרים + ניתוח',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    href: '/tools/budget',
    label: 'תכנון תקציב',
    icon: TrendingUp,
    description: 'P&L, הכנסות, הוצאות',
    color: 'bg-green-100 text-green-700 border-green-300',
  },
  {
    href: '/tools/cash-flow',
    label: 'תזרים מזומנים',
    icon: Wallet,
    description: 'יתרות ותחזיות תזרים',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    href: '/tools/financial-analysis',
    label: 'ניתוח דוחות',
    icon: BarChart3,
    description: 'יחסים, Z-Score, דירוג',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <ToolsProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Tools Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">כלים פיננסיים מקצועיים</h1>
            </div>
            <nav className="flex gap-3 flex-wrap">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition hover:shadow-md ${tool.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-sm">{tool.label}</div>
                      <div className="text-xs opacity-75">{tool.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tool Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </div>
    </ToolsProvider>
  );
}
