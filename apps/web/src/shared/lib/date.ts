const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** `2026-09-24` → `24 сент. 2026 г.` Дата без времени разбирается как UTC, поэтому и форматируем в UTC. */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** Сегодняшняя дата в формате `YYYY-MM-DD` по локальному времени. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

/** Границы текущего месяца в формате `YYYY-MM-DD` и его название («сентябрь 2026 г.»). */
export function getCurrentMonthPeriod(now = new Date()): {
  from: string;
  to: string;
  label: string;
} {
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toIsoDate(first), to: toIsoDate(last), label: monthFormatter.format(now) };
}
