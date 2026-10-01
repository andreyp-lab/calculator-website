import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';

interface AuthorBoxProps {
  name?: string;
  title?: string;
  bio?: string;
  licenseNumber?: string;
}

export function AuthorBox({
  name = 'אנדרי פלטונוב',
  title = 'רו״ח מוסמך · סמנכ״ל כספים',
  bio = 'רואה חשבון מוסמך וסמנכ״ל כספים עם 15+ שנות ניסיון בניהול פיננסי — בענפי הייצור, ההייטק, הקמעונאות, התקשורת והשירותים. מתמחה בניהול כספים והבראת חברות.',
  licenseNumber,
}: AuthorBoxProps) {
  return (
    <div className="bg-paper border border-ink/15 p-6">
      <div className="flex items-start gap-4">
        <Image
          src="/images/andrey-platonov.jpg"
          alt={name}
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 object-cover object-top"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* לא כותרת: ה-AuthorBox משובץ בעומקי מסמך שונים, ו-h4 ללא h3 שקדם לו
                שבר את סדר הכותרות. שם המחבר נושא משמעות SEO דרך Person schema, לא דרך תג כותרת. */}
            <p className="font-serif text-xl text-ink">{name}</p>
            <BadgeCheck className="w-4 h-4 text-gold" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold mb-2.5">
            {title}
            {licenseNumber && ` · רישיון ${licenseNumber}`}
          </p>
          <p className="text-sm text-ink/70 leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
}
