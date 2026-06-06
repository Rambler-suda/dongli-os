import { convertHandsToAssets } from "../../domain/chips";
import { PixelIcon } from "../pixel/PixelIcon";

type ChipAssetDisplayProps = {
  totalHands: number;
};

function AssetIcon({ type }: { type: "wish" | "hand" }) {
  return (
    <span className="chip-asset-icon" data-type={type} aria-hidden="true">
      <PixelIcon name={type === "wish" ? "star" : "hand"} />
    </span>
  );
}

export function ChipAssetDisplay({ totalHands }: ChipAssetDisplayProps) {
  const assets = convertHandsToAssets(totalHands);

  if (assets.safeHands === 0) {
    return <p className="chip-assets-empty">暂无小手资产</p>;
  }

  const isCompact = assets.safeHands > 50;

  return (
    <div className="chip-assets" aria-label={`${assets.wishes} 个小愿望，${assets.hands} 个小手`}>
      {assets.wishes > 0 && (
        <div className="chip-asset-group">
          <div className="chip-asset-icons" aria-hidden="true">
            {isCompact ? (
              <AssetIcon type="wish" />
            ) : (
              Array.from({ length: assets.wishes }, (_, index) => (
                <AssetIcon key={`wish-${index}`} type="wish" />
              ))
            )}
          </div>
          <strong>{isCompact ? `${assets.wishes} 个` : "小愿望"}</strong>
        </div>
      )}

      {assets.hands > 0 && (
        <div className="chip-asset-group">
          <div className="chip-asset-icons" aria-hidden="true">
            {isCompact ? (
              <AssetIcon type="hand" />
            ) : (
              Array.from({ length: assets.hands }, (_, index) => (
                <AssetIcon key={`hand-${index}`} type="hand" />
              ))
            )}
          </div>
          <strong>{isCompact ? `${assets.hands} 个` : "小手"}</strong>
        </div>
      )}
    </div>
  );
}
