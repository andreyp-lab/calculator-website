import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  // הערה: ה-template ב-root layout מוסיף "| חשבונאי" — לא לכלול את המותג כאן (כפילות)
  title: 'צור קשר',
  description:
    'יש שאלה, הצעה או דיווח על אי-דיוק במחשבון? צרו קשר עם צוות חשבונאי. אנו משיבים לכל פנייה תוך 24 שעות בימי עבודה.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'צור קשר — חשבונאי',
    description: 'צרו קשר עם צוות חשבונאי — מענה לכל פנייה תוך 24 שעות בימי עבודה.',
    url: '/contact',
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-6">יצירת קשר</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">שלח לנו הודעה</h2>
            <ContactForm />
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
