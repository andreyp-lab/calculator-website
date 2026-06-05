import { type Course, courseUrl, getCourseForPath } from '@/lib/config/courses';

interface CourseBannerProps {
  course: Course;
  /** נתיב הדף הנוכחי — נכנס ל-UTM content למדידת המרות */
  page: string;
  /** גרסה קומפקטית (לתוך זרימת תוכן) מול hero (לראש דף קטגוריה) */
  variant?: 'inline' | 'hero';
}

/**
 * CourseBanner — באנר שיווקי לקורסי FinSchool של אנדרי פלטונוב (רו"ח, מחבר האתר).
 * ממיר תנועה אורגנית ללידים ממוקדים. כל קישור נושא UTM למדידה.
 */
export function CourseBanner({ course, page, variant = 'inline' }: CourseBannerProps) {
  const href = courseUrl(course, page);
  const isHero = variant === 'hero';

  return (
    <aside
      className={`not-prose relative overflow-hidden rounded-2xl bg-gradient-to-bl ${course.gradient} text-white shadow-xl ${
        isHero ? 'p-8 md:p-10' : 'p-6 md:p-7'
      }`}
      aria-label={`קורס: ${course.name}`}
    >
      {/* תג עליון */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="bg-amber-400 text-amber-950 text-xs font-bold rounded-full px-3 py-1">
          🎓 {course.badge}
        </span>
        <span className="bg-white/15 backdrop-blur text-xs rounded-full px-3 py-1">
          מאת אנדרי פלטונוב, רו״ח — מחבר האתר
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <h3 className={`font-bold mb-2 ${isHero ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
            {course.name}
          </h3>
          <p className="text-white/85 leading-relaxed mb-3">{course.tagline}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
            {course.highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-1">
                <span className="text-amber-300" aria-hidden>✓</span>
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* מחיר + CTA */}
        <div className="flex flex-col items-stretch md:items-center gap-2 md:min-w-[180px]">
          <div className="text-center">
            <span className="block text-xs text-white/70">מחיר השקה</span>
            <span className="text-3xl font-extrabold">{course.price}₪</span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="block text-center bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-6 py-3 rounded-xl transition shadow-lg"
          >
            לפרטים והרשמה ←
          </a>
          <span className="text-[11px] text-white/60 text-center">{course.audience}</span>
        </div>
      </div>
    </aside>
  );
}

/**
 * עטיפה נוחה: בוחרת אוטומטית את הקורס לפי נתיב, ומחזירה null אם אין התאמה.
 */
export function ContextualCourseBanner({
  page,
  variant = 'inline',
}: {
  page: string | undefined;
  variant?: 'inline' | 'hero';
}) {
  const course = getCourseForPath(page);
  if (!course || !page) return null;
  return <CourseBanner course={course} page={page} variant={variant} />;
}
