import type { ReactNode } from 'react';

/** רכיבי UI משותפים לווידג'טים של מחשבונים (קלטים, בחירה, תוצאה, הערה). */
export const field = 'mt-2 block w-full border border-ink/20 bg-cream p-3';

export const fmt = (v: number | null, d = 2) =>
  v === null ? '—' : v.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: d });
export const shekel = (v: number | null, d = 2) => (v === null ? '—' : `${fmt(v, d)} ₪`);

export function Box({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-8 border border-ink/15 bg-paper p-6" dir="rtl">
      {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
      {children}
    </div>
  );
}

export function NumField({
  label, value, set, ...rest
}: { label: string; value: string; set: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label}
      <input className={field} type="number" inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} {...rest} />
    </label>
  );
}

export function SelField({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      {label}
      <select className={field} value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}

export function Result({ children }: { children: ReactNode }) {
  return <div className="mt-4" aria-live="polite">{children}</div>;
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-ink/70">{children}</p>;
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border border-ink/15 bg-cream p-3">
      <div className="text-sm text-ink/70">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
