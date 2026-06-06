// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ChipAssetDisplay } from "./ChipAssetDisplay";

afterEach(cleanup);

describe("ChipAssetDisplay", () => {
  it("renders each asset icon up to 50 hands", () => {
    const { container } = render(<ChipAssetDisplay totalHands={27} />);

    expect(screen.getByLabelText("2 个小愿望，7 个小手")).toBeTruthy();
    expect(container.querySelectorAll("[data-type='wish']")).toHaveLength(2);
    expect(container.querySelectorAll("[data-type='hand']")).toHaveLength(7);
  });

  it("uses a compact count display above 50 hands", () => {
    const { container } = render(<ChipAssetDisplay totalHands={57} />);

    expect(screen.getByLabelText("5 个小愿望，7 个小手")).toBeTruthy();
    expect(screen.getByText("5 个")).toBeTruthy();
    expect(screen.getByText("7 个")).toBeTruthy();
    expect(container.querySelectorAll(".chip-asset-icon")).toHaveLength(2);
  });
});
