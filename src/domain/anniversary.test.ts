import { describe, expect, it } from "vitest";
import { createLocalDate, formatDateKey } from "./date";
import {
  getAnniversaryText,
  getDaysUntilNextAnniversary,
  getNextAnniversary,
  getRelationshipDays,
} from "./anniversary";

describe("anniversary domain", () => {
  it("counts the relationship start date as day one", () => {
    expect(getRelationshipDays(createLocalDate(2025, 6, 7))).toBe(1);
    expect(getRelationshipDays(createLocalDate(2025, 6, 8))).toBe(2);
  });

  it("selects this year's or next year's anniversary", () => {
    expect(formatDateKey(getNextAnniversary(createLocalDate(2026, 6, 6)))).toBe(
      "2026-06-07",
    );
    expect(formatDateKey(getNextAnniversary(createLocalDate(2026, 6, 8)))).toBe(
      "2027-06-07",
    );
  });

  it("shows a special message on June 7", () => {
    const anniversary = createLocalDate(2026, 6, 7);

    expect(getDaysUntilNextAnniversary(anniversary)).toBe(0);
    expect(getAnniversaryText(anniversary)).toContain("1 周年");
  });
});
