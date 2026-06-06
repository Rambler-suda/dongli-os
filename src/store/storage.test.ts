import { describe, expect, it } from "vitest";
import { createSafeJSONStorage, STORAGE_KEY } from "./storage";

function createStringStorage(initialValue?: string) {
  const values = new Map<string, string>();
  if (initialValue) {
    values.set(STORAGE_KEY, initialValue);
  }

  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

describe("safe local storage", () => {
  it("ignores and removes damaged JSON", () => {
    const rawStorage = createStringStorage("{damaged-json");
    const storage = createSafeJSONStorage(() => rawStorage);

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(rawStorage.values.has(STORAGE_KEY)).toBe(false);
  });

  it("does not throw when storage access is unavailable", () => {
    const storage = createSafeJSONStorage(() => {
      throw new Error("storage unavailable");
    });

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(() =>
      storage.setItem(STORAGE_KEY, {
        version: 1,
        state: {} as never,
      }),
    ).not.toThrow();
  });
});
