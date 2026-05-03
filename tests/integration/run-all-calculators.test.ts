/**
 * הרצת רצף של כל המחשבונים עם תרחישים מציאותיים
 * מוודא שהמחשבונים עובדים יחד באופן הגיוני
 */
import { describe, it, expect } from 'vitest';
import { calculateSeverance } from '@/lib/calculators/severance';
import { calculateIncomeTax } from '@/lib/calculators/income-tax';
import { calculateRecreationPay } from '@/lib/calculators/recreation-pay';
import { calculateVat } from '@/lib/calculators/vat';
import { calculateMortgage, getMaxLoanAmount } from '@/lib/calculators/mortgage';
import { formatCurrency } from '@/lib/utils/formatters';

describe('🎯 רצף בדיקה: כל המחשבונים יחד', () => {
  it('1️⃣ מחשבון פיצויי פיטורין - עובדת הייטק 7 שנים', () => {
    const result = calculateSeverance({
      startDate: '2018-01-15',
      endDate: '2025-01-15',
      monthlySalary: 28_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    console.log('\n📋 פיצויי פיטורין:');
    console.log(`   ותק: ${result.yearsOfService.toFixed(1)} שנים`);
    console.log(`   שכר: ${formatCurrency(result.adjustedSalary)}`);
    console.log(`   פיצוי בסיסי: ${formatCurrency(result.baseSeverance)}`);
    console.log(`   פטור ממס: ${formatCurrency(result.taxExemptAmount)}`);
    console.log(`   חייב במס: ${formatCurrency(result.taxableAmount)}`);
    console.log(`   נטו משוער: ${formatCurrency(result.netSeverance)}`);

    expect(result.isEligible).toBe(true);
    expect(result.baseSeverance).toBeCloseTo(196_000, -2); // 28,000 × 7
    expect(result.taxableAmount).toBeGreaterThan(0); // חורג מהתקרה
  });

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
    const result = calculateRecreationPay({
      yearsOfService: 7,
      partTimePercentage: 100,
      sector: 'private',
    });

    console.log('\n🏖️ דמי הבראה:');
    console.log(`   ימי הבראה: ${result.daysEntitled}`);
    console.log(`   תעריף: ${formatCurrency(result.payPerDay)}/יום`);
    console.log(`   סך לתשלום: ${formatCurrency(result.finalAmount)}`);

    expect(result.daysEntitled).toBe(7);
    expect(result.finalAmount).toBe(2926); // 7 × 418
  });

  it('4️⃣ מחשבון מע"מ - חשבונית של 5,000 ₪', () => {
    const addVat = calculateVat({ amount: 5_000, mode: 'add', rate: 0.18 });
    const extractVat = calculateVat({ amount: 5_900, mode: 'extract', rate: 0.18 });

    console.log('\n🧾 מע"מ:');
    console.log('   הוספה:');
    console.log(`     5,000 ללא מע"מ → ${formatCurrency(addVat.amountWithVat)} כולל מע"מ`);
    console.log(`     מע"מ: ${formatCurrency(addVat.vatAmount)}`);
    console.log('   חילוץ:');
    console.log(`     5,900 כולל מע"מ → ${formatCurrency(extractVat.amountWithoutVat)} ללא`);
    console.log(`     מע"מ: ${formatCurrency(extractVat.vatAmount)}`);

    expect(addVat.amountWithVat).toBeCloseTo(5_900, 0);
    expect(extractVat.amountWithoutVat).toBeCloseTo(5_000, 0);
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

  it('🎯 תרחיש משולב: עובד שמתפטר וקונה דירה', () => {
    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log('🎯 תרחיש משולב מציאותי');
    console.log('═══════════════════════════════════════');

    // שלב 1: עובדת שעבדה 8 שנים בהייטק, פוטרה
    const severance = calculateSeverance({
      startDate: '2017-06-01',
      endDate: '2025-06-01',
      monthlySalary: 25_000,
      employmentType: 'monthly',
      partTimePercentage: 100,
      hasSection14: false,
      section14Percentage: 0,
      terminationReason: 'fired',
    });

    console.log(`\n💼 פוטרה לאחר 8 שנים, שכר 25,000 ₪/חודש:`);
    console.log(`   פיצוי ברוטו: ${formatCurrency(severance.baseSeverance)}`);
    console.log(`   נטו: ${formatCurrency(severance.netSeverance)}`);

    // שלב 2: דמי הבראה אחרונים
    const recreation = calculateRecreationPay({
      yearsOfService: 8,
      partTimePercentage: 100,
      sector: 'private',
    });
    console.log(`   + דמי הבראה: ${formatCurrency(recreation.finalAmount)}`);

    // שלב 3: יוצאת לעצמאית, שולחת חשבונית
    const invoice = calculateVat({ amount: 30_000, mode: 'add', rate: 0.18 });
    console.log(`\n🆕 פתחה עוסק מורשה, חשבונית ראשונה:`);
    console.log(`   ללא מע"מ: ${formatCurrency(invoice.amountWithoutVat)}`);
    console.log(`   עם מע"מ: ${formatCurrency(invoice.amountWithVat)}`);

    // שלב 4: השתמשה בפיצויים כהון עצמי לדירה
    const propertyValue = 2_400_000;
    const equity = severance.netSeverance + recreation.finalAmount;
    const loanNeeded = propertyValue - equity;
    const maxLoan = getMaxLoanAmount(propertyValue, 'first-home');

    console.log(`\n🏠 קונה דירה ב-${formatCurrency(propertyValue)}:`);
    console.log(`   הון עצמי (פיצויים+הבראה): ${formatCurrency(equity)}`);
    console.log(`   הלוואה נדרשת: ${formatCurrency(loanNeeded)}`);
    console.log(`   הלוואה מקסימלית (75%): ${formatCurrency(maxLoan)}`);

    if (loanNeeded <= maxLoan) {
      const mortgage = calculateMortgage({
        loanAmount: loanNeeded,
        interestRate: 4.5,
        termYears: 25,
        method: 'shpitzer',
      });
      console.log(`   ✅ ניתן לקבל הלוואה!`);
      console.log(`   תשלום חודשי: ${formatCurrency(mortgage.monthlyPayment)}`);
      console.log(`   סך ריבית: ${formatCurrency(mortgage.totalInterest)}`);
    } else {
      console.log(`   ❌ ההלוואה הנדרשת חורגת מהמקסימום`);
    }

    console.log('\n═══════════════════════════════════════\n');

    expect(severance.isEligible).toBe(true);
    expect(recreation.isEligible).toBe(true);
    expect(invoice.amountWithVat).toBeGreaterThan(invoice.amountWithoutVat);
  });
});
