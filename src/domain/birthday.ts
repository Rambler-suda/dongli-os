import type { CoupleProfile, PersonId } from "../store/types";
import { createLocalDate, getDaysBetweenLocalDates, getStartOfLocalDay } from "./date";

type Profiles = Record<PersonId, CoupleProfile>;

export type BirthdayReminder = {
  personId: PersonId;
  displayName: string;
  daysUntil: number;
  nextBirthday: Date;
  title: string;
  message: string;
  birthdays: Array<{
    personId: PersonId;
    displayName: string;
    monthDay: string;
    daysUntil: number;
  }>;
};

export function getNextBirthday(month: number, day: number, today = new Date()): Date {
  const todayStart = getStartOfLocalDay(today);
  const thisYearBirthday = createLocalDate(today.getFullYear(), month, day);

  return todayStart.getTime() <= thisYearBirthday.getTime()
    ? thisYearBirthday
    : createLocalDate(today.getFullYear() + 1, month, day);
}

function getBirthdayParts(birthday: string): { month: number; day: number } {
  const [, month, day] = birthday.split("-").map(Number);
  return { month, day };
}

function getBirthdayCopy(
  personId: PersonId,
  displayName: string,
  daysUntil: number,
): Pick<BirthdayReminder, "title" | "message"> {
  if (daysUntil === 0) {
    return {
      title: `今天是${displayName}生日`,
      message:
        personId === "lili"
          ? "今天要被认真偏爱一下。"
          : "今天可以理直气壮地快乐一下。",
    };
  }

  if (daysUntil <= 7) {
    return {
      title: `${displayName}生日快到啦`,
      message:
        personId === "lili"
          ? `还有 ${daysUntil} 天，别装作不知道。`
          : `还有 ${daysUntil} 天，可以开始期待了。`,
    };
  }

  if (daysUntil <= 30) {
    return {
      title: `距离${displayName}生日还有 ${daysUntil} 天`,
      message:
        personId === "lili"
          ? "要不要提前准备一点小惊喜？"
          : "这次可别忘记啦。",
    };
  }

  return {
    title: `距离${displayName}生日还有 ${daysUntil} 天`,
    message: personId === "lili" ? "先偷偷记上一笔小惊喜。" : "慢慢期待就好。",
  };
}

export function getBirthdayReminder(
  profiles: Profiles,
  today = new Date(),
): BirthdayReminder {
  const birthdays = (["dongdong", "lili"] as const).map((personId) => {
    const profile = profiles[personId];
    const { month, day } = getBirthdayParts(profile.birthday);
    const nextBirthday = getNextBirthday(month, day, today);

    return {
      personId,
      displayName: profile.displayName,
      monthDay: `${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`,
      daysUntil: getDaysBetweenLocalDates(getStartOfLocalDay(today), nextBirthday),
      nextBirthday,
    };
  });

  const partner =
    birthdays.find(
      ({ personId }) => profiles[personId].role === "partner",
    ) ?? birthdays[1];
  const copy = getBirthdayCopy(partner.personId, partner.displayName, partner.daysUntil);

  return {
    personId: partner.personId,
    displayName: partner.displayName,
    daysUntil: partner.daysUntil,
    nextBirthday: partner.nextBirthday,
    title: copy.title,
    message: copy.message,
    birthdays: [
      {
        personId: partner.personId,
        displayName: partner.displayName,
        monthDay: partner.monthDay,
        daysUntil: partner.daysUntil,
      },
    ],
  };
}
