import { describe, expect, it } from "vitest";
import type { PersistStorage, StorageValue } from "zustand/middleware";
import { createAppStore } from "./appStore";
import type { PersistedState } from "./types";

function createMemoryStorage(): PersistStorage<PersistedState> {
  let savedValue: StorageValue<PersistedState> | null = null;

  return {
    getItem: () => (savedValue ? structuredClone(savedValue) : null),
    setItem: (_name, value) => {
      savedValue = structuredClone(value);
    },
    removeItem: () => {
      savedValue = null;
    },
  };
}

describe("appStore", () => {
  it("starts with the PRD default data", () => {
    const state = createAppStore(createMemoryStorage()).getState();

    expect(state.profiles.dongdong.displayName).toBe("琦琦");
    expect(state.profiles.lili.displayName).toBe("婷婷");
    expect(state.appStatus.selectedPersonId).toBeNull();
    expect(state.travelItems).toHaveLength(8);
    expect(state.loveItems).toHaveLength(11);
    expect(state.memoItems).toHaveLength(0);
    expect(state.travelItems[0].title).toBe("苏州乐园");
    expect(state.loveItems[10].title).toBe("终极目标（猜猜是什么呢）");
  });

  it("supports travel and Love list operations", () => {
    const store = createAppStore(createMemoryStorage());
    const travelId = store.getState().travelItems[0].id;
    const loveId = store.getState().loveItems[0].id;

    store.getState().markTravelVisited(travelId);
    store.getState().undoTravelVisited(travelId);
    store.getState().updateTravelItem(travelId, { title: "更新后的旅行" });
    store.getState().addTravelItem({
      title: "新的旅行",
      description: "新的描述",
      emoji: "🧳",
    });
    store.getState().deleteTravelItem(travelId);

    store.getState().markLoveDone(loveId);
    store.getState().undoLoveDone(loveId);
    store.getState().updateLoveItem(loveId, { title: "更新后的期待" });
    store.getState().addLoveItem({
      title: "新的期待",
      description: "新的描述",
      emoji: "✨",
    });
    store.getState().deleteLoveItem(loveId);

    expect(store.getState().travelItems[0]).toMatchObject({
      title: "新的旅行",
      status: "want",
    });
    expect(store.getState().travelItems.some((item) => item.id === travelId)).toBe(false);
    expect(store.getState().loveItems[0]).toMatchObject({
      title: "新的期待",
      status: "todo",
    });
    expect(store.getState().loveItems.some((item) => item.id === loveId)).toBe(false);
  });

  it("supports memo operations and persists them", () => {
    const storage = createMemoryStorage();
    const store = createAppStore(storage);

    store.getState().addMemoItem({
      text: "记得买牛奶",
      imageDataUrl: "data:image/png;base64,abc",
      imageName: "milk.png",
    });

    const memoId = store.getState().memoItems[0].id;
    store.getState().updateMemoItem(memoId, { text: "记得买牛奶和面包" });

    const refreshedState = createAppStore(storage).getState();
    expect(refreshedState.memoItems[0]).toMatchObject({
      id: memoId,
      text: "记得买牛奶和面包",
      imageDataUrl: "data:image/png;base64,abc",
      imageName: "milk.png",
    });

    store.getState().deleteMemoItem(memoId);
    expect(store.getState().memoItems).toHaveLength(0);
  });

  it("supports chip operations and prevents invalid or negative hands", () => {
    const store = createAppStore(createMemoryStorage());

    store.getState().addHands("dongdong", 5);
    store.getState().addHands("dongdong", Number.NaN);
    store.getState().removeOneHand("dongdong");
    expect(store.getState().chips.dongdongHands).toBe(4);

    store.getState().resetHands("dongdong");
    store.getState().addHands("dongdong", -10);
    store.getState().removeOneHand("lili");

    expect(store.getState().chips.dongdongHands).toBe(0);
    expect(store.getState().chips.liliHands).toBe(0);
  });

  it("rehydrates persisted data when a new store is created", () => {
    const storage = createMemoryStorage();
    const firstStore = createAppStore(storage);
    const travelId = firstStore.getState().travelItems[0].id;

    firstStore.getState().setCurrentTab("travel");
    firstStore.getState().unlockApp();
    firstStore.getState().addHands("lili", 5);
    firstStore.getState().markTravelVisited(travelId);

    const refreshedStore = createAppStore(storage);
    const refreshedState = refreshedStore.getState();

    expect(refreshedState.appStatus.currentTab).toBe("travel");
    expect(refreshedState.appStatus.hasUnlocked).toBe(true);
    expect(refreshedState.chips.liliHands).toBe(5);
    expect(refreshedState.travelItems[0].status).toBe("visited");
  });

  it("selects a role and completes onboarding on the home tab", () => {
    const storage = createMemoryStorage();
    const store = createAppStore(storage);

    store.getState().setCurrentTab("chips");
    store.getState().unlockApp();
    store.getState().completeRoleSelection("lili");

    const refreshedState = createAppStore(storage).getState();
    expect(refreshedState.appStatus).toMatchObject({
      hasUnlocked: true,
      hasCompletedProfileSetup: true,
      selectedPersonId: "lili",
      currentTab: "home",
    });
    expect(refreshedState.profiles.dongdong.role).toBe("partner");
    expect(refreshedState.profiles.lili.role).toBe("me");
    expect(refreshedState.profiles.dongdong.displayName).toBe("琦琦");
    expect(refreshedState.profiles.lili.displayName).toBe("婷婷");
  });

  it("persists home daily caches", () => {
    const storage = createMemoryStorage();
    const store = createAppStore(storage);

    store.getState().setHomeCache("dailyQuoteCache", {
      key: "2026-06-06-quote",
      value: "今天也要认真生活。",
    });

    expect(createAppStore(storage).getState().home.dailyQuoteCache).toEqual({
      key: "2026-06-06-quote",
      value: "今天也要认真生活。",
    });
  });

  it("restores all data to defaults", () => {
    const store = createAppStore(createMemoryStorage());

    store.getState().unlockApp();
    store.getState().addHands("dongdong", 5);
    store.getState().deleteTravelItem(store.getState().travelItems[0].id);
    store.getState().resetAppData();

    const state = store.getState();
    expect(state.appStatus.hasUnlocked).toBe(false);
    expect(state.appStatus.selectedPersonId).toBeNull();
    expect(state.chips.dongdongHands).toBe(0);
    expect(state.travelItems).toHaveLength(8);
    expect(state.memoItems).toHaveLength(0);
  });

  it("logs out and requires role selection without resetting app data", () => {
    const store = createAppStore(createMemoryStorage());

    store.getState().unlockApp();
    store.getState().completeRoleSelection("lili");
    store.getState().setCurrentTab("chips");
    store.getState().addHands("lili", 5);
    store.getState().logoutApp();

    const state = store.getState();
    expect(state.appStatus.hasUnlocked).toBe(false);
    expect(state.appStatus.hasCompletedProfileSetup).toBe(false);
    expect(state.appStatus.selectedPersonId).toBeNull();
    expect(state.appStatus.currentTab).toBe("home");
    expect(state.chips.liliHands).toBe(5);
  });
});
