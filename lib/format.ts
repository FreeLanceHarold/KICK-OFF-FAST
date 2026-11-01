export const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const numberFmt = new Intl.NumberFormat('es-CO');

export function formatCOP(value: number): string {
  return COP.format(value);
}

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  const now = new Date('2026-11-01').getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const day = 86400000;
  if (diff < day) return 'hoy';
  if (diff < 2 * day) return 'ayer';
  if (diff < 7 * day) return `hace ${Math.floor(diff / day)} días`;
  if (diff < 30 * day) return `hace ${Math.floor(diff / (7 * day))} sem`;
  return `hace ${Math.floor(diff / (30 * day))} meses`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
