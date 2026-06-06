// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appStore } from "../store/appStore";
import { HomePage } from "./HomePage";

beforeEach(() => {
  window.localStorage.clear();
  appStore.getState().resetAppData();
});

afterEach(cleanup);

describe("HomePage", () => {
  it("shows core status cards and persists daily content caches", async () => {
    render(<HomePage />);

    expect(screen.getByText("我们已经在一起")).toBeTruthy();
    expect(screen.getByText("生日提醒")).toBeTruthy();
    expect(screen.getByText("今日一句")).toBeTruthy();

    await waitFor(() => {
      expect(appStore.getState().home.dailyGreetingCache).not.toBeNull();
      expect(appStore.getState().home.dailyQuoteCache).not.toBeNull();
      expect(appStore.getState().home.dailyReminderCache).not.toBeNull();
    });
  });

  it("uses quick actions only to switch the current tab", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: /去旅游 LIST 添加一个地方/ }));
    expect(appStore.getState().appStatus.currentTab).toBe("travel");
  });
});
