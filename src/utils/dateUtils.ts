export function todayISO(): string {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  }

/**
 * Compares calendar dates without constructing UTC Date objects. This avoids
 * the one-day shift that can occur on devices outside the API's timezone.
 */
export function isDateInRange(value: string, start: string, end: string): boolean {
  const date = normalizeISODate(value);
  const from = normalizeISODate(start);
  const until = normalizeISODate(end);
  return date !== null && from !== null && until !== null && from <= date && date <= until;
}

export function hasValidDateRange(start: string, end: string): boolean {
  return normalizeISODate(start) !== null && normalizeISODate(end) !== null;
}

function normalizeISODate(value: string): string | null {
  const raw = String(value ?? '').trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T|\s|$)/);
  const dmyMatch = raw.match(/^(\d{1,2})[\\/]([0-9]{1,2})[\\/](\d{2}|\d{4})$/);
  const match = isoMatch
    ? [raw, isoMatch[1], isoMatch[2], isoMatch[3]]
    : dmyMatch
      ? [raw, dmyMatch[3].length === 2 ? `20${dmyMatch[3]}` : dmyMatch[3], dmyMatch[2], dmyMatch[1]]
      : null;
  if (!match) return null;
  const [, year, month, day] = match;
  const candidate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return parsed.getFullYear() === Number(year) && parsed.getMonth() === Number(month) - 1 && parsed.getDate() === Number(day)
    ? candidate
    : null;
}
  
  export function formatDateID(value: string): string {
    if (!value) return '-';
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return value;
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    return `${d} ${months[m - 1] ?? ''} ${y}`;
  }
  
  export function formatDateRange(start: string, end: string): string {
    if (!start || !end) return '-';
    const short = (v: string) => {
      const [y, m, d] = v.split('-').map(Number);
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      return `${d} ${months[(m ?? 1) - 1]} ${y}`;
    };
    return `${short(start)} – ${short(end)}`;
  }
