'use client';

import { Banknote } from 'lucide-react';

/** Advanced cash-flow DSCR requires actual OCF and CapEx inputs. */
export function AdvancedDSCRDisplay() {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 p-6 text-center">
      <Banknote className="w-10 h-10 text-amber-700 mx-auto mb-3" />
      <h3 className="font-bold text-amber-950 mb-2">DSCR תזרימי מתקדם אינו מחושב</h3>
      <p className="text-sm text-amber-900 max-w-2xl mx-auto">
        לחישוב נדרשים תזרים מפעילות שוטפת, השקעות הוניות ושירות חוב בפועל. המערכת אינה
        מניחה אחוזים שרירותיים מהכנסות או מ-EBITDA במקום הנתונים החסרים.
      </p>
    </div>
  );
}
