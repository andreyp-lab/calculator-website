'use client';

import { FormEvent, useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Implement email sending
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-6">יצירת קשר</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">שלח לנו הודעה</h2>

            {submitted && (
              <div className="bg-cream-2 border border-ink/15 text-ink px-4 py-3 mb-6">
                ✓ תודה על פנייתך! לפנייה מהירה יותר, שלח הודעה ישירות לכתובת האימייל שלנו.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="שם שלך"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  דוא&quot;ל
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  נושא
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-ink/15 focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="מה הנושא?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  הודעה
                </label>
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
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">פרטי יצירת קשר</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-ink mb-2">דוא&quot;ל</h3>
                <p className="text-ink/70">
                  <a href="mailto:info@cheshbonai.co.il" className="hover:text-gold">
                    info@cheshbonai.co.il
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-ink mb-2">שעות פעילות</h3>
                <p className="text-ink/70">
                  ראשון - חמישי: 9:00 - 17:00<br />
                  שישי וחגים: סגור
                </p>
              </div>

              <div className="bg-cream-2 p-4 border border-ink/15">
                <p className="text-sm text-ink/70">
                  <strong>שים לב:</strong> אנו משיבים לכל הודעה תוך 24 שעות בימי עבודה.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
