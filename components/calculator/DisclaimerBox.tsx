import { AlertTriangle } from 'lucide-react';

interface DisclaimerBoxProps {
  text?: string;
}

export function DisclaimerBox({ text }: DisclaimerBoxProps) {
  const defaultText =
    'התוצאה המוצגת היא אומדן בלבד, מבוססת על נתונים שהזנת ועל החוק התקף בשנת המס. אין במידע זה משום ייעוץ משפטי, מס או פיננסי. לפני קבלת החלטות חשובות, יש להתייעץ עם רואה חשבון או עורך דין מוסמך.';

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-amber-900 mb-1">כתב ויתור</h4>
        <p className="text-sm text-amber-800 leading-relaxed">{text || defaultText}</p>
      </div>
    </div>
  );
}
