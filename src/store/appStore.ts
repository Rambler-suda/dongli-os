import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist, type PersistStorage } from "zustand/middleware";
import { APP_STATE_VERSION, createDefaultState } from "./defaultState";
import {
  mergePersistedState,
  migratePersistedState,
} from "./migrations";
import { safeLocalStorage, STORAGE_KEY } from "./storage";
import type {
  AppState,
  LoveItemInput,
  PersistedState,
  PersonId,
  TravelItemInput,
} from "./types";

function now(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${id}`;
}

function handsKey(personId: PersonId): "dongdongHands" | "liliHands" {
  return personId === "dongdong" ? "dongdongHands" : "liliHands";
}

function normalizeHandAmount(amount: number): number {
  return Number.isFinite(amount) ? Math.trunc(amount) : 0;
}

export function createAppStore(
  storage: PersistStorage<PersistedState> = safeLocalStorage,
) {
  return createStore<AppState>()(
    persist(
      (set) => ({
        ...createDefaultState(),

        setCurrentTab: (tab) =>
          set((state) => ({
            appStatus: { ...state.appStatus, currentTab: tab },
            updatedAt: now(),
          })),

        unlockApp: () =>
          set((state) => ({
            appStatus: { ...state.appStatus, hasUnlocked: true },
            updatedAt: now(),
          })),

        completeProfileSetup: () =>
          set((state) => ({
            appStatus: { ...state.appStatus, hasCompletedProfileSetup: true },
            updatedAt: now(),
          })),

        resetAppData: () => set(createDefaultState()),

        addTravelItem: (input: TravelItemInput) =>
          set((state) => {
            const timestamp = now();
            return {
              travelItems: [
                {
                  ...input,
                  id: createId("travel"),
                  status: "want",
                  createdAt: timestamp,
                  updatedAt: timestamp,
                },
                ...state.travelItems,
              ],
              updatedAt: timestamp,
            };
          }),

        updateTravelItem: (id, patch) =>
          set((state) => {
            const timestamp = now();
            return {
              travelItems: state.travelItems.map((item) =>
                item.id === id ? { ...item, ...patch, updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        deleteTravelItem: (id) =>
          set((state) => ({
            travelItems: state.travelItems.filter((item) => item.id !== id),
            updatedAt: now(),
          })),

        markTravelVisited: (id) =>
          set((state) => {
            const timestamp = now();
            return {
              travelItems: state.travelItems.map((item) =>
                item.id === id ? { ...item, status: "visited", updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        undoTravelVisited: (id) =>
          set((state) => {
            const timestamp = now();
            return {
              travelItems: state.travelItems.map((item) =>
                item.id === id ? { ...item, status: "want", updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        addLoveItem: (input: LoveItemInput) =>
          set((state) => {
            const timestamp = now();
            return {
              loveItems: [
                {
                  ...input,
                  id: createId("love"),
                  status: "todo",
                  createdAt: timestamp,
                  updatedAt: timestamp,
                },
                ...state.loveItems,
              ],
              updatedAt: timestamp,
            };
          }),

        updateLoveItem: (id, patch) =>
          set((state) => {
            const timestamp = now();
            return {
              loveItems: state.loveItems.map((item) =>
                item.id === id ? { ...item, ...patch, updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        deleteLoveItem: (id) =>
          set((state) => ({
            loveItems: state.loveItems.filter((item) => item.id !== id),
            updatedAt: now(),
          })),

        markLoveDone: (id) =>
          set((state) => {
            const timestamp = now();
            return {
              loveItems: state.loveItems.map((item) =>
                item.id === id ? { ...item, status: "done", updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        undoLoveDone: (id) =>
          set((state) => {
            const timestamp = now();
            return {
              loveItems: state.loveItems.map((item) =>
                item.id === id ? { ...item, status: "todo", updatedAt: timestamp } : item,
              ),
              updatedAt: timestamp,
            };
          }),

        addHands: (personId, amount) =>
          set((state) => {
            const key = handsKey(personId);
            return {
              chips: {
                ...state.chips,
                [key]: Math.max(0, state.chips[key] + normalizeHandAmount(amount)),
              },
              updatedAt: now(),
            };
          }),

        removeOneHand: (personId) =>
          set((state) => {
            const key = handsKey(personId);
            return {
              chips: {
                ...state.chips,
                [key]: Math.max(0, state.chips[key] - 1),
              },
              updatedAt: now(),
            };
          }),

        resetHands: (personId) =>
          set((state) => {
            const key = handsKey(personId);
            return {
              chips: {
                ...state.chips,
                [key]: 0,
              },
              updatedAt: now(),
            };
          }),
      }),
      {
        name: STORAGE_KEY,
        version: APP_STATE_VERSION,
        storage,
        partialize: (state): PersistedState => ({
          version: state.version,
          updatedAt: state.updatedAt,
          appStatus: state.appStatus,
          profiles: state.profiles,
          home: state.home,
          travelItems: state.travelItems,
          loveItems: state.loveItems,
          chips: state.chips,
        }),
        migrate: migratePersistedState,
        merge: mergePersistedState,
      },
    ),
  );
}

export const appStore = createAppStore();

export function useAppStore<T>(selector: (state: AppState) => T): T {
  return useStore(appStore, selector);
}
