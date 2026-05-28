'use client';

import { usePathname } from 'next/navigation';

const SITE_URL = 'https://cheshbonai.co.il';

interface CalculatorSchemaClientProps {
  name: string;
  description: string;
  /** אם סופק – ישמש כ-URL; אחרת נגזר מ-pathname הנוכחי */
  urlOverride?: string;
  ratingValue?: string;
  ratingCount?: string;
}

/**
 * CalculatorSchemaClient – מזריק JSON-LD SoftwareApplication עם ה-URL הנכון.
 * משתמש ב-usePathname() כדי לקרוא את הנתיב האמיתי של הדף הנוכחי,
 * ובכך פותר את הבעיה שבה ה-URL היה מצביע על קטגוריית האב במקום על הדף עצמו.
 */
export function CalculatorSchemaClient({
  name,
  description,
  urlOverride,
  ratingValue = '4.8',
  ratingCount = '120',
}: CalculatorSchemaClientProps) {
  const pathname = usePathname();
  const resolvedPath = urlOverride ?? pathname ?? '/';
  const fullUrl = resolvedPath.startsWith('http')
    ? resolvedPath
    : `${SITE_URL}${resolvedPath}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: fullUrl,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    inLanguage: 'he',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ILS',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      ratingCount,
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
