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
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt={`${displayName}角色插画`}
      className="character-portrait-asset"
      tone={character === "dongdong" ? "blue" : "purple"}
      label={assetSrc ? undefined : "角色插画待替换"}
    >
      <strong>{character === "dongdong" ? "D" : "L"}</strong>
      <span>{character === "dongdong" ? "暗红发 · 黑 T" : "深紫发 · 舞蹈感"}</span>
    </IllustrationAsset>
  );
}
