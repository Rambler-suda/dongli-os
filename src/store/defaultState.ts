import { createDefaultLoveItems } from "../data/defaultLoveItems";
import { createDefaultTravelItems } from "../data/defaultTravelItems";
import type { AppDataState } from "./types";

export const APP_STATE_VERSION = 1;
const DEFAULT_UPDATED_AT = "2025-06-07T00:00:00.000Z";

export function createDefaultState(): AppDataState {
  return {
    version: APP_STATE_VERSION,
    updatedAt: DEFAULT_UPDATED_AT,
    appStatus: {
      hasUnlocked: false,
      hasCompletedProfileSetup: false,
      currentTab: "home",
    },
    profiles: {
      dongdong: {
        id: "dongdong",
        role: "me",
        displayName: "大冻梨",
        birthday: "2002-02-03",
        pixelAvatarKey: "dongdong-default",
      },
      lili: {
        id: "lili",
        role: "partner",
        displayName: "婷婷",
        birthday: "2002-03-18",
        pixelAvatarKey: "lili-default",
      },
    },
    home: {
      dailyGreetingCache: null,
      dailyQuoteCache: null,
      dailyReminderCache: null,
    },
    travelItems: createDefaultTravelItems(),
    loveItems: createDefaultLoveItems(),
    chips: {
      dongdongHands: 0,
      liliHands: 0,
    },
  };
}

export const defaultState = createDefaultState();
