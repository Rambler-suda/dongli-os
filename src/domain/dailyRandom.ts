import type { DailyCache } from "../store/types";
import { formatDateKey } from "./date";

export function hashString(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function pickStableRandom<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) {
    throw new Error("Cannot pick a stable random item from an empty list.");
  }

  return items[hashString(seed) % items.length];
}

export function getDailyCache(
  items: readonly string[],
  namespace: string,
  today = new Date(),
  cache: DailyCache | null = null,
): DailyCache {
  const key = `${formatDateKey(today)}-${namespace}`;

  return cache?.key === key
    ? cache
    : {
        key,
        value: pickStableRandom(items, key),
      };
}
