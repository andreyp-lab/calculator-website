interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
  /** תאריך עדכון אחרון (ISO, YYYY-MM-DD). סיגנל טריות מרכזי לציטוט במנועי AI. */
  lastUpdated?: string;
}

/**
 * CalculatorSchema – מזריק JSON-LD SoftwareApplication לדפי מחשבונים.
 * השתמש בתוך דפי המחשבון לצד FAQSchema ו-BreadcrumbSchema.
 */
export function CalculatorSchema({
  name,
  description,
  url,
  lastUpdated,
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
    // SoftwareApplication יורש מ-CreativeWork, ולכן dateModified תקף כאן.
    // נפלט רק כשיש תאריך אמיתי – לא ממציאים סיגנל טריות.
    ...(lastUpdated ? { dateModified: lastUpdated } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
