import type { TabId } from "../../store/types";
import { IllustrationAsset } from "./IllustrationAsset";

type QuickEntryIconProps = {
  entry: TabId;
  assetSrc?: string;
};

const tones: Record<TabId, "green" | "blue" | "pink" | "purple"> = {
  home: "green",
  travel: "blue",
  love: "pink",
  chips: "purple",
};

const labels: Record<TabId, string> = {
  home: "今日状态插画",
  travel: "旅行插画",
  love: "Love List 插画",
  chips: "筹码插画",
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
