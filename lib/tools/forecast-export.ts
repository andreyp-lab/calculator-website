/**
 * ייצוא Three-Statement Model ל-PDF ו-Excel
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { ThreeStatementModel, AnnualStatements } from './types';

function fmt(v: number): string {
  return Math.round(v).toLocaleString('he-IL');
}

// ============================================================
// PDF EXPORT
// ============================================================

export function exportForecastPDF(
  model: ThreeStatementModel,
  companyName: string = 'Forecast',
): void {
  const pdf = new jsPDF('l', 'mm', 'a4'); // landscape for tables
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;

  pdf.setR2L(true);

  // Header
  pdf.setFillColor(79, 70, 229); // indigo
  pdf.rect(0, 0, pageWidth, 20, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Three-Statement Model | ${companyName}`, pageWidth / 2, 12, { align: 'center' });

  let y = 28;
  const allYears = [...model.historical, ...model.projected];

  // === P&L Table ===
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(20, 20, 20);
  pdf.text('Profit & Loss Statement', margin, y);
  y += 4;

  const pnlHead = [['Item', ...allYears.map((a) => `${a.year}${a.isProjection ? 'F' : ''}`)]];
  const pnlBody = [
    ['Revenue', ...allYears.map((a) => fmt(a.pnl.revenue))],
    ['COGS', ...allYears.map((a) => fmt(a.pnl.cogs))],
    ['Gross Profit', ...allYears.map((a) => fmt(a.pnl.grossProfit))],
    ['R&D', ...allYears.map((a) => fmt(a.pnl.rnd))],
    ['Marketing', ...allYears.map((a) => fmt(a.pnl.marketing))],
    ['Operating', ...allYears.map((a) => fmt(a.pnl.operating))],
    ['EBITDA', ...allYears.map((a) => fmt(a.pnl.ebitda))],
    ['Depreciation', ...allYears.map((a) => fmt(a.pnl.depreciation))],
    ['EBIT', ...allYears.map((a) => fmt(a.pnl.ebit))],
    ['Interest', ...allYears.map((a) => fmt(a.pnl.interest))],
    ['Tax', ...allYears.map((a) => fmt(a.pnl.tax))],
    ['Net Profit', ...allYears.map((a) => fmt(a.pnl.netProfit))],
  ];

  autoTable(pdf, {
    startY: y,
    head: pnlHead,
    body: pnlBody,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      // Highlight key rows
      if (data.section === 'body') {
        const idx = data.row.index;
        if (idx === 2 || idx === 6 || idx === 11) {
          // Gross / EBITDA / Net
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [219, 234, 254];
        }
      }
    },
  });

  y = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // === Balance Sheet ===
  if (y > pageHeight - 60) {
    pdf.addPage();
    y = margin;
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Balance Sheet', margin, y);
  y += 4;

  const bsBody = [
    ['Cash', ...allYears.map((a) => fmt(a.balanceSheet.cash))],
    ['Accounts Receivable', ...allYears.map((a) => fmt(a.balanceSheet.accountsReceivable))],
    ['Inventory', ...allYears.map((a) => fmt(a.balanceSheet.inventory))],
    ['Fixed Assets', ...allYears.map((a) => fmt(a.balanceSheet.fixedAssets))],
    ['Total Assets', ...allYears.map((a) => fmt(a.balanceSheet.totalAssets))],
    ['Accounts Payable', ...allYears.map((a) => fmt(a.balanceSheet.accountsPayable))],
    ['Long-Term Debt', ...allYears.map((a) => fmt(a.balanceSheet.longTermDebt))],
    ['Total Liabilities', ...allYears.map((a) => fmt(a.balanceSheet.totalLiabilities))],
    ['Total Equity', ...allYears.map((a) => fmt(a.balanceSheet.totalEquity))],
  ];

  autoTable(pdf, {
    startY: y,
    head: pnlHead,
    body: bsBody,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  y = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // === Cash Flow ===
  if (y > pageHeight - 50) {
    pdf.addPage();
    y = margin;
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Cash Flow Statement', margin, y);
  y += 4;

  const cfBody = [
    ['Operating CF', ...allYears.map((a) => fmt(a.cashFlow.cashFromOperations))],
    ['Investing CF', ...allYears.map((a) => fmt(a.cashFlow.cashFromInvesting))],
    ['Financing CF', ...allYears.map((a) => fmt(a.cashFlow.cashFromFinancing))],
    ['Net Change', ...allYears.map((a) => fmt(a.cashFlow.netChangeInCash))],
    ['Closing Cash', ...allYears.map((a) => fmt(a.cashFlow.closingCash))],
  ];

  autoTable(pdf, {
    startY: y,
    head: pnlHead,
    body: cfBody,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  // Footer disclaimer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `${i} / ${pageCount} | FinCalc Pro Three-Statement Model | ${new Date().toLocaleDateString('he-IL')}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' },
    );
  }

  pdf.save(`${companyName}_3statement_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ============================================================
// EXCEL EXPORT
// ============================================================

export function exportForecastExcel(
  model: ThreeStatementModel,
  companyName: string = 'Forecast',
): void {
  const wb = XLSX.utils.book_new();
  const allYears = [...model.historical, ...model.projected];
  const yearHeaders = allYears.map((a) => `${a.year}${a.isProjection ? 'F' : ''}`);

  // === P&L Sheet ===
  const pnlData: (string | number)[][] = [
    ['Three-Statement Financial Model', companyName],
    [],
    ['P&L', ...yearHeaders],
    ['Revenue', ...allYears.map((a) => Math.round(a.pnl.revenue))],
    ['COGS', ...allYears.map((a) => Math.round(a.pnl.cogs))],
    ['Gross Profit', ...allYears.map((a) => Math.round(a.pnl.grossProfit))],
    ['Gross Margin %', ...allYears.map((a) => Number(((a.pnl.grossProfit / (a.pnl.revenue || 1)) * 100).toFixed(1)))],
    [],
    ['R&D', ...allYears.map((a) => Math.round(a.pnl.rnd))],
    ['Marketing', ...allYears.map((a) => Math.round(a.pnl.marketing))],
    ['Operating', ...allYears.map((a) => Math.round(a.pnl.operating))],
    ['EBITDA', ...allYears.map((a) => Math.round(a.pnl.ebitda))],
    ['EBITDA Margin %', ...allYears.map((a) => Number(((a.pnl.ebitda / (a.pnl.revenue || 1)) * 100).toFixed(1)))],
    [],
    ['Depreciation', ...allYears.map((a) => Math.round(a.pnl.depreciation))],
    ['EBIT', ...allYears.map((a) => Math.round(a.pnl.ebit))],
    ['Interest', ...allYears.map((a) => Math.round(a.pnl.interest))],
    ['Pre-Tax Profit', ...allYears.map((a) => Math.round(a.pnl.preTaxProfit))],
    ['Tax', ...allYears.map((a) => Math.round(a.pnl.tax))],
    ['Net Profit', ...allYears.map((a) => Math.round(a.pnl.netProfit))],
    ['Net Margin %', ...allYears.map((a) => Number(((a.pnl.netProfit / (a.pnl.revenue || 1)) * 100).toFixed(1)))],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pnlData), 'P&L');

  // === Balance Sheet Sheet ===
  const bsData: (string | number)[][] = [
    ['Balance Sheet', ...yearHeaders],
    ['Cash', ...allYears.map((a) => Math.round(a.balanceSheet.cash))],
    ['Accounts Receivable', ...allYears.map((a) => Math.round(a.balanceSheet.accountsReceivable))],
    ['Inventory', ...allYears.map((a) => Math.round(a.balanceSheet.inventory))],
    ['Other Current Assets', ...allYears.map((a) => Math.round(a.balanceSheet.otherCurrentAssets))],
    ['Total Current Assets', ...allYears.map((a) => Math.round(a.balanceSheet.totalCurrentAssets))],
    ['Fixed Assets', ...allYears.map((a) => Math.round(a.balanceSheet.fixedAssets))],
    ['Intangible Assets', ...allYears.map((a) => Math.round(a.balanceSheet.intangibleAssets))],
    ['Total Assets', ...allYears.map((a) => Math.round(a.balanceSheet.totalAssets))],
    [],
    ['Accounts Payable', ...allYears.map((a) => Math.round(a.balanceSheet.accountsPayable))],
    ['Short-Term Debt', ...allYears.map((a) => Math.round(a.balanceSheet.shortTermDebt))],
    ['Other Current Liab', ...allYears.map((a) => Math.round(a.balanceSheet.otherCurrentLiabilities))],
    ['Total Current Liab', ...allYears.map((a) => Math.round(a.balanceSheet.totalCurrentLiabilities))],
    ['Long-Term Debt', ...allYears.map((a) => Math.round(a.balanceSheet.longTermDebt))],
    ['Total Liabilities', ...allYears.map((a) => Math.round(a.balanceSheet.totalLiabilities))],
    [],
    ['Share Capital', ...allYears.map((a) => Math.round(a.balanceSheet.shareCapital))],
    ['Retained Earnings', ...allYears.map((a) => Math.round(a.balanceSheet.retainedEarnings))],
    ['Total Equity', ...allYears.map((a) => Math.round(a.balanceSheet.totalEquity))],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bsData), 'Balance Sheet');

  // === Cash Flow Sheet ===
  const cfData: (string | number)[][] = [
    ['Cash Flow Statement', ...yearHeaders],
    ['Net Income', ...allYears.map((a) => Math.round(a.cashFlow.netIncome))],
    ['Depreciation', ...allYears.map((a) => Math.round(a.cashFlow.depreciation))],
    ['Change in WC', ...allYears.map((a) => Math.round(a.cashFlow.changeInWC))],
    ['Cash from Operations', ...allYears.map((a) => Math.round(a.cashFlow.cashFromOperations))],
    [],
    ['CapEx', ...allYears.map((a) => Math.round(-a.cashFlow.capex))],
    ['Cash from Investing', ...allYears.map((a) => Math.round(a.cashFlow.cashFromInvesting))],
    [],
    ['Debt Issuance', ...allYears.map((a) => Math.round(a.cashFlow.debtIssuance))],
    ['Debt Repayment', ...allYears.map((a) => Math.round(-a.cashFlow.debtRepayment))],
    ['Dividends', ...allYears.map((a) => Math.round(-a.cashFlow.dividends))],
    ['Cash from Financing', ...allYears.map((a) => Math.round(a.cashFlow.cashFromFinancing))],
    [],
    ['Net Change in Cash', ...allYears.map((a) => Math.round(a.cashFlow.netChangeInCash))],
    ['Opening Cash', ...allYears.map((a) => Math.round(a.cashFlow.openingCash))],
    ['Closing Cash', ...allYears.map((a) => Math.round(a.cashFlow.closingCash))],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cfData), 'Cash Flow');

  // === Assumptions Sheet ===
  const a = model.assumptions;
  const yearLabels = Array.from({ length: a.yearsToProject }, (_, i) => `Year ${i + 1}`);
  const asmData: (string | number)[][] = [
    ['Forecast Assumptions', ...yearLabels],
    ['Revenue Growth %', ...a.revenueGrowthPct],
    ['Gross Margin %', ...(a.grossMarginPct ?? [])],
    ['R&D % of Revenue', ...(a.rndPctOfRevenue ?? [])],
    ['Marketing % of Revenue', ...(a.marketingPctOfRevenue ?? [])],
    ['Operating % of Revenue', ...(a.operatingPctOfRevenue ?? [])],
    ['Depreciation', ...a.depreciationPerYear],
    ['CapEx', ...a.capexPerYear],
    ['Debt Issuance', ...a.debtIssuancePerYear],
    ['Debt Repayment', ...a.debtRepaymentPerYear],
    ['Dividends', ...a.dividendsPerYear],
    [],
    ['Effective Interest Rate %', a.effectiveInterestRate],
    ['Effective Tax Rate %', a.effectiveTaxRate],
    ['DSO (days)', a.dso],
    ['DPO (days)', a.dpo],
    ['DIO (days)', a.dio],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(asmData), 'Assumptions');

  XLSX.writeFile(wb, `${companyName}_3statement_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
