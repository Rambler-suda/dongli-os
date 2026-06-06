import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { PersistedState } from "./types";

export const STORAGE_KEY = "dongli-os:v1";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export function createSafeJSONStorage(
  getStorage: () => StorageLike | undefined,
): PersistStorage<PersistedState> {
  return {
    getItem: (name) => {
      try {
        const raw = getStorage()?.getItem(name);
        if (!raw) {
          return null;
        }

        return JSON.parse(raw) as StorageValue<PersistedState>;
      } catch {
        try {
          getStorage()?.removeItem(name);
        } catch {
          // Storage can be unavailable in private browsing or restricted contexts.
        }
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        getStorage()?.setItem(name, JSON.stringify(value));
      } catch {
        // Persistence failure must not prevent the in-memory app from working.
      }
    },
    removeItem: (name) => {
      try {
        getStorage()?.removeItem(name);
      } catch {
        // Ignore unavailable storage and keep the current in-memory state.
      }
    },
  };
}

export const safeLocalStorage = createSafeJSONStorage(() =>
  typeof window === "undefined" ? undefined : window.localStorage,
);
