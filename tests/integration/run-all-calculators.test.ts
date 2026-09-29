/**
 * הרצת רצף של כל המחשבונים עם תרחישים מציאותיים
 * מוודא שהמחשבונים עובדים יחד באופן הגיוני
 */
import { describe, it, expect } from 'vitest';
import { calculateIncomeTax } from '@/lib/calculators/income-tax';
import { calculatePrivateRecreationEstimate } from '@/lib/calculators/recreation-pay-verified';
import { calculateVatBasic } from '@/lib/calculators/vat-basic';
import { calculateMortgage, getMaxLoanAmount } from '@/lib/calculators/mortgage';
import { formatCurrency } from '@/lib/utils/formatters';

describe('🎯 בדיקות אינטגרציה למחשבונים הפעילים', () => {
  it('2️⃣ מחשבון מס הכנסה - עובד ממוצע 15,000 ₪', () => {
    const result = calculateIncomeTax({
      monthlySalary: 15_000,
      creditPoints: 2.25,
      hasPension: true,
      pensionPercentage: 6,
    });

    console.log('\n💰 מס הכנסה:');
    console.log(`   ברוטו: ${formatCurrency(result.monthlyGross)}`);
    console.log(`   מס הכנסה: ${formatCurrency(result.monthlyTaxAfterCredits)}`);
    console.log(`   ב.ל. + בריאות: ${formatCurrency(result.monthlySocialSecurity)}`);
    console.log(`   פנסיה (6%): ${formatCurrency(result.monthlyPension)}`);
    console.log(`   נטו: ${formatCurrency(result.monthlyNet)}`);
    console.log(`   שיעור מס אפקטיבי: ${(result.effectiveTaxRate * 100).toFixed(2)}%`);

    expect(result.monthlyNet).toBeGreaterThan(11_000);
    expect(result.monthlyNet).toBeLessThan(12_500);
  });

  it('3️⃣ מחשבון דמי הבראה - עובד 7 שנים, משרה מלאה', () => {
    const result = calculatePrivateRecreationEstimate(7, 100);

    console.log('\n🏖️ דמי הבראה:');
    console.log(`   ימי הבראה: ${result.daysEntitled}`);
    console.log(`   תעריף: ${formatCurrency(result.dayRate)}/יום`);
    console.log(`   אומדן ברוטו: ${formatCurrency(result.grossEstimate)}`);

    expect(result.daysEntitled).toBe(7);
    expect(result.grossEstimate).toBe(3160.5); // 7 × 451.50
  });

  it('4️⃣ מחשבון מע"מ - חשבונית של 5,000 ₪', () => {
    const addVat = calculateVatBasic(5_000, 'add');
    const extractVat = calculateVatBasic(5_900, 'extract');

    console.log('\n🧾 מע"מ:');
    console.log('   הוספה:');
    console.log(`     5,000 ללא מע"מ → ${formatCurrency(addVat.gross)} כולל מע"מ`);
    console.log(`     מע"מ: ${formatCurrency(addVat.vat)}`);
    console.log('   חילוץ:');
    console.log(`     5,900 כולל מע"מ → ${formatCurrency(extractVat.net)} ללא`);
    console.log(`     מע"מ: ${formatCurrency(extractVat.vat)}`);

    expect(addVat.gross).toBeCloseTo(5_900, 0);
    expect(extractVat.net).toBeCloseTo(5_000, 0);
  });

  it('5️⃣ מחשבון משכנתא - דירה 2.5M, ראשונה, 25 שנים', () => {
    const propertyValue = 2_500_000;
    const maxLoan = getMaxLoanAmount(propertyValue, 'first-home');
    const equity = propertyValue - maxLoan;

    const result = calculateMortgage({
      loanAmount: maxLoan,
      interestRate: 4.5,
      termYears: 25,
      method: 'shpitzer',
    });

    console.log('\n🏠 משכנתא:');
    console.log(`   שווי דירה: ${formatCurrency(propertyValue)}`);
    console.log(`   הון עצמי: ${formatCurrency(equity)} (25%)`);
    console.log(`   הלוואה: ${formatCurrency(maxLoan)} (75%)`);
    console.log(`   תקופה: 25 שנים, ריבית 4.5%, שפיצר`);
    console.log(`   תשלום חודשי: ${formatCurrency(result.monthlyPayment)}`);
    console.log(`   סך תשלומים: ${formatCurrency(result.totalPayments)}`);
    console.log(`   סך ריבית: ${formatCurrency(result.totalInterest)}`);

    expect(maxLoan).toBe(1_875_000); // 2,500,000 × 75%
    expect(result.monthlyPayment).toBeGreaterThan(10_000);
    expect(result.monthlyPayment).toBeLessThan(11_000);
  });

});
