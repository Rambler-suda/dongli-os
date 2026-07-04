import dongdongPortrait from "../../assets/illustrations/dongdong-portrait.png";
import liliPortrait from "../../assets/illustrations/lili-portrait.png";
import type { PersonId } from "../../store/types";
import { IllustrationAsset } from "./IllustrationAsset";

type CharacterPortraitProps = {
  character: PersonId;
  assetSrc?: string;
  displayName: string;
};

export function CharacterPortrait({
  character,
  assetSrc,
  displayName,
}: CharacterPortraitProps) {
  const isDongdong = character === "dongdong";
  const resolvedAssetSrc = assetSrc ?? (isDongdong ? dongdongPortrait : liliPortrait);

  return (
    <IllustrationAsset
      assetSrc={resolvedAssetSrc}
      alt={`${displayName}角色插画`}
      className="character-portrait-asset"
      tone={isDongdong ? "blue" : "purple"}
    >
      <strong>{isDongdong ? "D" : "L"}</strong>
      <span>{isDongdong ? "暗红发 · 黑 T · 白短裤" : "深紫发 · 细框眼镜"}</span>
      <i>{isDongdong ? "高个子 · 安静轻酷" : "Jazz / Hiphop · 灵动酷甜"}</i>
    </IllustrationAsset>
  );
}
