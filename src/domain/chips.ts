export type ChipAssets = {
  safeHands: number;
  wishes: number;
  hands: number;
};

export function convertHandsToAssets(value: number): ChipAssets {
  const normalizedHands = Number.isFinite(value) ? Math.trunc(value) : 0;
  const safeHands = Math.max(0, normalizedHands);

  return {
    safeHands,
    wishes: Math.floor(safeHands / 10),
    hands: safeHands % 10,
  };
}
