// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appStore } from "../store/appStore";
import { STORAGE_KEY } from "../store/storage";
import { ChipsPage } from "./ChipsPage";

beforeEach(() => {
  window.localStorage.clear();
  appStore.getState().resetAppData();
});

afterEach(cleanup);

function getPersonCard(name: string) {
  const card = screen.getByRole("heading", { name }).closest("article");
  if (!card) throw new Error(`Could not find chip card for ${name}`);
  return card;
}

describe("ChipsPage", () => {
  it("supports chip actions, asset conversion and confirmed reset", async () => {
    const user = userEvent.setup();
    render(<ChipsPage />);

    expect(screen.queryByText("筹码说明")).toBeNull();
    const dongdongCard = getPersonCard("大冻梨");
    const actions = within(dongdongCard).getAllByRole("button");

    expect(within(dongdongCard).getByLabelText("大冻梨角色插画")).toBeTruthy();
    expect(within(dongdongCard).getByText("冷静记账员")).toBeTruthy();
    expect(within(dongdongCard).getByText("暂无小手资产")).toBeTruthy();
    expect(actions[2].hasAttribute("disabled")).toBe(true);
    expect(actions[3].hasAttribute("disabled")).toBe(true);

    await user.click(actions[0]);
    await user.click(actions[0]);
    await user.click(actions[1]);
    await user.click(actions[1]);

    expect(appStore.getState().chips.dongdongHands).toBe(12);
    expect(within(dongdongCard).getByLabelText("1 个小愿望，2 个小手")).toBeTruthy();

    await user.click(actions[2]);
    expect(appStore.getState().chips.dongdongHands).toBe(11);
    expect(screen.getByRole("status").textContent).toContain("已兑现 1 个小手。");

    await user.click(actions[3]);
    const firstDialog = screen.getByRole("alertdialog");
    expect(within(firstDialog).getByText("确定要把小手余额清零吗？")).toBeTruthy();
    await user.click(within(firstDialog).getByRole("button", { name: "取消" }));
    expect(appStore.getState().chips.dongdongHands).toBe(11);

    await user.click(actions[3]);
    await user.click(screen.getByRole("button", { name: "确认清零" }));
    expect(appStore.getState().chips.dongdongHands).toBe(0);
    expect(screen.getByRole("status").textContent).toContain("这次先放过你。");
  });

  it("keeps hands non-negative and writes changes to localStorage", async () => {
    const user = userEvent.setup();
    render(<ChipsPage />);

    const liliCard = getPersonCard("婷婷");
    const actions = within(liliCard).getAllByRole("button");

    expect(within(liliCard).getByLabelText("婷婷角色插画")).toBeTruthy();
    expect(within(liliCard).getByText("灵动小赢家")).toBeTruthy();
    expect(actions[2].hasAttribute("disabled")).toBe(true);
    await user.click(actions[2]);
    expect(appStore.getState().chips.liliHands).toBe(0);

    await user.click(actions[1]);
    expect(appStore.getState().chips.liliHands).toBe(5);

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(persisted.state.chips.liliHands).toBe(5);
  });
});
