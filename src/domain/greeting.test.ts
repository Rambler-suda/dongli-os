import { describe, expect, it } from "vitest";
import { createLocalDate } from "./date";
import { getCurrentGreetingSlot, getTodayGreeting } from "./greeting";

function atHour(hour: number): Date {
  const date = createLocalDate(2026, 6, 6);
  date.setHours(hour, 30);
  return date;
}

describe("greeting domain", () => {
  it("maps every configured boundary to the expected time slot", () => {
    expect(getCurrentGreetingSlot(atHour(0)).slot).toBe("midnight");
    expect(getCurrentGreetingSlot(atHour(3)).slot).toBe("deepNight");
    expect(getCurrentGreetingSlot(atHour(6)).slot).toBe("earlyMorning");
    expect(getCurrentGreetingSlot(atHour(7)).slot).toBe("morning");
    expect(getCurrentGreetingSlot(atHour(9)).slot).toBe("lateMorning");
    expect(getCurrentGreetingSlot(atHour(12)).slot).toBe("noon");
    expect(getCurrentGreetingSlot(atHour(15)).slot).toBe("afternoon");
    expect(getCurrentGreetingSlot(atHour(18)).slot).toBe("evening");
    expect(getCurrentGreetingSlot(atHour(21)).slot).toBe("night");
  });

  it("keeps a greeting stable for the same date and time slot", () => {
    const morning = atHour(8);
    const first = getTodayGreeting(morning);
    const refreshed = getTodayGreeting(morning, first.cache);
    const nextSlot = getTodayGreeting(atHour(10), first.cache);

    expect(refreshed.subText).toBe(first.subText);
    expect(refreshed.cache).toBe(first.cache);
    expect(nextSlot.cache.key).not.toBe(first.cache.key);
  });
});
