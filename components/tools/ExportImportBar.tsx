'use client';

import { useRef, useState } from 'react';
import { useTools } from '@/lib/tools/ToolsContext';
import {
  exportToExcel,
  importFromExcel,
  downloadTemplate,
  type ImportResult,
} from '@/lib/tools/excel-io';
import {
  Download,
  Upload,
  FileText,
  Printer,
  FileDown,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export function ExportImportBar() {
  const {
    scenario,
    settings,
    budget,
    cashFlow,
    balanceSheet,
    addIncome,
    addExpense,
    addLoan,
    addEmployee,
    addBankAccount,
    addDelay,
    addCustomExpense,
    updateSettings,
    updateBalanceSheet,
  } = useTools();

  const [menuOpen, setMenuOpen] = useState(false);
  const [importMessage, setImportMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportExcel() {
    exportToExcel({
      settings,
      budget,
      cashFlow,
      balanceSheet,
      scenarioName: scenario?.name,
    });
    setMenuOpen(false);
  }

  function handleDownloadTemplate() {
    downloadTemplate();
    setMenuOpen(false);
  }

  function handlePrint() {
    window.print();
    setMenuOpen(false);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
    setMenuOpen(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result: ImportResult = await importFromExcel(file);

    if (!result.success) {
      setImportMessage({
        type: 'error',
        text: result.errors.join(', '),
      });
      return;
    }

    // החלת הנתונים
    let imported = 0;

    if (result.imported.settings) {
      updateSettings(result.imported.settings);
      imported++;
    }
    if (result.imported.income) {
      result.imported.income.forEach(addIncome);
      imported += result.imported.income.length;
    }
    if (result.imported.expenses) {
      result.imported.expenses.forEach(addExpense);
      imported += result.imported.expenses.length;
    }
    if (result.imported.loans) {
      result.imported.loans.forEach(addLoan);
      imported += result.imported.loans.length;
    }
    if (result.imported.employees) {
      result.imported.employees.forEach(addEmployee);
      imported += result.imported.employees.length;
    }
    if (result.imported.bankAccounts) {
      result.imported.bankAccounts.forEach(addBankAccount);
      imported += result.imported.bankAccounts.length;
    }
    if (result.imported.delays) {
      result.imported.delays.forEach(addDelay);
      imported += result.imported.delays.length;
    }
    if (result.imported.customExpenses) {
      result.imported.customExpenses.forEach(addCustomExpense);
      imported += result.imported.customExpenses.length;
    }
    if (result.imported.balanceSheet) {
      updateBalanceSheet(result.imported.balanceSheet);
      imported++;
    }

    setImportMessage({
      type: 'success',
      text: `יובא בהצלחה - ${imported} פריטים`,
    });

    // איפוס ה-input
    if (fileInputRef.current) fileInputRef.current.value = '';

    // ניקוי הודעה אחרי 5 שניות
    setTimeout(() => setImportMessage(null), 5000);
  }

  return (
    <div className="relative print:hidden">
      <div className="flex items-center gap-2">
        {/* Main button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-sm"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            ייצוא / ייבוא
            <ChevronDown
              className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  ייצוא
                </div>
                <button
                  onClick={handleExportExcel}
                  className="w-full text-right flex items-center gap-2 px-3 py-2 hover:bg-blue-50 text-sm"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1">
                    <div className="font-medium">ייצוא ל-Excel</div>
                    <div className="text-xs text-gray-500">כל הנתונים ב-9 גיליונות</div>
                  </div>
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full text-right flex items-center gap-2 px-3 py-2 hover:bg-blue-50 text-sm"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">ייצוא ל-PDF</div>
                    <div className="text-xs text-gray-500">דרך הדפסה (Ctrl+P)</div>
                  </div>
                </button>

                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100 mt-1">
                  ייבוא
                </div>
                <button
                  onClick={handleImportClick}
                  className="w-full text-right flex items-center gap-2 px-3 py-2 hover:bg-blue-50 text-sm"
                >
                  <Upload className="w-4 h-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">ייבוא מ-Excel</div>
                    <div className="text-xs text-gray-500">העלה קובץ xlsx</div>
                  </div>
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full text-right flex items-center gap-2 px-3 py-2 hover:bg-blue-50 text-sm"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div className="flex-1">
                    <div className="font-medium">הורד תבנית ריקה</div>
                    <div className="text-xs text-gray-500">דוגמאות מוכנות לעריכה</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* הודעת ייבוא */}
      {importMessage && (
        <div
          className={`absolute top-full mt-2 right-0 z-30 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm whitespace-nowrap ${
            importMessage.type === 'success'
              ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-2 border-red-300 text-red-900'
          }`}
        >
          {importMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {importMessage.text}
        </div>
      )}
    </div>
  );
}
