export type PixelIconName =
  | "hand"
  | "star"
  | "pin"
  | "heart"
  | "leaf"
  | "lamp"
  | "pear"
  | "ticket";

type PixelIconProps = {
  name: PixelIconName;
  label?: string;
  className?: string;
};

const glyphs: Record<PixelIconName, string> = {
  hand: "手",
  star: "✦",
  pin: "⌖",
  heart: "♥",
  leaf: "◆",
  lamp: "⌂",
  pear: "●",
  ticket: "▣",
};

export function PixelIcon({ name, label, className = "" }: PixelIconProps) {
  return (
    <span
      className={`pixel-icon ${className}`.trim()}
      data-icon={name}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {glyphs[name]}
    </span>
  );
}
