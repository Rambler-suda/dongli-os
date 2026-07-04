// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appStore } from "../store/appStore";
import { OnboardingGate } from "./OnboardingGate";

beforeEach(() => {
  window.localStorage.clear();
  appStore.getState().resetAppData();
});

afterEach(() => {
  cleanup();
});

describe("OnboardingGate", () => {
  it("completes the passcode and role selection flow", async () => {
    const user = userEvent.setup();
    const view = render(<OnboardingGate />);
    const passcodeInput = screen.getByLabelText("我们的暗号");

    expect(screen.getByRole("heading", { name: "进入冻梨 OS" })).toBeTruthy();

    await user.type(passcodeInput, "1111");
    await user.click(screen.getByRole("button", { name: "进入小世界" }));
    expect(screen.getByRole("alert").textContent).toBe("暗号好像不对，再想想。");

    await user.clear(passcodeInput);
    await user.type(passcodeInput, "0607");
    await user.click(screen.getByRole("button", { name: "进入小世界" }));
    expect(screen.getByRole("heading", { name: "选择你的角色" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /婷婷账户/ }));

    expect(screen.getByText("我们已经在一起")).toBeTruthy();
    expect(appStore.getState().appStatus.selectedPersonId).toBe("lili");
    expect(appStore.getState().profiles.dongdong.displayName).toBe("琦琦");
    expect(appStore.getState().profiles.lili.displayName).toBe("婷婷");
    expect(appStore.getState().profiles.dongdong.role).toBe("partner");
    expect(appStore.getState().profiles.lili.role).toBe("me");

    view.unmount();
    render(<OnboardingGate />);
    expect(screen.getByText("我们已经在一起")).toBeTruthy();
  });

  it("returns to the passcode page after resetAppData", async () => {
    appStore.getState().unlockApp();
    appStore.getState().completeRoleSelection("dongdong");
    render(<OnboardingGate />);

    expect(screen.getByText("我们已经在一起")).toBeTruthy();

    appStore.getState().resetAppData();

    expect(await screen.findByRole("heading", { name: "进入冻梨 OS" })).toBeTruthy();
  });

  it("requires role selection again after logout and passcode login", async () => {
    const user = userEvent.setup();
    appStore.getState().unlockApp();
    appStore.getState().completeRoleSelection("dongdong");
    render(<OnboardingGate />);

    await user.click(screen.getByRole("button", { name: "\u9000\u51fa\u767b\u5f55" }));
    await user.click(screen.getByRole("button", { name: "\u9000\u51fa" }));

    const passcodeInput = await waitFor(() => {
      const element = document.getElementById("passcode");
      expect(element).toBeTruthy();
      return element as HTMLInputElement;
    });
    expect(appStore.getState().appStatus.hasUnlocked).toBe(false);
    expect(appStore.getState().appStatus.selectedPersonId).toBeNull();

    await user.type(passcodeInput, "0607");
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("heading", { name: "\u9009\u62e9\u4f60\u7684\u89d2\u8272" })).toBeTruthy();
    expect(appStore.getState().appStatus.hasUnlocked).toBe(true);
    expect(appStore.getState().appStatus.selectedPersonId).toBeNull();
  });
});
