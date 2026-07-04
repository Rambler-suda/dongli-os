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
  it("shows core status cards and persists the daily greeting cache", async () => {
    render(<HomePage />);

    expect(screen.getByText("我们已经在一起")).toBeTruthy();
    expect(
      screen.getByLabelText("冻冻和梨梨双人像素场景").getAttribute("data-asset-status"),
    ).toBe("ready");
    expect(screen.getByText("生日提醒")).toBeTruthy();
    expect(screen.queryByText("今日提醒")).toBeNull();
    expect(screen.queryByText("今日一句")).toBeNull();

    await waitFor(() => {
      expect(appStore.getState().home.dailyGreetingCache).not.toBeNull();
    });
  });

  it("shows memo first in quick actions and switches tabs from the remaining entries", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.queryByRole("button", { name: /今日状态/ })).toBeNull();
    expect(document.querySelector(".quick-action strong")?.textContent).toBe("备忘录");

    await user.click(screen.getByRole("button", { name: /旅游 LIST/ }));
    expect(appStore.getState().appStatus.currentTab).toBe("travel");
  });

  it("asks for confirmation before logging out", async () => {
    const user = userEvent.setup();
    appStore.getState().unlockApp();
    appStore.getState().completeRoleSelection("dongdong");
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "\u9000\u51fa\u767b\u5f55" }));

    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(appStore.getState().appStatus.hasUnlocked).toBe(true);

    await user.click(screen.getByRole("button", { name: "\u9000\u51fa" }));

    expect(appStore.getState().appStatus.hasUnlocked).toBe(false);
    expect(appStore.getState().appStatus.hasCompletedProfileSetup).toBe(false);
    expect(appStore.getState().appStatus.selectedPersonId).toBeNull();
  });

  it("opens memo from the home entry and saves a text memo", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: /备忘录/ }));
    expect(screen.getByRole("heading", { name: "备忘录" })).toBeTruthy();
    expect(appStore.getState().appStatus.currentTab).toBe("home");

    await user.click(screen.getAllByRole("button", { name: /添加备忘/ })[0]);
    await user.type(screen.getByLabelText("备忘录文字"), "记得买牛奶");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(screen.getByText("记得买牛奶")).toBeTruthy();
    expect(appStore.getState().memoItems[0]).toMatchObject({
      text: "记得买牛奶",
    });
  });
});
