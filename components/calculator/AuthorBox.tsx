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
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900">{name}</h4>
            <BadgeCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {title}
            {licenseNumber && ` · רישיון ${licenseNumber}`}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
}
