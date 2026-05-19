interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

/**
 * FAQSchema – מזריק JSON-LD FAQPage Schema.
 * השתמש בדפים שיש בהם שאלות ותשובות אך ה-FAQ component לא מזריק
 * את ה-schema בעצמו (למשל: דפי מדריכים עם FAQ ב-<details>).
 *
 * הערה: ב-FAQ component הקיים (components/calculator/FAQ.tsx)
 * כבר יש הזרקה מובנית — אין צורך לכפול שם.
 */
export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
