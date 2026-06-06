import { greetings, type GreetingConfig } from "../data/greetings";
import type { DailyCache } from "../store/types";
import { formatDateKey } from "./date";
import { pickStableRandom } from "./dailyRandom";

export type TodayGreeting = {
  slot: GreetingConfig["slot"];
  icon: string;
  mainText: string;
  subText: string;
  cache: DailyCache;
};

export function getCurrentGreetingSlot(today = new Date()): GreetingConfig {
  const hour = today.getHours();
  const slot = greetings.find(
    (greeting) => hour >= greeting.startHour && hour < greeting.endHour,
  );

  if (!slot) {
    throw new Error(`Missing greeting configuration for hour ${hour}.`);
  }

  return slot;
}

export function refreshGreetingIfNeeded(
  today = new Date(),
  cache: DailyCache | null = null,
): DailyCache {
  const slot = getCurrentGreetingSlot(today);
  const key = `${formatDateKey(today)}-${slot.slot}`;

  return cache?.key === key
    ? cache
    : {
        key,
        value: pickStableRandom(slot.subTexts, key),
      };
}

export function getTodayGreeting(
  today = new Date(),
  cache: DailyCache | null = null,
): TodayGreeting {
  const slot = getCurrentGreetingSlot(today);
  const nextCache = refreshGreetingIfNeeded(today, cache);

  return {
    slot: slot.slot,
    icon: slot.icon,
    mainText: slot.mainText,
    subText: nextCache.value,
    cache: nextCache,
  };
}
