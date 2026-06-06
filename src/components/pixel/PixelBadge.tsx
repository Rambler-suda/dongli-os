import { PixelIcon, type PixelIconName } from "./PixelIcon";

type PixelBadgeProps = {
  tone: "travel" | "love" | "pear";
  label: string;
  icon?: PixelIconName;
};

export function PixelBadge({ tone, label, icon = "star" }: PixelBadgeProps) {
  return (
    <span className="pixel-badge" data-tone={tone}>
      <PixelIcon name={icon} />
      {label}
    </span>
  );
}
