// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appStore } from "../store/appStore";
import { TravelPage } from "./TravelPage";

beforeEach(() => {
  window.localStorage.clear();
  appStore.getState().resetAppData();
});

afterEach(cleanup);

describe("TravelPage", () => {
  it("supports add, edit, toggle, undo and confirmed delete", async () => {
    const user = userEvent.setup();
    render(<TravelPage />);

    expect(screen.getByText("苏州乐园")).toBeTruthy();
    expect(screen.getByText("已点亮 0 / 总共 8")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "添加地点" }));
    await user.clear(screen.getByLabelText("Emoji"));
    await user.type(screen.getByLabelText("地点名称"), "海边小城");
    await user.type(screen.getByLabelText("一句描述"), "一起去吹海风");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(appStore.getState().travelItems[0]).toMatchObject({
      title: "海边小城",
      emoji: "📍",
      status: "want",
    });

    const addedCard = screen.getByRole("heading", { name: "海边小城" }).closest("article");
    expect(addedCard).not.toBeNull();

    await user.click(within(addedCard!).getByRole("button", { name: "编辑" }));
    await user.clear(screen.getByLabelText("地点名称"));
    await user.type(screen.getByLabelText("地点名称"), "海边小城更新");
    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(screen.getByText("海边小城更新")).toBeTruthy();

    const updatedCard = screen
      .getByRole("heading", { name: "海边小城更新" })
      .closest("article");
    await user.click(within(updatedCard!).getByRole("button", { name: "点亮" }));
    expect(appStore.getState().travelItems[0].status).toBe("visited");
    expect(screen.getByText("已点亮 1 / 总共 9")).toBeTruthy();
    expect(within(updatedCard!).getByLabelText("已点亮")).toBeTruthy();

    await user.click(within(updatedCard!).getByRole("button", { name: "取消点亮" }));
    expect(appStore.getState().travelItems[0].status).toBe("want");

    await user.click(within(updatedCard!).getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("确定要删除这个想去的地方吗？")).toBeTruthy();
    expect(appStore.getState().travelItems).toHaveLength(9);

    await user.click(within(dialog).getByRole("button", { name: "删除" }));
    expect(appStore.getState().travelItems).toHaveLength(8);
    expect(screen.queryByText("海边小城更新")).toBeNull();
  });

  it("shows a gentle empty state", () => {
    appStore.setState({ travelItems: [] });
    render(<TravelPage />);

    expect(screen.getByText("这里还空着")).toBeTruthy();
    expect(screen.getByText("等你们一起去填满。")).toBeTruthy();
    expect(screen.getByLabelText("像素旅行图标")).toBeTruthy();
  });
});
