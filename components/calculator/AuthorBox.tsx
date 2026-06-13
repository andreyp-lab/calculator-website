import { BadgeCheck } from 'lucide-react';

interface AuthorBoxProps {
  name?: string;
  title?: string;
  bio?: string;
  licenseNumber?: string;
}

export function AuthorBox({
  name = 'אנדריי פ.',
  title = 'רואה חשבון מוסמך',
  bio = 'רואה חשבון עם ניסיון של 15+ שנים בתחום המיסוי, זכויות עובדים וייעוץ פיננסי בישראל. מתמחה בליווי שכירים, עצמאיים ועסקים קטנים.',
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
