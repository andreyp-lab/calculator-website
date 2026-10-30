import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Metadata } from 'next';
import { withPageSocialMetadata } from '@/lib/config/site-info';

describe('page social metadata', () => {
  const page: Metadata = {
    title: 'כותרת העמוד',
    description: 'תיאור העמוד',
    alternates: { canonical: '/example' },
  };

  it('uses the page title, description and canonical in social metadata', () => {
    const result = withPageSocialMetadata(page);
    expect(result.openGraph).toMatchObject({
      title: page.title,
      description: page.description,
      url: '/example',
      locale: 'he_IL',
      siteName: 'חשבונאי',
      images: ['/opengraph-image'],
    });
    expect(result.twitter).toMatchObject({
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/opengraph-image'],
    });
  });

  it.each([
    [{ absolute: 'כותרת מוחלטת' }, 'כותרת מוחלטת'],
    [{ default: 'כותרת ברירת מחדל', template: '%s | מותג' }, 'כותרת ברירת מחדל'],
  ] as const)('resolves object titles without serializing the template', (title, expected) => {
    const result = withPageSocialMetadata({ ...page, title });
    expect(result.openGraph?.title).toBe(expected);
    expect(result.twitter?.title).toBe(expected);
  });

  it.each([
    'https://cheshbonai.co.il/example',
    new URL('https://cheshbonai.co.il/example'),
    { url: '/example' },
  ])('accepts canonical URL forms supported by Next', (canonical) => {
    const result = withPageSocialMetadata({ ...page, alternates: { canonical } });
    const expected = typeof canonical === 'object' && !(canonical instanceof URL)
      ? canonical.url : canonical;
    expect(result.openGraph?.url).toBe(expected);
  });

  it('preserves explicit social blocks, including custom images and card types', () => {
    const openGraph: Metadata['openGraph'] = {
      type: 'article', title: 'Custom OG', images: ['/custom.png'],
    };
    const twitter: Metadata['twitter'] = {
      card: 'summary', title: 'Custom Twitter', images: ['/custom-twitter.png'],
    };
    const result = withPageSocialMetadata({ ...page, openGraph, twitter });
    expect(result.openGraph).toMatchObject(openGraph);
    expect(result.twitter).toMatchObject(twitter);
    expect(result.openGraph?.url).toBe('/example');
  });

  it('fills missing fields and respects explicit null values', () => {
    const twitter: Metadata['twitter'] = { card: 'summary', creator: '@example' };
    expect(withPageSocialMetadata({ ...page, twitter }).twitter).toMatchObject({
      ...twitter, title: page.title, description: page.description,
    });
    expect(withPageSocialMetadata({ ...page, twitter }).openGraph?.url).toBe('/example');
    const result = withPageSocialMetadata({ ...page, openGraph: null, twitter: null });
    expect(result.openGraph).toBeNull();
    expect(result.twitter).toBeNull();
  });

  it('preserves canonical, indexing and other metadata without mutating the input', () => {
    const input = Object.freeze({ ...page, robots: { index: false }, keywords: ['example'] });
    const result = withPageSocialMetadata(input);
    expect(input).not.toHaveProperty('openGraph');
    expect(result.alternates).toBe(input.alternates);
    expect(result.robots).toBe(input.robots);
    expect(result.keywords).toBe(input.keywords);
    expect(result.title).toBe(input.title);
    expect(result.description).toBe(input.description);
  });

  it('does not guess page identity for shared layouts or missing titles', () => {
    const layout: Metadata = { title: 'Shared layout' };
    const untitled: Metadata = { alternates: { canonical: '/example' } };
    expect(withPageSocialMetadata(layout)).toBe(layout);
    expect(withPageSocialMetadata(untitled)).toBe(untitled);
  });

  it('preserves a null page description without emitting a null OG description', () => {
    const result = withPageSocialMetadata({ ...page, description: null });
    expect(result.description).toBeNull();
    expect(result.openGraph?.description).toBeUndefined();
    expect(result.twitter?.description).toBeUndefined();
  });
});

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
