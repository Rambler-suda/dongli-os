import { APP_STATE_VERSION, createDefaultState } from "./defaultState";
import type {
  AppDataState,
  AppState,
  PersistedState,
  PersonId,
  TabId,
} from "./types";

const validTabs: TabId[] = ["home", "travel", "love", "chips"];
const validPersonIds: PersonId[] = ["dongdong", "lili"];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function asPersonId(value: unknown): PersonId | null {
  return validPersonIds.includes(value as PersonId) ? (value as PersonId) : null;
}

function inferSelectedPersonId(
  profiles: Record<string, unknown>,
  hasCompletedProfileSetup: boolean,
): PersonId | null {
  if (!hasCompletedProfileSetup) {
    return null;
  }

  const dongdong = isObject(profiles.dongdong) ? profiles.dongdong : {};
  const lili = isObject(profiles.lili) ? profiles.lili : {};

  if (dongdong.role === "me") {
    return "dongdong";
  }

  if (lili.role === "me") {
    return "lili";
  }

  return null;
}

export function normalizePersistedState(value: unknown): PersistedState {
  const defaults = createDefaultState();

  if (!isObject(value)) {
    return defaults;
  }

  const appStatus = isObject(value.appStatus) ? value.appStatus : {};
  const profiles = isObject(value.profiles) ? value.profiles : {};
  const home = isObject(value.home) ? value.home : {};
  const chips = isObject(value.chips) ? value.chips : {};
  const currentTab = validTabs.includes(appStatus.currentTab as TabId)
    ? (appStatus.currentTab as TabId)
    : defaults.appStatus.currentTab;
  const hasCompletedProfileSetup =
    typeof appStatus.hasCompletedProfileSetup === "boolean"
      ? appStatus.hasCompletedProfileSetup
      : defaults.appStatus.hasCompletedProfileSetup;
  const selectedPersonId =
    asPersonId(appStatus.selectedPersonId) ??
    inferSelectedPersonId(profiles, hasCompletedProfileSetup) ??
    defaults.appStatus.selectedPersonId;

  return {
    version: APP_STATE_VERSION,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : defaults.updatedAt,
    appStatus: {
      ...defaults.appStatus,
      ...appStatus,
      hasUnlocked:
        typeof appStatus.hasUnlocked === "boolean"
          ? appStatus.hasUnlocked
          : defaults.appStatus.hasUnlocked,
      hasCompletedProfileSetup,
      selectedPersonId,
      currentTab,
    },
    profiles: {
      dongdong: {
        ...defaults.profiles.dongdong,
        ...(isObject(profiles.dongdong) ? profiles.dongdong : {}),
        id: "dongdong",
        role: selectedPersonId === "lili" ? "partner" : "me",
      },
      lili: {
        ...defaults.profiles.lili,
        ...(isObject(profiles.lili) ? profiles.lili : {}),
        id: "lili",
        role: selectedPersonId === "lili" ? "me" : "partner",
      },
    },
    home: {
      ...defaults.home,
      ...home,
    },
    travelItems: Array.isArray(value.travelItems)
      ? (value.travelItems as AppDataState["travelItems"])
      : defaults.travelItems,
    loveItems: Array.isArray(value.loveItems)
      ? (value.loveItems as AppDataState["loveItems"])
      : defaults.loveItems,
    memoItems: Array.isArray(value.memoItems)
      ? (value.memoItems as AppDataState["memoItems"])
      : defaults.memoItems,
    chips: {
      dongdongHands: asNonNegativeNumber(
        chips.dongdongHands,
        defaults.chips.dongdongHands,
      ),
      liliHands: asNonNegativeNumber(chips.liliHands, defaults.chips.liliHands),
    },
  };
}

export function migratePersistedState(
  persistedState: unknown,
  _storedVersion: number,
): PersistedState {
  return normalizePersistedState(persistedState);
}

export function mergePersistedState(
  persistedState: unknown,
  currentState: AppState,
): AppState {
  return {
    ...currentState,
    ...normalizePersistedState(persistedState),
  };
}
