interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
  /** Optional: defaults to 4.8 */
  ratingValue?: string;
  /** Optional: defaults to 120 */
  ratingCount?: string;
}

/**
 * CalculatorSchema – מזריק JSON-LD SoftwareApplication לדפי מחשבונים.
 * השתמש בתוך דפי המחשבון לצד FAQSchema ו-BreadcrumbSchema.
 */
export function CalculatorSchema({
  name,
  description,
  url,
  ratingValue = '4.8',
  ratingCount = '120',
}: CalculatorSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: url.startsWith('http') ? url : `https://cheshbonai.co.il${url}`,
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
