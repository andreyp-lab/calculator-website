'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics/events';

interface Props {
  /** מועד ההגשה האחרון לשנת המס הוותיקה ביותר הנתמכת (YYYY-MM-DD), נגזר ממנוע החישוב. */
  oldestYearDeadline: string;
  oldestYear: string;
}

const QUESTIONS = [
  { id: 'jobs', text: 'החלפתם עבודה או עבדתם אצל יותר ממעסיק אחד באותה שנה?' },
  { id: 'partial', text: 'עבדתם רק חלק מהשנה (למשל סיום לימודים, שחרור מהצבא, תקופה ללא עבודה)?' },
  { id: 'children', text: 'נולד לכם ילד, או שיש לכם ילדים מתחת לגיל 18?' },
  { id: 'status', text: 'השתחררתם מצה״ל או משירות לאומי, סיימתם תואר, או עליתם לישראל בשש השנים האחרונות?' },
  { id: 'single', text: 'אתם הורה יחיד, או שהמצב המשפחתי שלכם השתנה במהלך השנה?' },
  { id: 'deposits', text: 'הפקדתם לפנסיה, לקרן השתלמות או לביטוח חיים באופן פרטי, או תרמתם לעמותה מוכרת?' },
] as const;

type Answers = Record<string, boolean>;

/**
 * שאלון קצר בלי הזנת סכומים: מסמן אם כדאי לבדוק זכאות להחזר. הוא אינו מחשב
 * ואינו מבטיח החזר, ולכן אינו שומר ואינו שולח את התשובות — רק קטגוריית תוצאה.
 */
export function TaxRefundQuickCheck({ oldestYearDeadline, oldestYear }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const signals = QUESTIONS.filter((q) => answers[q.id]).length;
  const level = signals >= 3 ? 'high' : signals >= 1 ? 'medium' : 'low';
  const deadlineLabel = new Intl.DateTimeFormat('he-IL').format(new Date(`${oldestYearDeadline}T12:00:00`));

  function finish() {
    setDone(true);
    trackEvent('tax_refund_quickcheck_complete', { level });
  }

  return (
    <section aria-labelledby="refund-quickcheck-title" className="border-2 border-gold/50 bg-cream-2 p-5 md:p-6">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-gold">בדיקה מהירה · בלי להזין סכומים</p>
      <h2 id="refund-quickcheck-title" className="mt-1 text-xl font-bold text-ink">
        האם כדאי לבדוק החזר מס?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        סמנו את מה שמתאים לשנות המס האחרונות. התשובות לא נשמרות ולא נשלחות, והן רק מכוונות אתכם —
        הן אינן מחשבות החזר ואינן מבטיחות אותו.
      </p>

      <fieldset className="mt-4 space-y-2">
        <legend className="sr-only">שאלות לבדיקת כדאיות</legend>
        {QUESTIONS.map((q) => (
          <label key={q.id} className="flex items-start gap-3 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-gold"
              checked={Boolean(answers[q.id])}
              onChange={(event) => {
                setAnswers((current) => ({ ...current, [q.id]: event.target.checked }));
                setDone(false);
              }}
            />
            <span>{q.text}</span>
          </label>
        ))}
      </fieldset>

      <button
        type="button"
        onClick={finish}
        className="mt-5 bg-gold px-6 py-3 text-sm font-bold text-paper transition hover:bg-gold-2"
      >
        מה התוצאה?
      </button>

      {done ? (
        <div role="status" className="mt-5 border-r-4 border-gold bg-paper p-4 text-sm leading-relaxed text-ink">
          <p className="font-bold">
            {level === 'high'
              ? 'כדאי לבדוק — יש כמה מצבים שמתאימים לעיתים קרובות להחזר.'
              : level === 'medium'
                ? 'ייתכן שכדאי לבדוק — סימנתם לפחות מצב אחד שיכול להשפיע על המס השנתי.'
                : 'לא סימנתם מצב נפוץ להחזר, אבל הבדיקה לוקחת כמה דקות.'}
          </p>
          <p className="mt-2 text-ink/75">
            ההחזר תלוי בנתוני טופס 106 בפועל, ולכן רק החישוב המלא או רשות המסים קובעים. שימו לב
            למועד: בקשה לשנת {oldestYear} ניתנת להגשה עד {deadlineLabel}.
          </p>
          <a
            href="#refund-calculator"
            onClick={() => trackEvent('tax_refund_quickcheck_cta', { level })}
            className="mt-3 inline-block font-bold text-gold underline"
          >
            לחישוב המלא לפי טופס 106 ↓
          </a>
        </div>
      ) : null}
    </section>
  );
}
