'use client';

import { FormEvent, useState } from 'react';

/**
 * טופס יצירת הקשר — החלק האינטראקטיבי בלבד.
 * מופרד מ-app/contact/page.tsx כדי שהדף יישאר Server Component ויוכל לייצא metadata.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Implement email sending
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <>
      {submitted && (
        <div className="bg-cream-2 border border-ink/15 text-ink px-4 py-3 mb-6">
          ✓ תודה על פנייתך! לפנייה מהירה יותר, שלח הודעה ישירות לכתובת האימייל שלנו.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">שם מלא</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="שם שלך"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">דוא&quot;ל</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">נושא</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="מה הנושא?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">הודעה</label>
          <textarea
            required
            rows={5}
            className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="כתוב את הודעתך כאן..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-ink text-cream py-2 hover:bg-ink-deep transition font-medium"
        >
          שלח הודעה
        </button>
      </form>
    </>
  );
}
