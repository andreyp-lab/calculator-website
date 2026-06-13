import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ToolsProvider } from '@/lib/tools/ToolsContext';
import { LayoutDashboard, TrendingUp, Wallet, BarChart3, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'כלים פיננסיים מקצועיים לבעלי עסקים',
  description: 'מערכת מאוחדת לתכנון תקציב, ניהול תזרים מזומנים וניתוח דוחות כספיים',
};

const tools = [
  {
    href: '/tools/unified',
    label: 'מערכת מאוחדת',
    icon: LayoutDashboard,
    description: 'תקציב + תזרים + ניתוח',
    color: 'bg-cream-2 text-ink border-ink/15',
  },
  {
    href: '/tools/budget',
    label: 'תכנון תקציב',
    icon: TrendingUp,
    description: 'P&L, הכנסות, הוצאות',
    color: 'bg-cream-2 text-ink-mid border-ink/15',
  },
  {
    href: '/tools/cash-flow',
    label: 'תזרים מזומנים',
    icon: Wallet,
    description: 'יתרות ותחזיות תזרים',
    color: 'bg-cream-2 text-ink border-ink/15',
  },
  {
    href: '/tools/financial-analysis',
    label: 'ניתוח דוחות',
    icon: BarChart3,
    description: 'יחסים, Z-Score, דירוג',
    color: 'bg-cream-2 text-ink border-ink/15',
  },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <ToolsProvider>
      <div className="min-h-screen bg-cream">
        {/* Tools Header */}
        <div className="bg-paper border-b border-ink/15">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-gold" />
              <div className="text-2xl font-bold text-ink">כלים פיננסיים מקצועיים</div>
            </div>
            <nav className="flex gap-3 flex-wrap">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2 px-4 py-2 border-2 transition hover:shadow-md ${tool.color}`}
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
