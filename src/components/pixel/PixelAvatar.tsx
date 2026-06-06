export type PixelCharacter = "dongdong" | "lili";
export type PixelMood = "idle" | "happy" | "hand" | "star" | "dance";
export type PixelAvatarSize = "sm" | "md" | "lg" | "xl";

type PixelAvatarProps = {
  character: PixelCharacter;
  mood?: PixelMood;
  size?: PixelAvatarSize;
  assetSrc?: string;
  label?: string;
};

export function PixelAvatar({
  character,
  mood = "idle",
  size = "md",
  assetSrc,
  label = character === "dongdong" ? "冻冻" : "梨梨",
}: PixelAvatarProps) {
  if (assetSrc) {
    return (
      <span
        className="pixel-avatar"
        data-character={character}
        data-mood={mood}
        data-size={size}
        role="img"
        aria-label={`${label}的像素形象`}
      >
        <img src={assetSrc} alt="" />
      </span>
    );
  }

  return (
    <span
      className="pixel-avatar"
      data-character={character}
      data-mood={mood}
      data-size={size}
      role="img"
      aria-label={`${label}的像素形象`}
    >
      <span className="pixel-person" aria-hidden="true">
        <span className="pixel-person__shadow" />
        <span className="pixel-person__hair" />
        <span className="pixel-person__head">
          <span className="pixel-person__eyes" />
          {character === "lili" && <span className="pixel-person__glasses" />}
        </span>
        <span className="pixel-person__body" />
        <span className="pixel-person__arm pixel-person__arm--left" />
        <span className="pixel-person__arm pixel-person__arm--right" />
        <span className="pixel-person__bottom" />
        <span className="pixel-person__leg pixel-person__leg--left" />
        <span className="pixel-person__leg pixel-person__leg--right" />
        <span className="pixel-person__shoe pixel-person__shoe--left" />
        <span className="pixel-person__shoe pixel-person__shoe--right" />
        {mood === "star" && <span className="pixel-person__mood-mark">✦</span>}
        {mood === "hand" && <span className="pixel-person__mood-mark">手</span>}
      </span>
    </span>
  );
}
