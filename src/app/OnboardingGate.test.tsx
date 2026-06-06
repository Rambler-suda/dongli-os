// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
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
  it("completes the passcode and profile setup flow", async () => {
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
    expect(screen.getByRole("heading", { name: "设置我们的形象" })).toBeTruthy();

    const dongdongInput = screen.getByLabelText("冻冻昵称");
    const liliInput = screen.getByLabelText("梨梨昵称");
    await user.clear(dongdongInput);
    await user.type(dongdongInput, "冻冻");
    await user.clear(liliInput);
    await user.type(liliInput, "梨梨");
    await user.click(screen.getByRole("button", { name: "完成，进入首页" }));

    expect(screen.getByText("我们已经在一起")).toBeTruthy();
    expect(appStore.getState().profiles.dongdong.displayName).toBe("冻冻");
    expect(appStore.getState().profiles.lili.displayName).toBe("梨梨");

    view.unmount();
    render(<OnboardingGate />);
    expect(screen.getByText("我们已经在一起")).toBeTruthy();
  });

  it("returns to the passcode page after resetAppData", async () => {
    appStore.getState().unlockApp();
    appStore.getState().completeProfileSetup();
    render(<OnboardingGate />);

    expect(screen.getByText("我们已经在一起")).toBeTruthy();

    appStore.getState().resetAppData();

    expect(await screen.findByRole("heading", { name: "进入冻梨 OS" })).toBeTruthy();
  });
});
