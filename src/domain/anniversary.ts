import {
  createLocalDate,
  getDaysBetweenLocalDates,
  getStartOfLocalDay,
} from "./date";

export const RELATIONSHIP_START = {
  year: 2025,
  month: 6,
  day: 7,
} as const;

export function getRelationshipDays(today = new Date()): number {
  const start = createLocalDate(
    RELATIONSHIP_START.year,
    RELATIONSHIP_START.month,
    RELATIONSHIP_START.day,
  );

  return getDaysBetweenLocalDates(start, getStartOfLocalDay(today)) + 1;
}

export function getNextAnniversary(today = new Date()): Date {
  const todayStart = getStartOfLocalDay(today);
  const thisYear = createLocalDate(today.getFullYear(), 6, 7);

  return todayStart.getTime() <= thisYear.getTime()
    ? thisYear
    : createLocalDate(today.getFullYear() + 1, 6, 7);
}

export function getDaysUntilNextAnniversary(today = new Date()): number {
  return getDaysBetweenLocalDates(getStartOfLocalDay(today), getNextAnniversary(today));
}

export function getAnniversaryText(today = new Date()): string {
  const daysUntil = getDaysUntilNextAnniversary(today);
  const anniversaryYears = getNextAnniversary(today).getFullYear() - RELATIONSHIP_START.year;

  if (daysUntil === 0) {
    return anniversaryYears > 0
      ? `今天是我们的 ${anniversaryYears} 周年，这一天被认真收藏啦。`
      : "今天是我们故事开始的第一天。";
  }

  return `距离 ${anniversaryYears} 周年纪念日还有 ${daysUntil} 天`;
}
