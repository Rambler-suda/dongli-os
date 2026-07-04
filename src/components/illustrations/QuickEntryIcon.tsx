import type { TabId } from "../../store/types";
import { IllustrationAsset } from "./IllustrationAsset";

type QuickEntryId = TabId | "memo";

type QuickEntryIconProps = {
  entry: QuickEntryId;
  assetSrc?: string;
};

const tones: Record<QuickEntryId, "green" | "blue" | "pink" | "purple" | "yellow"> = {
  home: "green",
  travel: "blue",
  love: "pink",
  chips: "purple",
  memo: "yellow",
};

const labels: Record<QuickEntryId, string> = {
  home: "今日状态插画",
  travel: "旅行插画",
  love: "Love List 插画",
  chips: "筹码插画",
  memo: "备忘录插画",
};

export function QuickEntryIcon({ entry, assetSrc }: QuickEntryIconProps) {
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt={labels[entry]}
      className="quick-entry-illustration"
      tone={tones[entry]}
    >
      <span data-entry={entry} />
    </IllustrationAsset>
  );
}
