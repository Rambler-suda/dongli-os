import coupleSceneAsset from "../../assets/illustrations/home-couple-scene.png";
import { IllustrationAsset } from "./IllustrationAsset";

type CoupleSceneProps = {
  assetSrc?: string;
};

export function CoupleScene({ assetSrc }: CoupleSceneProps) {
  const resolvedAssetSrc = assetSrc ?? coupleSceneAsset;

  return (
    <IllustrationAsset
      assetSrc={resolvedAssetSrc}
      alt="冻冻和梨梨双人像素场景"
      className="couple-scene-asset"
      tone="green"
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
