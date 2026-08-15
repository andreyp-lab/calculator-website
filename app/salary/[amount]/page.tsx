import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FAQ } from '@/components/calculator/FAQ';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { ArrowLeft } from 'lucide-react';
import {
  SALARY_PAGE_AMOUNTS,
  getSalaryPageData,
  monthlyCreditAmount,
} from '@/lib/data/salary-pages';

interface PageProps {
  params: Promise<{ amount: string }>;
}

// רק הסכומים מהרשימה — כל URL אחר יחזיר 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SALARY_PAGE_AMOUNTS.map((a) => ({ amount: String(a) }));
}

const fmt = (n: number) => Math.round(n).toLocaleString('he-IL');

function parseAmount(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && SALARY_PAGE_AMOUNTS.includes(n) ? n : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount: raw } = await params;
  const amount = parseAmount(raw);
  if (amount === null) return { title: 'לא נמצא' };

  const data = getSalaryPageData(amount);
  const title = `שכר ${fmt(amount)} ₪ ברוטו — כמה נטו? (2026)`;
  const description = `שכר ${fmt(amount)} ₪ ברוטו = כ-${fmt(data.noPension.netSalary)} ₪ נטו ללא פנסיה, או כ-${fmt(
    data.withPension.netSalary,
  )} ₪ עם פנסיה 6% (רווק/ה, 2.25 נקודות זיכוי). פירוט מס הכנסה וביטוח לאומי, עדכני 2026.`;

  return {
    title,
    description,
    alternates: { canonical: `/salary/${amount}` },
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    openGraph: {
      title,
      description,
      url: `/salary/${amount}`,
      type: 'article',
      locale: 'he_IL',
      images: ['/opengraph-image'],
    },
  };
}

