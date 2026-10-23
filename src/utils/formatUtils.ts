export function formatGpa(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toFixed(2).replace('.', ',');
  }
  export function formatPercent(value: number): string {
    return `${value.toFixed(1).replace('.', ',')}%`;
  }
  export function initials(name: string): string {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
  }