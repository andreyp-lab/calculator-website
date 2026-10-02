import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function sourceFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(?:ts|tsx|mdx)$/.test(name) ? [path] : [];
  });
}

describe('גבולות פרסום למנועים שטרם אומתו', () => {
  it('לא מחבר מחדש מנועי הלוואות מתקדמים למסכים ציבוריים', () => {
    const publicSources = [resolve('app'), resolve('components')]
      .flatMap(sourceFiles)
      .map((path) => `${path}\n${readFileSync(path, 'utf8')}`)
      .join('\n');

    for (const dormantApi of [
      'calculateTrueAPR',
      'compareLoans',
      'calculateDebtConsolidation',
      'calculateEarlyPayoffLoan',
    ]) {
      expect(publicSources).not.toContain(dormantApi);
    }
  });

  it('מציג במחשבון המשכנתא שהקלט הוא ריבית נומינלית', () => {
    const source = readFileSync(resolve('components/calculators/MortgageCalculator.tsx'), 'utf8');
    expect(source).toContain('ריבית שנתית נומינלית');
  });

  it('אינו מייחס מספר נקודות זיכוי למצב משפחתי', () => {
    const source = readFileSync(resolve('app/salary/[amount]/page.tsx'), 'utf8');
    expect(source).not.toMatch(/רווק|רווקה/);
  });
});
