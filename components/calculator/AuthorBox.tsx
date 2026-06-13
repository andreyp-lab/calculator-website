import { BadgeCheck } from 'lucide-react';

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
        <div className="w-16 h-16 bg-gold flex items-center justify-center text-cream text-2xl font-serif font-bold flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-xl text-ink">{name}</h4>
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
