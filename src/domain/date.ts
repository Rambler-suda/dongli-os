const MILLISECONDS_PER_DAY = 86_400_000;

export function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

export function getStartOfLocalDay(date: Date): Date {
  return createLocalDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function getLocalDateOrdinal(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysBetweenLocalDates(from: Date, to: Date): number {
  return Math.round((getLocalDateOrdinal(to) - getLocalDateOrdinal(from)) / MILLISECONDS_PER_DAY);
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
