import { PURCHASE_TAX_2026 } from '@/lib/constants/tax-2026';

export type PurchaseCategory = 'only-home' | 'additional-home' | 'new-immigrant-only-home';

/** 2026 purchase tax for a qualifying Israeli resident, or a qualifying immigrant's only home.
 * Personal status, transaction date and eligibility must be checked with the Tax Authority. */
export function estimatePurchaseTax2026(value: number, category: PurchaseCategory): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (category === 'new-immigrant-only-home' && value > 20_183_565) return null;
  const brackets = category === 'additional-home'
    ? PURCHASE_TAX_2026.additionalHome
    : category === 'only-home'
      ? PURCHASE_TAX_2026.firstHome
      : [
          { upTo: 1_978_745, rate: 0 },
          { upTo: 6_055_070, rate: 0.005 },
          { upTo: 20_183_565, rate: 0.08 },
        ];
  let tax = 0;
  let previous = 0;
  for (const bracket of brackets) {
    const amount = Math.max(0, Math.min(value, bracket.upTo) - previous);
    tax += amount * bracket.rate;
    if (value <= bracket.upTo) break;
    previous = bracket.upTo;
  }
  return Math.round(tax);
}
