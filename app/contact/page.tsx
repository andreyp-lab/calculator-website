import type { Metadata } from 'next';
import { SITE_INFO } from '@/lib/config/site-info';

export const metadata: Metadata = {
  // הערה: ה-template ב-root layout מוסיף "| חשבונאי" — לא לכלול את המותג כאן (כפילות)
  title: 'צור קשר',
  description:
    'יש שאלה, הצעה או דיווח על אי-דיוק במחשבון? צרו קשר עם צוות חשבונאי בדוא״ל.',
  alternates: { canonical: '/contact' },
  openGraph: {
    // OG image לא מתפשט מ-app/opengraph-image.tsx לדפים שמגדירים openGraph משלהם.
    images: ['/opengraph-image'],
    title: 'צור קשר — חשבונאי',
    description: 'צרו קשר עם צוות חשבונאי בדוא״ל.',
    url: '/contact',
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-6">יצירת קשר</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">כתבו לנו</h2>
            <p className="text-ink/70 mb-6">יש שאלה על כלי באתר או גיליתם נתון שדורש תיקון? שלחו הודעה לכתובת הדוא״ל שלנו.</p>
            <a
              href={`mailto:${SITE_INFO.contact.email}?subject=%D7%A4%D7%A0%D7%99%D7%99%D7%94%20%D7%9E%D7%90%D7%AA%D7%A8%20%D7%97%D7%A9%D7%91%D7%95%D7%A0%D7%90%D7%99`}
              className="inline-block bg-ink text-cream px-6 py-3 hover:bg-ink-deep transition font-medium"
            >
              פתח הודעת דוא״ל
            </a>
            <p className="text-sm text-ink/60 mt-3">יישום הדוא״ל במכשיר ייפתח. יש לשלוח את ההודעה מתוכו.</p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">פרטי יצירת קשר</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-ink mb-2">דוא&quot;ל</h3>
                <p className="text-ink/70">
                  <a href={`mailto:${SITE_INFO.contact.email}`} className="hover:text-gold">
                    {SITE_INFO.contact.email}
                  </a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
