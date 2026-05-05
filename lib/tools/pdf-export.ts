/**
 * ייצוא PDF מקצועי לתזרים מזומנים ולתקציב
 *
 * כולל:
 * - כותרת מותגת
 * - סיכום מנהלים (KPIs)
 * - טבלת תזרים חודשית
 * - גרפים (יוצא כתמונה)
 * - הערות וכתבי הסבר
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { MonthlyCashFlow } from './types';
import { calculateCashFlowKPIs } from './cashflow-engine';

interface PDFExportInput {
  title: string;
  subtitle?: string;
  scenarioName?: string;
  monthlyData?: MonthlyCashFlow[];
  currency?: string;
  /** Selectors of chart containers to capture as images */
  chartSelectors?: string[];
}

function formatCurrency(value: number, currency: string = 'ILS'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export async function exportCashFlowPDF(input: PDFExportInput): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  // Hebrew font - use Helvetica for now (jsPDF default)
  // Note: Hebrew text in jsPDF is limited - we'll use simple text
  // Hebrew/RTL support
  pdf.setR2L(true);

  // ============= Header =============
  pdf.setFillColor(59, 130, 246); // blue-500
  pdf.rect(0, 0, pageWidth, 25, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text(input.title, pageWidth / 2, 15, { align: 'center' });

  if (input.subtitle) {
    pdf.setFontSize(11);
    pdf.text(input.subtitle, pageWidth / 2, 21, { align: 'center' });
  }

  let currentY = 35;

  // Scenario info
  if (input.scenarioName) {
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Scenario: ${input.scenarioName}`, pageWidth - margin, currentY, { align: 'right' });
    pdf.text(
      `Date: ${new Date().toLocaleDateString('he-IL')}`,
      margin,
      currentY,
      { align: 'left' },
    );
    currentY += 8;
  }

  // ============= KPI Summary =============
  if (input.monthlyData && input.monthlyData.length > 0) {
    const kpis = calculateCashFlowKPIs(input.monthlyData);
    const currency = input.currency ?? 'ILS';

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(20, 20, 20);
    pdf.text('Executive Summary | סיכום מנהלים', margin, currentY);
    currentY += 8;

    // KPI Table
    autoTable(pdf, {
      startY: currentY,
      head: [['KPI / מדד', 'Value / ערך']],
      body: [
        ['Opening Cash | יתרת פתיחה', formatCurrency(kpis.currentCash, currency)],
        ['Total Inflow | סך תקבולים', formatCurrency(kpis.totalInflow, currency)],
        ['Total Outflow | סך תשלומים', formatCurrency(kpis.totalOutflow, currency)],
        ['Net Cash Flow | תזרים נטו', formatCurrency(kpis.netCashFlow, currency)],
        ['Closing Balance | יתרת סיום', formatCurrency(kpis.closingBalance, currency)],
        ['Min Balance | יתרה מינימלית', formatCurrency(kpis.minBalance, currency)],
        ['Burn Rate | קצב שחיקה', formatCurrency(kpis.burnRate, currency)],
        [
          'Cash Runway | חודשים עד אזילה',
          Number.isFinite(kpis.runwayMonths) && kpis.runwayMonths > 0
            ? `${kpis.runwayMonths.toFixed(1)} months`
            : 'Infinite',
        ],
        ['Negative Months | חודשים שליליים', `${kpis.negativeMonths} / ${input.monthlyData.length}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [40, 40, 40], fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    currentY = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    // ============= Monthly Cash Flow Table =============
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(20, 20, 20);
    pdf.text('Monthly Cash Flow | תזרים חודשי', margin, currentY);
    currentY += 6;

    autoTable(pdf, {
      startY: currentY,
      head: [['Month', 'Opening', 'Inflow', 'Outflow', 'Net', 'Closing']],
      body: input.monthlyData.map((m) => [
        m.monthName,
        formatCurrency(m.openingBalance, currency),
        formatCurrency(m.incomeReceived, currency),
        formatCurrency(m.expensesPaid, currency),
        formatCurrency(m.netCashFlow, currency),
        formatCurrency(m.closingBalance, currency),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      didParseCell: (data) => {
        // Color negative amounts red
        if (data.section === 'body') {
          const cellText = String(data.cell.raw ?? '');
          if (cellText.includes('-') || cellText.includes('(')) {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      },
      margin: { left: margin, right: margin },
    });

    currentY = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  // ============= Charts =============
  if (input.chartSelectors && input.chartSelectors.length > 0) {
    for (const selector of input.chartSelectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (!element) continue;

      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');

        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // New page if needed
        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, Math.min(imgHeight, 100));
        currentY += Math.min(imgHeight, 100) + 8;
      } catch (e) {
        console.error('Failed to capture chart:', selector, e);
      }
    }
  }

  // ============= Footer =============
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Page ${i} / ${pageCount} | FinCalc Pro | ${new Date().toLocaleDateString('he-IL')}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' },
    );
  }

  // Disclaimer on last page
  pdf.setPage(pageCount);
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  const disclaimerY = pageHeight - 20;
  pdf.text(
    'Disclaimer: This report is for planning purposes only. Actual results may vary. Consult a professional advisor.',
    pageWidth / 2,
    disclaimerY,
    { align: 'center', maxWidth: pageWidth - 2 * margin },
  );

  // Save
  const filename = `${input.scenarioName || 'cashflow'}_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(filename);
}
