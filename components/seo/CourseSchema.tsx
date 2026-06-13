interface CourseSchemaItem {
  name: string;
  description: string;
  url: string;
  /** מחיר בש"ח כמחרוזת, למשל '297' */
  price: string;
}

interface CourseSchemaProps {
  courses: CourseSchemaItem[];
}

/**
 * CourseSchema – מזריק JSON-LD מסוג Course לכל קורס של FinSchool.
 * קריטי ל-SEO/GEO: מאפשר ל-Google ולמנועי AI להבין שמדובר בקורסים בתשלום
 * עם ספק (Organization) ומחיר. מוזרק כ-script אחד עם מערך של ישויות Course.
 *
 * השתמש בתוך app/course/page.tsx לצד BreadcrumbSchema.
 */
export function CourseSchema({ courses }: CourseSchemaProps) {
  const provider = {
    '@type': 'Organization',
    name: 'FinSchool',
    url: 'https://school.profitmargin.co.il',
  };

  const schema = courses.map((course) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    url: course.url,
    inLanguage: 'he',
    provider,
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'ILS',
      category: 'Paid',
      url: course.url,
    },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
