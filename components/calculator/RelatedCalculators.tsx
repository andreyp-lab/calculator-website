import Link from 'next/link';
import { getRelatedCalculators } from '@/lib/config/related-calculators';

interface RelatedCalculatorsProps {
  /** נתיב הדף הנוכחי, למשל /personal-tax/income-tax */
  currentPath?: string;
}

/**
 * RelatedCalculators — בלוק "מחשבונים קשורים" המוצג אוטומטית בתחתית דפי מחשבון.
 * מחזק קישוריות פנימית (internal PageRank) ומגדיל pages-per-session.
 */
export function RelatedCalculators({ currentPath }: RelatedCalculatorsProps) {
  const related = getRelatedCalculators(currentPath);
  if (related.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="related-calculators-heading">
      <h2 id="related-calculators-heading" className="text-2xl font-bold text-gray-900 mb-6">
        מחשבונים קשורים
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {related.map((c) => (
          <Link
            key={c.path}
            href={c.path}
            className="group flex items-center justify-between gap-2 border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition"
          >
            <span className="font-medium text-gray-900 group-hover:text-blue-700 transition">
              {c.label}
            </span>
            <span className="text-blue-600 group-hover:-translate-x-1 transition" aria-hidden>
              ←
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
