'use client';

import { useMemo, useState } from 'react';
import {
  calculateBirthGrant,
  calculateChildAllowance,
  calculateMaternityAllowance,
} from '@/lib/calculators/btl-family';
import { MATERNITY_ALLOWANCE_2026 } from '@/lib/constants/tax-2026';

const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';
const money = (v: number) => `${v.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;
const TRACK_LABEL = { full: 'זכאות מלאה (15 שבועות)', partial: 'זכאות חלקית (8 שבועות)', none: 'אין זכאות לפי האכשרה שהוזנה' } as const;

type Section = 'children' | 'birth' | 'maternity';

/** מחשבון קצבאות משפחה. `sections` קובע אילו חלקים להציג, כדי להטמיע רק חלק בעמודים אחרים. */
export function FamilyBenefitsCalculator({ sections = ['children', 'birth', 'maternity'] }: { sections?: Section[] }) {
  const show = (s: Section) => sections.includes(s);

  // קצבת ילדים
  const [kids, setKids] = useState('3');
  const allowance = useMemo(() => calculateChildAllowance(Number(kids)), [kids]);

  // מענק לידה
  const [familySize, setFamilySize] = useState('2');
  const [newborns, setNewborns] = useState('1');
  const grant = useMemo(
    () => calculateBirthGrant({ childrenInFamilyAfterBirth: Number(familySize), newborns: Number(newborns) }),
    [familySize, newborns],
  );

  // דמי לידה
  const [w3, setW3] = useState('27000');
  const [w6, setW6] = useState('54000');
  const [m14, setM14] = useState('12');
  const [m22, setM22] = useState('18');
  const maternity = useMemo(
    () =>
      calculateMaternityAllowance({
        wages3Months: Number(w3),
        wages6Months: Number(w6),
        contributedOf14: Number(m14),
        contributedOf22: Number(m22),
      }),
    [w3, w6, m14, m22],
  );

  return (
    <div className="my-8 space-y-8 border border-ink/15 bg-paper p-6" dir="rtl">
      {show('children') && (
        <section aria-labelledby="fb-children">
          <h2 id="fb-children" className="mb-4 text-xl font-bold">קצבת ילדים חודשית</h2>
          <label className="block max-w-xs">
            מספר ילדים זכאים (עד גיל 18, לא נשואים)
            <input className={field} type="number" min="0" max="30" inputMode="numeric" value={kids} onChange={(e) => setKids(e.target.value)} />
          </label>
          <div className="mt-3" aria-live="polite">
            {allowance ? (
              <>
                <p className="text-2xl font-bold">{money(allowance.monthly)} בחודש</p>
                <p className="mt-1 text-sm">{money(allowance.annual)} בשנה</p>
                {allowance.rows.length > 0 && (
                  <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                    {allowance.rows.map((r) => (
                      <li key={r.position}>
                        ילד {r.position}: {money(r.amount)}
                      </li>
                    ))}
                  </ul>
                )}
                {allowance.monthlyWithSupplement > allowance.monthly && (
                  <p className="mt-3 text-sm text-ink/70">
                    להורה המקבל הבטחת הכנסה, מזונות או קצבת זקנה/שאירים עם השלמת הכנסה יש תוספת לילד שלישי ורביעי:
                    סך הכול {money(allowance.monthlyWithSupplement)} בחודש.
                  </p>
                )}
              </>
            ) : (
              <p className="font-bold">הזינו מספר שלם בין 0 ל־30.</p>
            )}
          </div>
        </section>
      )}

      {show('birth') && (
        <section aria-labelledby="fb-birth">
          <h2 id="fb-birth" className="mb-4 text-xl font-bold">מענק לידה</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              כמה ילדים יהיו במשפחה אחרי הלידה (כולל הנולדים)
              <input className={field} type="number" min="1" inputMode="numeric" value={familySize} onChange={(e) => setFamilySize(e.target.value)} />
            </label>
            <label className="block">
              מספר הנולדים בלידה (1 יחיד, 2 תאומים…)
              <input className={field} type="number" min="1" max="8" inputMode="numeric" value={newborns} onChange={(e) => setNewborns(e.target.value)} />
            </label>
          </div>
          <div className="mt-3" aria-live="polite">
            {grant !== null ? (
              <p className="text-2xl font-bold">{money(grant)}</p>
            ) : (
              <p className="font-bold">מספר הילדים במשפחה חייב להיות לפחות כמספר הנולדים.</p>
            )}
          </div>
        </section>
      )}

      {show('maternity') && (
        <section aria-labelledby="fb-maternity">
          <h2 id="fb-maternity" className="mb-4 text-xl font-bold">אומדן דמי לידה</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              סך השכר ב־3 החודשים המלאים האחרונים (₪)
              <input className={field} type="number" min="0" inputMode="decimal" value={w3} onChange={(e) => setW3(e.target.value)} />
            </label>
            <label className="block">
              סך השכר ב־6 החודשים המלאים האחרונים (₪)
              <input className={field} type="number" min="0" inputMode="decimal" value={w6} onChange={(e) => setW6(e.target.value)} />
            </label>
            <label className="block">
              חודשים ששולמו בהם דמי ביטוח מתוך 14 האחרונים
              <input className={field} type="number" min="0" max="14" inputMode="numeric" value={m14} onChange={(e) => setM14(e.target.value)} />
            </label>
            <label className="block">
              חודשים ששולמו בהם דמי ביטוח מתוך 22 האחרונים
              <input className={field} type="number" min="0" max="22" inputMode="numeric" value={m22} onChange={(e) => setM22(e.target.value)} />
            </label>
          </div>
          <div className="mt-3" aria-live="polite">
            {maternity ? (
              <>
                <p className="text-lg font-bold">{TRACK_LABEL[maternity.track]}</p>
                {maternity.days > 0 && (
                  <>
                    <p className="mt-2 text-2xl font-bold">{money(maternity.total)}</p>
                    <p className="mt-1 text-sm">
                      {money(maternity.daily)} ליום × {maternity.days} ימים
                      {maternity.capped &&
                        ` (התקרה היומית היא ${money(MATERNITY_ALLOWANCE_2026.maxDaily)}; ממוצע השכר ליום ${money(maternity.dailyBeforeCap)})`}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="font-bold">בדקו שמספר חודשי ה־14 אינו עולה על 14 ואינו גדול ממספר חודשי ה־22.</p>
            )}
          </div>
          <p className="mt-3 text-sm text-ink/70">
            החישוב משתמש בממוצע היומי הגבוה מבין שלושת וששת החודשים ובתקרה היומית. אינו כולל לידה מרובה, אשפוז, עצמאיות
            או שכר מעל התקרה בחודשים מסוימים. לסכום מדויק השתמשו במחשבון הביטוח הלאומי.
          </p>
        </section>
      )}

      <p className="text-sm leading-relaxed text-ink/70">
        הסכומים בתוקף מ־1.1.2026 לפי אתר הביטוח הלאומי (נקראו ב־20.11.2026). בדקו עדכונים לפני פעולה.
      </p>
    </div>
  );
}
