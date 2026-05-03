import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';

export const metadata: Metadata = {
  title: 'בלוג - FinCalc',
  description: 'מאמרים, חדשות ועדכונים על מיסוי, זכויות עובדים וכלכלה אישית בישראל',
};

const posts = [
  {
    slug: 'tax-changes-2026',
    title: 'מה השתנה במדרגות מס הכנסה ב-2026? המדריך המלא',
    description: 'סקירה מקיפה של השינויים במדרגות המס לשנת 2026 והשפעתם על השכר נטו',
    date: '2026-05-01',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'דף הבית', href: '/' }, { label: 'בלוג' }]} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">הבלוג שלנו</h1>
        <p className="text-lg text-gray-600 mb-12">
          מאמרים, חדשות ועדכונים על מיסוי, זכויות עובדים וכלכלה אישית
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition group"
            >
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('he-IL')}
              </time>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-blue-600 transition">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-3">{post.description}</p>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                <span>קרא עוד</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
