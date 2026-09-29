/** Arithmetic for the standard 18% VAT rate; this does not determine a transaction's tax status. */
export function calculateVatBasic(amount: number, mode: 'add' | 'extract') {
  const value = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const net = mode === 'add' ? value : value / 1.18;
  const gross = mode === 'add' ? value * 1.18 : value;
  return { net, vat: gross - net, gross };
}
