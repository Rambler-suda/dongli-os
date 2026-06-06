import { describe, expect, it } from "vitest";
import { convertHandsToAssets } from "./chips";

describe("convertHandsToAssets", () => {
  it.each([
    [0, { safeHands: 0, wishes: 0, hands: 0 }],
    [9, { safeHands: 9, wishes: 0, hands: 9 }],
    [10, { safeHands: 10, wishes: 1, hands: 0 }],
    [12, { safeHands: 12, wishes: 1, hands: 2 }],
    [20, { safeHands: 20, wishes: 2, hands: 0 }],
    [27, { safeHands: 27, wishes: 2, hands: 7 }],
  ])("converts %i hands into wishes and remaining hands", (value, result) => {
    expect(convertHandsToAssets(value)).toEqual(result);
  });

  it("normalizes negative, decimal and invalid values", () => {
    expect(convertHandsToAssets(-4)).toEqual({ safeHands: 0, wishes: 0, hands: 0 });
    expect(convertHandsToAssets(12.9)).toEqual({ safeHands: 12, wishes: 1, hands: 2 });
    expect(convertHandsToAssets(Number.NaN)).toEqual({
      safeHands: 0,
      wishes: 0,
      hands: 0,
    });
  });
});
