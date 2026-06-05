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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">יצירת קשר</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">שלח לנו הודעה</h2>

            {submitted && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
                ✓ תודה על פנייתך! לפנייה מהירה יותר, שלח הודעה ישירות לכתובת האימייל שלנו.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="שם שלך"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  דוא&quot;ל
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  נושא
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="מה הנושא?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הודעה
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="כתוב את הודעתך כאן..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                שלח הודעה
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטי יצירת קשר</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">דוא&quot;ל</h3>
                <p className="text-gray-600">
                  <a href="mailto:info@cheshbonai.co.il" className="hover:text-blue-600">
                    info@cheshbonai.co.il
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">שעות פעילות</h3>
                <p className="text-gray-600">
                  ראשון - חמישי: 9:00 - 17:00<br />
                  שישי וחגים: סגור
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">
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
