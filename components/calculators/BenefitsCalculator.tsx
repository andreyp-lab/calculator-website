'use client';

import { useMemo, useState } from 'react';
import { checkWorkGrant } from '@/lib/calculators/work-grant';
import { calculateCompanyCarBenefit, carPayslipImpact, type CarKind, type CarTech } from '@/lib/calculators/company-car-benefit';
import { Box, NumField as In, Note, Result, SelField as Sel, Stat, fmt, shekel } from '@/components/calculators/ui';
import { COMPANY_CAR_BENEFIT_2026, WORK_GRANT_2025 } from '@/lib/constants/benefits-2026';

export type BenefitsSection = 'workgrant' | 'companycar';
const Bad = () => <p className="font-bold">בדקו את הערכים שהוזנו.</p>;

function WorkGrant() {
  const [age, setAge] = useState('35'), [sex, setSex] = useState<'male' | 'female'>('male'), [birth, setBirth] = useState('1990');
  const [kids, setKids] = useState('2'), [toddlers, setToddlers] = useState('0'), [single, setSingle] = useState(false);
  const [income, setIncome] = useState('60000'), [months, setMonths] = useState('12');
  const [prop, setProp] = useState(false), [rel, setRel] = useState(false);
  const r = useMemo(() => checkWorkGrant({ age: Number(age), sex, birthYear: Number(birth), children: Number(kids), toddlers: Number(toddlers), singleParent: single, annualWorkIncome: Number(income), workMonths: Number(months), ownsOtherProperty: prop, allIncomeFromRelative: rel }), [age, sex, birth, kids, toddlers, single, income, months, prop, rel]);
  return (
    <Box title="בדיקת זכאות למענק עבודה — שנת המס 2025">
      <div className="grid gap-4 sm:grid-cols-3">
        <In label="גיל" value={age} set={setAge} min="0" />
        <Sel label="מין" value={sex} set={(v) => setSex(v as 'male' | 'female')} options={[['male', 'גבר'], ['female', 'אישה']]} />
        <In label="שנת לידה" value={birth} set={setBirth} min="1900" />
        <In label="ילדים מתחת לגיל 19" value={kids} set={setKids} min="0" step="1" />
        <In label="מתוכם פעוטות (נולדו ב־2023–2025)" value={toddlers} set={setToddlers} min="0" step="1" />
        <In label="הכנסה מעבודה/עסק בשנה (₪)" value={income} set={setIncome} min="0" />
        <In label="חודשי עבודה בפועל (1–12)" value={months} set={setMonths} min="1" max="12" step="1" />
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} /> הורה יחיד (הילדים אצלי, אין בן/בת זוג)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={prop} onChange={(e) => setProp(e.target.checked)} /> בבעלותי או בעלות בן/בת הזוג או ילד תלוי זכות במקרקעין נוספת (מעל 50%) מעבר לדירת מגורים יחידה</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={rel} onChange={(e) => setRel(e.target.checked)} /> כל ההכנסה מעבודה התקבלה ממעסיק קרוב (בן זוג, הורה, אח, צאצא…)</label>
      </div>
      <Result>
        {r ? (
          <>
            <p className="text-2xl font-bold">{r.likelyEligible ? 'נראה שמתקיימים תנאי הזכאות' : 'לפי הנתונים לא נראית זכאות'}</p>
            <p className="mt-1">הכנסה חודשית ממוצעת: {shekel(r.avgMonthlyIncome, 0)}</p>
            {r.blockers.length > 0 && <ul className="mt-2 list-disc pr-5 text-sm">{r.blockers.map((b) => <li key={b}>{b}</li>)}</ul>}
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Stat label="מענק כללי" value={r.general.band ? `${r.general.eligible ? 'כן' : 'לא'} (טווח ${fmt(r.general.band.above, 0)}–${fmt(r.general.band.below, 0)})` : 'אין מסלול מתאים'} />
              <Stat label="מענק לנשים 60–65" value={r.women60to65.band ? `${r.women60to65.eligible ? 'כן' : 'לא'} (טווח ${fmt(r.women60to65.band.above, 0)}–${fmt(r.women60to65.band.below, 0)})` : 'לא רלוונטי'} />
              <Stat label="תוספת פעוטות" value={r.toddler.band ? (r.toddler.eligible ? `עד ${shekel(r.toddler.maxSupplement, 0)}` : 'לא') : 'לא רלוונטי'} />
            </div>
            {r.enlarged150 && <p className="mt-3 text-sm">הורים לילד אחד ומעלה זכאים למענק מוגדל בשיעור 150%.</p>}
          </>
        ) : <Bad />}
      </Result>
      <Note>
        הבדיקה מוודאת אם ההכנסה החודשית הממוצעת בטווח המזכה ואם מתקיימים תנאי הסף, לפי מדריך רשות המסים לשנת המס {WORK_GRANT_2025.taxYear} (הספים לפי מדד ינואר 2026). <strong>סכום המענק</strong> (עד {fmt(WORK_GRANT_2025.maxGrantWithoutToddlers, 0)} ₪ לשנה, ללא תוספת פעוטות) תלוי בנוסחה, בהכנסות נוספות ובהכנסות בן/בת הזוג, ונקבע רק ב
        <a className="text-gold underline" href={WORK_GRANT_2025.simulatorUrl} target="_blank" rel="noopener noreferrer"> סימולטור הרשמי</a>. אפשר להגיש עד {WORK_GRANT_2025.claimDeadline.split('-').reverse().join('.')}.
      </Note>
    </Box>
  );
}

