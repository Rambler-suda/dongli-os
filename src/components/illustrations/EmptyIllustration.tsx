import { IllustrationAsset } from "./IllustrationAsset";

type EmptyIllustrationProps = {
  scene: "travel" | "love";
  assetSrc?: string;
};

export function EmptyIllustration({ scene, assetSrc }: EmptyIllustrationProps) {
  const isTravel = scene === "travel";

  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt={isTravel ? "旅行清单空状态插画" : "Love List 空状态双人插画"}
      className="empty-state-illustration"
      tone={isTravel ? "blue" : "pink"}
      label={assetSrc ? undefined : "插画资产位"}
    >
      <span className="empty-state-illustration__object" data-scene={scene} />
      <span className="empty-state-illustration__spark" aria-hidden="true">
        ✦
      </span>
    </IllustrationAsset>
  );
}
