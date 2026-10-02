'use client';

import { Droplets } from 'lucide-react';

/** Cash-flow quality cannot be derived from forecast budget totals alone. */
export function CashFlowQualityDisplay() {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 p-6 text-center">
      <Droplets className="w-10 h-10 text-amber-700 mx-auto mb-3" />
      <h3 className="font-bold text-amber-950 mb-2">איכות תזרים אינה מחושבת</h3>
      <p className="text-sm text-amber-900 max-w-2xl mx-auto">
        ניתוח איכות תזרים ו-FCF דורש שינויי לקוחות, מלאי וספקים, CapEx, פחת והחזרי חוב
        בפועל. עד להזנת הנתונים האלה, לא יוצגו אומדנים מלאכותיים או ציון איכות.
      </p>
    </div>
  );
}