function CompanyCar() {
  const [kind, setKind] = useState<CarKind>('car-2010'), [price, setPrice] = useState('200000'), [group, setGroup] = useState('3'), [tech, setTech] = useState<CarTech>('regular'), [gross, setGross] = useState('15000');
  const r = useMemo(() => calculateCompanyCarBenefit({ kind, price: Number(price), priceGroup: Number(group), tech }), [kind, price, group, tech]);
  const impact = r ? carPayslipImpact(Number(gross), r.monthlyBenefit) : null;
  return (
    <Box title="חישוב שווי שימוש ברכב צמוד 2026">
      <div className="grid gap-4 sm:grid-cols-3">
        <Sel label="סוג הרכב" value={kind} set={(v) => setKind(v as CarKind)} options={[['car-2010', 'רכב שנרשם מ־1.1.2010'], ['car-pre-2010', 'רכב שנרשם לפני 1.1.2010'], ['motorcycle', 'אופנוע L3']]} />
        {kind === 'car-2010' && <In label="מחיר מחירון מתואם (₪)" value={price} set={setPrice} min="0" />}
        {kind === 'car-2010' && <Sel label="הנעה" value={tech} set={(v) => setTech(v as CarTech)} options={[['regular', 'בנזין/דיזל'], ['hybrid', 'היברידי'], ['plugin', 'פלאג-אין'], ['electric', 'חשמלי']]} />}
        {kind === 'car-pre-2010' && <Sel label="קבוצת מחיר" value={group} set={setGroup} options={[1, 2, 3, 4, 5, 6, 7].map((g) => [String(g), `קבוצה ${g}`] as [string, string])} />}
        <In label="שכר ברוטו חודשי (לחישוב ההשפעה בתלוש) (₪)" value={gross} set={setGross} min="0" />
      </div>
      <Result>
        {r ? (
          <>
            <p className="text-2xl font-bold">שווי שימוש חודשי: {shekel(r.monthlyBenefit, 0)}</p>
            <p className="mt-1 text-sm">שנתי: {shekel(r.annualBenefit, 0)}{r.cappedByCeiling ? ` · המחיר חרג מהתקרה (${fmt(COMPANY_CAR_BENEFIT_2026.priceCeiling, 0)} ₪), והחישוב נעשה על התקרה` : ''}{r.reduction > 0 ? ` · כולל הפחתה של ${shekel(r.reduction, 0)}` : ''}</p>
            {impact && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Stat label="עלות הרכב בתלוש (מס וביטוח לאומי)" value={`${shekel(impact.monthlyNetCost, 0)} בחודש`} />
                <Stat label="חלק מהשווי שיורד מהנטו" value={`${impact.costPctOfBenefit}%`} />
                <Stat label="נטו אחרי השווי" value={shekel(impact.netWithBenefit, 0)} />
              </div>
            )}
          </>
        ) : <Bad />}
      </Result>
      <Note>
        לפי לוח העזר של רשות המסים 2026: רכב מ־2010 — {COMPANY_CAR_BENEFIT_2026.monthlyRateOfPrice * 100}% ממחיר הרכב (עד תקרה של {fmt(COMPANY_CAR_BENEFIT_2026.priceCeiling, 0)} ₪) פחות הפחתה לרכב היברידי ({fmt(COMPANY_CAR_BENEFIT_2026.reductions.hybrid, 0)}), פלאג-אין ({fmt(COMPANY_CAR_BENEFIT_2026.reductions.plugin, 0)}) וחשמלי ({fmt(COMPANY_CAR_BENEFIT_2026.reductions.electric, 0)}), הוראת שעה עד סוף 2028. האחוז עצמו לא מופיע בלוח העזר ולכן מסומן לאימות. מחיר המחירון המדויק לפי דגם נמצא ב
        <a className="text-gold underline" href={COMPANY_CAR_BENEFIT_2026.simulatorUrl} target="_blank" rel="noopener noreferrer"> סימולטור רשות המסים</a>. ההשפעה בתלוש בהנחה של 2.25 נקודות זיכוי וללא פנסיה.
      </Note>
    </Box>
  );
}

export function BenefitsCalculator({ section }: { section: BenefitsSection }) {
  return section === 'workgrant' ? <WorkGrant /> : <CompanyCar />;
}