export default async function SalaryAmountPage({ params }: PageProps) {
  const { amount: raw } = await params;
  const amount = parseAmount(raw);
  if (amount === null) notFound();

  const data = getSalaryPageData(amount);
  const { noPension, withPension } = data;
  const credit = monthlyCreditAmount(2.25);
  const grossTaxBeforeCredit = data.brackets.reduce((s, b) => s + b.taxMonthly, 0);

  const faqItems = [
    {
      question: `כמה נטו נשאר משכר ${fmt(amount)} ₪ ברוטו?`,
      answer: `לרווק/ה עם 2.25 נקודות זיכוי: כ-${fmt(noPension.netSalary)} ₪ נטו ללא הפרשה לפנסיה, וכ-${fmt(
        withPension.netSalary,
      )} ₪ נטו עם הפרשת עובד לפנסיה של 6%. הסכום המדויק תלוי בנקודות הזיכוי ובהפרשות בתלוש.`,
    },
    {
      question: `כמה מס הכנסה משלמים על ${fmt(amount)} ₪ ברוטו?`,
      answer: `כ-${fmt(noPension.incomeTax)} ₪ בחודש, אחרי זיכוי של ${fmt(credit)} ₪ בגין 2.25 נקודות זיכוי. המדרגה השולית היא ${noPension.marginalBracketInfo.currentBracketLabel} — כל שקל נוסף מעל השכר הזה ממוסה בשיעור זה.`,
    },
    {
      question: `כמה ביטוח לאומי ודמי בריאות מנוכים משכר ${fmt(amount)} ₪?`,
      answer: `כ-${fmt(noPension.socialSecurity)} ₪ בחודש (ביטוח לאומי ודמי בריאות יחד). הניכוי מחושב בשיעור מופחת על חלק השכר הנמוך ובשיעור מלא על היתרה.`,
    },
    {
      question: `כמה נטו עם יותר נקודות זיכוי (2.75 או 3.5)?`,
      answer: `עם פנסיה 6%: ${data.variants
        .map((v) => `${v.creditPoints} נקודות = כ-${fmt(v.withPensionNet)} ₪ נטו`)
        .join(', ')}. כל נקודת זיכוי שווה ${fmt(monthlyCreditAmount(1))} ₪ הפחתה במס בחודש (עד גובה המס).`,
    },
  ];

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'דף הבית', url: '/' },
          { name: 'מחשבון שכר נטו', url: '/personal-tax/salary-net-gross' },
          { name: `${fmt(amount)} ₪ ברוטו`, url: `/salary/${amount}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'דף הבית', href: '/' },
              { label: 'מחשבון שכר נטו', href: '/personal-tax/salary-net-gross' },
              { label: `${fmt(amount)} ₪ ברוטו` },
            ]}
          />
        </div>

        <header className="mb-8 pb-6 border-b border-ink/15">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">
            ✦ ברוטו נטו · שנת המס 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            שכר {fmt(amount)} ₪ ברוטו — כמה נטו? <span className="text-gold">(2026)</span>
          </h1>
        </header>

        {/* Quick answer */}
        <section className="answer-box bg-cream-2 border-r-4 border-gold p-5 mb-8" aria-label="תשובה מהירה">
          <p className="text-lg text-ink leading-relaxed">
            משכר של <strong>{fmt(amount)} ₪ ברוטו</strong> נשארים לרווק/ה עם 2.25 נקודות זיכוי{' '}
            <strong>כ-{fmt(noPension.netSalary)} ₪ נטו</strong> ללא הפרשה לפנסיה, או{' '}
            <strong>כ-{fmt(withPension.netSalary)} ₪ נטו</strong> עם הפרשת עובד לפנסיה של 6%. זהו{' '}
            {noPension.netPercentage.toFixed(0)}% מהברוטו (ללא פנסיה), לפי מדרגות המס וביטוח לאומי 2026.
          </p>
        </section>

        {/* Breakdown table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">פירוט הניכויים משכר {fmt(amount)} ₪</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-paper border border-ink/15 text-ink">
              <thead>
                <tr className="bg-cream-2 border-b border-ink/15">
                  <th className="p-3 text-right font-bold">רכיב</th>
                  <th className="p-3 text-left font-bold">ללא פנסיה</th>
                  <th className="p-3 text-left font-bold">עם פנסיה 6%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink/10">
                  <td className="p-3">שכר ברוטו</td>
                  <td className="p-3 text-left font-mono">{fmt(amount)} ₪</td>
                  <td className="p-3 text-left font-mono">{fmt(amount)} ₪</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="p-3">מס הכנסה (אחרי 2.25 נ״ז)</td>
                  <td className="p-3 text-left font-mono">−{fmt(noPension.incomeTax)} ₪</td>
                  <td className="p-3 text-left font-mono">−{fmt(withPension.incomeTax)} ₪</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="p-3">ביטוח לאומי ודמי בריאות</td>
                  <td className="p-3 text-left font-mono">−{fmt(noPension.socialSecurity)} ₪</td>
                  <td className="p-3 text-left font-mono">−{fmt(withPension.socialSecurity)} ₪</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="p-3">פנסיה (עובד 6%)</td>
                  <td className="p-3 text-left font-mono">—</td>
                  <td className="p-3 text-left font-mono">−{fmt(withPension.pensionDeduction)} ₪</td>
                </tr>
                <tr className="bg-cream-2 font-bold">
                  <td className="p-3">נטו</td>
                  <td className="p-3 text-left font-mono">{fmt(noPension.netSalary)} ₪</td>
                  <td className="p-3 text-left font-mono">{fmt(withPension.netSalary)} ₪</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink/70">
            רווק/ה, 2.25 נקודות זיכוי, ללא קרן השתלמות וללא ביטוח אובדן כושר עבודה.
          </p>
        </section>

        {/* Income tax by bracket */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">איך מחושב מס ההכנסה? פירוק לפי מדרגות</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-paper border border-ink/15 text-ink">
              <thead>
                <tr className="bg-cream-2 border-b border-ink/15">
                  <th className="p-3 text-right font-bold">מדרגה (חודשי)</th>
                  <th className="p-3 text-left font-bold">שיעור</th>
                  <th className="p-3 text-left font-bold">חלק השכר</th>
                  <th className="p-3 text-left font-bold">מס</th>
                </tr>
              </thead>
              <tbody>
                {data.brackets.map((b, i) => (
                  <tr key={i} className="border-b border-ink/10">
                    <td className="p-3">{b.label}</td>
                    <td className="p-3 text-left font-mono">{b.ratePercent.toFixed(0)}%</td>
                    <td className="p-3 text-left font-mono">{fmt(b.taxedMonthly)} ₪</td>
                    <td className="p-3 text-left font-mono">{fmt(b.taxMonthly)} ₪</td>
                  </tr>
                ))}
                <tr className="border-b border-ink/10">
                  <td className="p-3">סה״כ מס לפני זיכוי</td>
                  <td className="p-3" />
                  <td className="p-3" />
                  <td className="p-3 text-left font-mono">{fmt(grossTaxBeforeCredit)} ₪</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="p-3">זיכוי — 2.25 נקודות זיכוי</td>
                  <td className="p-3" />
                  <td className="p-3" />
                  <td className="p-3 text-left font-mono">−{fmt(Math.min(credit, grossTaxBeforeCredit))} ₪</td>
                </tr>
                <tr className="bg-cream-2 font-bold">
                  <td className="p-3">מס הכנסה בפועל</td>
                  <td className="p-3" />
                  <td className="p-3" />
                  <td className="p-3 text-left font-mono">{fmt(noPension.incomeTax)} ₪</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Credit point variants */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4">נטו לפי נקודות זיכוי</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-paper border border-ink/15 text-ink">
              <thead>
                <tr className="bg-cream-2 border-b border-ink/15">
                  <th className="p-3 text-right font-bold">נקודות זיכוי</th>
                  <th className="p-3 text-left font-bold">נטו ללא פנסיה</th>
                  <th className="p-3 text-left font-bold">נטו עם פנסיה 6%</th>
                </tr>
              </thead>
              <tbody>
                {data.variants.map((v) => (
                  <tr key={v.creditPoints} className="border-b border-ink/10">
                    <td className="p-3">
                      {v.creditPoints}
                      {v.creditPoints === 2.25 && ' (רווק)'}
                      {v.creditPoints === 2.75 && ' (רווקה)'}
                    </td>
                    <td className="p-3 text-left font-mono">{fmt(v.noPensionNet)} ₪</td>
                    <td className="p-3 text-left font-mono">{fmt(v.withPensionNet)} ₪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink/70">
            לא בטוחים כמה נקודות זיכוי מגיעות לכם? יש הבדל לפי מגדר, ילדים, תואר ועוד —{' '}
            <Link href="/personal-tax/tax-credits" className="text-gold hover:text-gold-2 font-medium">
              מחשבון נקודות זיכוי
            </Link>
            .
          </p>
        </section>

        {/* CTA to full calculator */}
        <section className="mb-10 bg-ink p-6 text-cream">
          <p className="font-serif text-xl mb-3 leading-snug">
            רוצים חישוב מדויק למצב שלכם? ילדים, קרן השתלמות, נטו→ברוטו ועוד
          </p>
          <Link
            href="/personal-tax/salary-net-gross"
            className="inline-block bg-gold px-8 py-3.5 text-sm font-bold text-paper transition hover:bg-gold-2"
          >
            למחשבון שכר נטו/ברוטו המלא ←
          </Link>
        </section>

        {/* FAQ (כולל FAQPage JSON-LD מתוך הקומפוננטה) */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-6">שאלות נפוצות — {fmt(amount)} ₪ ברוטו</h2>
          <FAQ items={faqItems} />
        </section>

        {/* Nearby amounts */}
        <section className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">✦ סכומים קרובים</p>
          <ul className="flex flex-wrap gap-2">
            {data.nearby.map((a) => (
              <li key={a}>
                <Link
                  href={`/salary/${a}`}
                  className="inline-block bg-paper border border-ink/15 hover:border-gold px-3 py-2 text-sm text-ink transition"
                >
                  {fmt(a)} ₪ ברוטו כמה נטו
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/personal-tax/salary-net-gross"
                className="inline-block bg-paper border border-ink/15 hover:border-gold px-3 py-2 text-sm text-gold font-medium transition"
              >
                כל סכום אחר — למחשבון המלא
              </Link>
            </li>
          </ul>
        </section>

        {/* Related links */}
        <section className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-3">✦ כלים רלוונטיים</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/personal-tax/salary-net-gross', label: 'מחשבון שכר נטו/ברוטו מלא' },
              { href: '/personal-tax/tax-credits', label: 'מחשבון נקודות זיכוי' },
              { href: '/personal-tax/tax-refund', label: 'מחשבון החזר מס' },
              { href: '/salaried/payslip-guide', label: 'מדריך קריאת תלוש שכר' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-2 bg-paper border border-ink/15 hover:bg-paper-hover p-4 transition"
                >
                  <span className="text-ink font-medium">{l.label}</span>
                  <ArrowLeft className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mb-8 bg-cream-2 border border-ink/15 p-4">
          <p className="text-sm text-ink/75 leading-relaxed">
            החישוב משוער ומבוסס על מדרגות המס, נקודות הזיכוי וביטוח לאומי לשנת 2026, בהנחות המפורטות
            בעמוד. הנטו בפועל תלוי בנתונים האישיים ובהרכב התלוש. אין לראות בתוכן ייעוץ מס — הוא אינו
            תחליף לייעוץ מקצועי אישי.
          </p>
        </section>

        <section className="mb-8">
          <AuthorBox />
        </section>
      </div>
    </div>
  );
}
