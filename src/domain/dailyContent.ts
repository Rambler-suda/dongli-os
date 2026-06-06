import { dailyQuotes } from "../data/dailyQuotes";
import { dailyReminders, type DailyReminder } from "../data/dailyReminders";
import type { DailyCache } from "../store/types";
import { formatDateKey } from "./date";
import { getDailyCache, pickStableRandom } from "./dailyRandom";

export function getTodayQuote(
  today = new Date(),
  cache: DailyCache | null = null,
): DailyCache {
  return getDailyCache(dailyQuotes, "quote", today, cache);
}

export function getTodayReminder(
  today = new Date(),
  cache: DailyCache | null = null,
): { reminder: DailyReminder; cache: DailyCache } {
  const key = `${formatDateKey(today)}-reminder`;

  if (cache?.key === key && cache.label) {
    return {
      reminder: {
        theme: cache.label,
        icon: dailyReminders.find((item) => item.theme === cache.label)?.icon ?? "✦",
        text: cache.value,
      },
      cache,
    };
  }

  const reminder = pickStableRandom(dailyReminders, key);
  return {
    reminder,
    cache: {
      key,
      label: reminder.theme,
      value: reminder.text,
    },
  };
}
