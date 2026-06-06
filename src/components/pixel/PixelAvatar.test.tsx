// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PixelAvatar } from "./PixelAvatar";

afterEach(cleanup);

describe("PixelAvatar", () => {
  it("renders the taller dongdong character with dark red hair and outfit parts", () => {
    const { container } = render(
      <PixelAvatar character="dongdong" size="lg" label="大冻梨" />,
    );

    const avatar = screen.getByLabelText("大冻梨的像素形象");
    expect(avatar.getAttribute("data-character")).toBe("dongdong");
    expect(avatar.getAttribute("data-size")).toBe("lg");
    expect(container.querySelector(".pixel-person__hair")).not.toBeNull();
    expect(container.querySelector(".pixel-person__body")).not.toBeNull();
    expect(container.querySelector(".pixel-person__bottom")).not.toBeNull();
  });

  it("renders lili with glasses and a dance mood", () => {
    const { container } = render(
      <PixelAvatar character="lili" mood="dance" size="md" label="婷婷" />,
    );

    const avatar = screen.getByLabelText("婷婷的像素形象");
    expect(avatar.getAttribute("data-character")).toBe("lili");
    expect(avatar.getAttribute("data-mood")).toBe("dance");
    expect(container.querySelector(".pixel-person__glasses")).not.toBeNull();
  });
});
