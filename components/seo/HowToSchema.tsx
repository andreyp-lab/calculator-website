interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  /** Optional: estimated total time in ISO 8601 duration, e.g. "PT45M" */
  totalTime?: string;
}

/**
 * HowToSchema – מזריק JSON-LD HowTo Schema לדפי מדריכים.
 * משמש בעיקר לשלוש עמודי ה-Pillar guides.
 */
export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    inLanguage: 'he',
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    })),
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
