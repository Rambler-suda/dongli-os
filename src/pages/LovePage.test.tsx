// @vitest-environment happy-dom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appStore } from "../store/appStore";
import { LovePage } from "./LovePage";

beforeEach(() => {
  window.localStorage.clear();
  appStore.getState().resetAppData();
});

afterEach(cleanup);

describe("LovePage", () => {
  it("supports add, edit, complete, undo and confirmed delete", async () => {
    const user = userEvent.setup();
    render(<LovePage />);

    expect(screen.getByText("做情侣对戒")).toBeTruthy();
    expect(screen.getByText("已完成 0 / 总共 11")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "添加事项" }));
    await user.type(screen.getByLabelText("事项名称"), "一起做晚饭");
    await user.type(screen.getByLabelText("一句描述"), "认真吃一顿自己做的饭");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(appStore.getState().loveItems[0]).toMatchObject({
      title: "一起做晚饭",
      emoji: "✨",
      status: "todo",
    });

    const addedCard = screen.getByRole("heading", { name: "一起做晚饭" }).closest("article");
    await user.click(within(addedCard!).getByRole("button", { name: "编辑" }));
    await user.clear(screen.getByLabelText("事项名称"));
    await user.type(screen.getByLabelText("事项名称"), "一起认真做晚饭");
    await user.click(screen.getByRole("button", { name: "保存" }));

    const updatedCard = screen
      .getByRole("heading", { name: "一起认真做晚饭" })
      .closest("article");
    await user.click(within(updatedCard!).getByRole("button", { name: "完成" }));
    expect(appStore.getState().loveItems[0].status).toBe("done");
    expect(screen.getByText("已完成 1 / 总共 12")).toBeTruthy();

    await user.click(within(updatedCard!).getByRole("button", { name: "取消完成" }));
    expect(appStore.getState().loveItems[0].status).toBe("todo");

    await user.click(within(updatedCard!).getByRole("button", { name: "删除" }));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("确定要删除这件想一起完成的小事吗？")).toBeTruthy();
    await user.click(within(dialog).getByRole("button", { name: "取消" }));
    expect(appStore.getState().loveItems).toHaveLength(12);

    await user.click(within(updatedCard!).getByRole("button", { name: "删除" }));
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "删除" }));
    expect(appStore.getState().loveItems).toHaveLength(11);
  });

  it("shows a gentle empty state", () => {
    appStore.setState({ loveItems: [] });
    render(<LovePage />);

    expect(screen.getByText("还没有想一起做的小事")).toBeTruthy();
    expect(screen.getByText("要不要先加一个？")).toBeTruthy();
  });
});
