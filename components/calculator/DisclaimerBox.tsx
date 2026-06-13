import { AlertTriangle } from 'lucide-react';

interface DisclaimerBoxProps {
  text?: string;
}

export function DisclaimerBox({ text }: DisclaimerBoxProps) {
  const defaultText =
    'התוצאה המוצגת היא אומדן בלבד, מבוססת על נתונים שהזנת ועל החוק התקף בשנת המס. אין במידע זה משום ייעוץ משפטי, מס או פיננסי. לפני קבלת החלטות חשובות, יש להתייעץ עם רואה חשבון או עורך דין מוסמך.';

  return (
    <div className="bg-cream-2 border border-ink/15 p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-1.5">כתב ויתור</h4>
        <p className="text-sm text-ink/70 leading-relaxed">{text || defaultText}</p>
      </div>
    </div>
  );
}
