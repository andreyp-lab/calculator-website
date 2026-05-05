'use client';

import { useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  BUDGET_TEMPLATES,
  instantiateTemplate,
} from '@/lib/tools/templates';
import type { BudgetTemplate } from '@/lib/tools/types';
import {
  Cloud,
  UtensilsCrossed,
  ShoppingCart,
  Laptop,
  Stethoscope,
  HardHat,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const ICONS: Record<string, typeof Cloud> = {
  Cloud,
  UtensilsCrossed,
  ShoppingCart,
  Laptop,
  Stethoscope,
  HardHat,
};

export function TemplatesLibrary() {
  const { replaceBudget } = useTools();
  const [confirmTemplate, setConfirmTemplate] = useState<BudgetTemplate | null>(null);

  function handleApply(template: BudgetTemplate) {
    const fresh = instantiateTemplate(template);
    replaceBudget(fresh);
    setConfirmTemplate(null);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            תבניות תקציב מוכנות
          </h3>
          <p className="text-xs text-violet-100">
            התחל מתבנית של עסקים דומים והתאם אותה אליך — חוסך שעות הקלדה
          </p>
        </div>
      </div>

      {/* Templates grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {BUDGET_TEMPLATES.map((template) => {
          const Icon = ICONS[template.icon] ?? Cloud;
          return (
            <div
              key={template.id}
              className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden hover:border-violet-400 transition"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-violet-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-3 text-center">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-500">הכנסות</div>
                    <div className="text-xs font-semibold">{template.budget.income.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-500">הוצאות</div>
                    <div className="text-xs font-semibold">{template.budget.expenses.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-[10px] text-gray-500">עובדים</div>
                    <div className="text-xs font-semibold">{template.budget.employees.length}</div>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {template.notes.slice(0, 2).map((note, i) => (
                    <div key={i} className="flex items-start gap-1 text-[11px] text-gray-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{note}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setConfirmTemplate(template)}
                  className="w-full px-3 py-2 bg-violet-600 text-white rounded text-sm hover:bg-violet-700 font-medium"
                >
                  בחר תבנית זו
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation modal */}
      {confirmTemplate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setConfirmTemplate(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">החלפת תקציב נוכחי?</h3>
            <p className="text-sm text-gray-700 mb-3">
              פעולה זו <strong>תחליף את התקציב הנוכחי</strong> בתבנית "{confirmTemplate.name}".
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-900 mb-4">
              💡 הנתונים הנוכחיים יימחקו. שמור תרחיש לפני שתמשיך אם אתה רוצה לשמור את העבודה הקיימת.
            </div>

            <div className="bg-gray-50 rounded p-3 mb-4 text-xs space-y-1">
              <div className="font-semibold mb-1">מה תקבל:</div>
              <div>• {confirmTemplate.budget.income.length} מקורות הכנסה</div>
              <div>• {confirmTemplate.budget.expenses.length} פרטי הוצאה</div>
              <div>• {confirmTemplate.budget.employees.length} עובדים</div>
              <div>• {confirmTemplate.budget.loans.length} הלוואות</div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmTemplate(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                ביטול
              </button>
              <button
                onClick={() => handleApply(confirmTemplate)}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
              >
                החל תבנית
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
