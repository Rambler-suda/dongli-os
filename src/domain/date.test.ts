import { describe, expect, it } from "vitest";
import {
  createLocalDate,
  formatDateKey,
  getDaysBetweenLocalDates,
  getStartOfLocalDay,
} from "./date";

describe("local date helpers", () => {
  it("constructs and formats dates using local calendar fields", () => {
    const date = createLocalDate(2025, 6, 7);
    date.setHours(23, 45, 30);

    expect(formatDateKey(date)).toBe("2025-06-07");
    expect(getStartOfLocalDay(date).getHours()).toBe(0);
  });

  it("calculates calendar day differences without time-of-day offsets", () => {
    const from = createLocalDate(2025, 12, 31);
    from.setHours(23, 59);
    const to = createLocalDate(2026, 1, 1);
    to.setHours(0, 1);

    expect(getDaysBetweenLocalDates(from, to)).toBe(1);
  });
});
