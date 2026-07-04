import { describe, expect, it } from "vitest";
import { getBirthdayReminder, getNextBirthday } from "./birthday";
import { createLocalDate, formatDateKey } from "./date";
import { createDefaultState } from "../store/defaultState";

const profiles = createDefaultState().profiles;

describe("birthday domain", () => {
  it("rolls a birthday into the next year after it passes", () => {
    expect(formatDateKey(getNextBirthday(2, 3, createLocalDate(2026, 2, 4)))).toBe(
      "2027-02-03",
    );
  });

  it("selects the partner birthday and applies reminder ranges", () => {
    const preparing = getBirthdayReminder(profiles, createLocalDate(2026, 3, 1));
    const upcoming = getBirthdayReminder(profiles, createLocalDate(2026, 3, 14));
    const birthday = getBirthdayReminder(profiles, createLocalDate(2026, 3, 18));

    expect(preparing).toMatchObject({ personId: "lili", daysUntil: 17 });
    expect(preparing.message).toContain("小惊喜");
    expect(upcoming.title).toContain("生日快到啦");
    expect(birthday.title).toBe("今天是婷婷生日");
  });

  it("reminds the partner even when my birthday is closer", () => {
    const reminder = getBirthdayReminder(profiles, createLocalDate(2026, 1, 31));

    expect(reminder).toMatchObject({
      personId: "lili",
      displayName: "婷婷",
      daysUntil: 46,
    });
    expect(reminder.title).toBe("距离婷婷生日还有 46 天");
  });

  it("uses profile roles instead of fixed person ids", () => {
    const swappedProfiles = {
      dongdong: { ...profiles.dongdong, role: "partner" as const },
      lili: { ...profiles.lili, role: "me" as const },
    };

    const reminder = getBirthdayReminder(swappedProfiles, createLocalDate(2026, 1, 31));

    expect(reminder).toMatchObject({
      personId: "dongdong",
      displayName: "琦琦",
      daysUntil: 3,
    });
  });
});
