import { PixelIcon } from "./PixelIcon";

type PixelStampProps = {
  tone: "travel" | "love";
  label: string;
};

export function PixelStamp({ tone, label }: PixelStampProps) {
  return (
    <span className="pixel-stamp" data-tone={tone} aria-label={label}>
      <PixelIcon name={tone === "travel" ? "pin" : "heart"} />
      <strong>{label}</strong>
    </span>
  );
}
