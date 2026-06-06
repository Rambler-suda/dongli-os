import { IllustrationAsset } from "./IllustrationAsset";

type CoupleSceneProps = {
  assetSrc?: string;
};

export function CoupleScene({ assetSrc }: CoupleSceneProps) {
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt="冻冻和梨梨双人像素场景"
      className="couple-scene-asset"
      tone="green"
      label={assetSrc ? undefined : "正式双人像素场景待替换"}
    >
      <span className="couple-scene-asset__window" />
      <span className="couple-scene-asset__lamp" />
      <span className="couple-scene-asset__sofa" />
      <span className="couple-scene-asset__names">
        <strong>冻冻</strong>
        <i>×</i>
        <strong>梨梨</strong>
      </span>
    </IllustrationAsset>
  );
}
