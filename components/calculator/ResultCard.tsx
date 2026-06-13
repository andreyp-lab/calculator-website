import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  children?: ReactNode;
  variant?: 'primary' | 'success' | 'warning';
}

export function ResultCard({
  title,
  value,
  subtitle,
  children,
  variant = 'primary',
}: ResultCardProps) {
  const variantClasses = {
    primary: 'bg-ink border-ink',
    success: 'bg-ink-deep border-ink-deep',
    warning: 'bg-ink-mid border-ink-mid',
  };

  const valueColor = {
    primary: 'text-gold-light',
    success: 'text-gold-light',
    warning: 'text-gold-light',
  };

  return (
    <div className={`border ${variantClasses[variant]} p-6`}>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold-light mb-2">{title}</p>
      <p className={`text-4xl font-serif font-bold ${valueColor[variant]} mb-1`}>{value}</p>
      {subtitle && <p className="text-sm text-cream/70">{subtitle}</p>}
      {children && <div className="mt-4 pt-4 border-t border-cream/15 text-cream">{children}</div>}
    </div>
  );
}
