/**
 * format.js — formatters + badge colour logic
 * ===========================================
 * Ported from the original ui.js helpers (fmtDate, fmtCurrency, fmtNum,
 * badgeClassFor). Kept framework-agnostic so config files can import them.
 */

export const fmtDate = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtCurrency = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  const v = Number(n);
  if (Number.isNaN(v)) return n;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);
};

export const fmtNum = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  return new Intl.NumberFormat('en-IN').format(Number(n));
};

/** Choose a badge colour class for a status string (port of badgeClassFor). */
export function badgeClassFor(status) {
  if (!status) return 'badge-neutral';
  const s = String(status).toLowerCase();
  if (['active', 'present', 'completed', 'in progress'].includes(s)) return 'badge-success';
  if (['planned', 'scheduled'].includes(s)) return 'badge-info';
  if (['on hold', 'on leave', 'half-day', 'late', 'pending'].includes(s)) return 'badge-warning';
  if (['inactive', 'absent', 'dropped', 'cancelled'].includes(s)) return 'badge-danger';
  if (['excused'].includes(s)) return 'badge-purple';
  return 'badge-neutral';
}
