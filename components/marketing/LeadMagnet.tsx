'use client';

import { useState } from 'react';

interface LeadMagnetProps {
  /** מזהה המדריך-מתנה (תואם ל-MAGNETS ב-/api/lead) */
  magnet: string;
  title: string;
  description: string;
  bullets: string[];
  /** נתיב הדף הנוכחי — לשיוך הליד */
  page: string;
}

/**
 * LeadMagnet — טופס לכידת מייל בתמורה למדריך-מתנה חינמי.
 * בונה רשימת תפוצה בבעלות העסק (נכס שיווקי עצמאי), ומחמם לקראת הקורס.
 */
export function LeadMagnet({ magnet, title, description, bullets, page }: LeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('/');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    // קריאת פרמטרי UTM מה-URL לשיוך מקור
    let utm: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      utm = {
        utm_source: sp.get('utm_source') ?? '',
        utm_medium: sp.get('utm_medium') ?? '',
        utm_campaign: sp.get('utm_campaign') ?? '',
      };
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, magnet, page, ...utm }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'אירעה שגיאה, נסה שוב');
        setStatus('error');
        return;
      }
      setDownloadUrl(data.downloadUrl || '/');
      setStatus('done');
    } catch {
      setErrorMsg('אירעה שגיאה, נסה שוב');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <aside className="not-prose rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 md:p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">המדריך מוכן!</h3>
        <p className="text-gray-700 mb-5">
          שלחנו לך גם עותק למייל. אפשר לפתוח את המדריך עכשיו:
        </p>
        <a
          href={downloadUrl}
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl transition"
        >
          פתח את המדריך ←
        </a>
      </aside>
    );
  }

  return (
    <aside className="not-prose rounded-2xl border-2 border-blue-200 bg-gradient-to-bl from-blue-50 to-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold rounded-full px-3 py-1 mb-3">
            📥 מדריך חינמי להורדה
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          <ul className="space-y-1.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-0.5" aria-hidden>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-72 flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-left focus:border-blue-500 focus:outline-none"
              aria-label="כתובת אימייל"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-lg transition"
            >
              {status === 'loading' ? 'שולח…' : 'שלחו לי את המדריך'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            )}
            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              בלחיצה אני מאשר/ת קבלת המדריך ותכנים מקצועיים במייל. ניתן להסיר בכל עת.
            </p>
          </form>
        </div>
      </div>
    </aside>
  );
}
