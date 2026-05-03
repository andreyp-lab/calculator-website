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
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  };

  const valueColor = {
    primary: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-amber-700',
  };

  return (
    <div className={`rounded-lg border-2 ${variantClasses[variant]} p-6`}>
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <p className={`text-4xl font-bold ${valueColor[variant]} mb-1`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      {children && <div className="mt-4 pt-4 border-t border-gray-300">{children}</div>}
    </div>
  );
}
