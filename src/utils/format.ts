export const fmtNum = (n: number, digits: number = 2) => new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(n);

export const fmt = (n: number) => new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(n);

export const safe = (n: number, d: number) => (d && d > 0) ? n / d : 0;
