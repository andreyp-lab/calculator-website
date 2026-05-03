/**
 * פונקציות פורמט למערכת הכלים
 */

import { Currency, CURRENCY_SYMBOLS } from './types';

export function formatCurrency(
  value: number,
  currency: Currency = 'ILS',
  decimals: number = 0,
): string {
  if (!isFinite(value) || isNaN(value)) value = 0;
  const symbol = CURRENCY_SYMBOLS[currency];

  const formatted = Math.abs(value).toLocaleString('he-IL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const sign = value < 0 ? '-' : '';
  return `${sign}${formatted} ${symbol}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (!isFinite(value) || isNaN(value)) value = 0;
  return `${value.toFixed(decimals)}%`;
}

export function formatRatio(value: number, decimals: number = 2): string {
  if (!isFinite(value) || isNaN(value)) value = 0;
  return value.toFixed(decimals);
}

export function formatCompact(value: number, currency: Currency = 'ILS'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M ${symbol}`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K ${symbol}`;
  return `${sign}${abs.toFixed(0)} ${symbol}`;
}

export function formatDays(days: number): string {
  if (!isFinite(days) || isNaN(days)) return '0 ימים';
  return `${Math.round(days)} ימים`;
}
