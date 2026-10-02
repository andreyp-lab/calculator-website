'use client';

import { University } from 'lucide-react';

/** A lender recommendation requires verified, lender-specific underwriting data. */
export function BankCreditAdvice() {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 p-6 text-center">
      <University className="w-10 h-10 text-amber-700 mx-auto mb-3" />
      <h3 className="font-bold text-amber-950 mb-2">הערכת אשראי בנקאי אינה מחושבת</h3>
      <p className="text-sm text-amber-900 max-w-2xl mx-auto">
        המלצת אישור, הסתברות כשל, תמחור וקיבולת אשראי דורשים נתוני אשראי מאומתים,
        בטוחות, תזרים תפעולי בפועל ומודל מכויל של המלווה. הנתונים האלה אינם נאספים כאן,
        ולכן לא מוצגת הערכה מספרית או המלצת אישור.
      </p>
    </div>
  );
}
