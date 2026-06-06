import { PixelAvatar } from "./PixelAvatar";
import { PixelIcon } from "./PixelIcon";

type PixelWorldProps = {
  compact?: boolean;
};

export function PixelWorld({ compact = false }: PixelWorldProps) {
  return (
    <div className="pixel-world" data-compact={compact} aria-label="冻冻和梨梨的像素小世界">
      <div className="pixel-world__window" aria-hidden="true">
        <i />
        <i />
        <PixelIcon name="star" />
      </div>
      <div className="pixel-world__lamp" aria-hidden="true">
        <i />
        <span />
      </div>
      <div className="pixel-world__shelf" aria-hidden="true">
        <PixelIcon name="pear" />
        <PixelIcon name="star" />
      </div>
      <div className="pixel-world__characters">
        <PixelAvatar character="dongdong" mood="happy" size={compact ? "md" : "lg"} />
        <PixelAvatar character="lili" mood="dance" size={compact ? "sm" : "md"} />
      </div>
      <div className="pixel-world__floor" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
