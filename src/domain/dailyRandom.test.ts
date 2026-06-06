import { describe, expect, it } from "vitest";
import { getDailyCache, hashString, pickStableRandom } from "./dailyRandom";
import { createLocalDate } from "./date";

describe("stable daily random", () => {
  it("returns a repeatable hash and selection for the same seed", () => {
    const items = ["a", "b", "c"] as const;

    expect(hashString("same-seed")).toBe(hashString("same-seed"));
    expect(pickStableRandom(items, "same-seed")).toBe(
      pickStableRandom(items, "same-seed"),
    );
  });

  it("reuses a same-day cache and changes its key the next day", () => {
    const items = ["one", "two"] as const;
    const first = getDailyCache(items, "quote", createLocalDate(2026, 6, 6));
    const refreshed = getDailyCache(items, "quote", createLocalDate(2026, 6, 6), first);
    const nextDay = getDailyCache(items, "quote", createLocalDate(2026, 6, 7), first);

    expect(refreshed).toBe(first);
    expect(nextDay.key).not.toBe(first.key);
  });
});
