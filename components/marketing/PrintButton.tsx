'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-medium px-5 py-2.5 rounded-lg transition print:hidden"
    >
      🖨️ הדפס / שמור כ-PDF
    </button>
  );
}
