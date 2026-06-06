import type { ReactNode } from "react";

type IllustrationAssetProps = {
  assetSrc?: string;
  alt: string;
  className?: string;
  tone: "green" | "blue" | "pink" | "purple" | "yellow";
  label?: string;
  children: ReactNode;
};

export function IllustrationAsset({
  assetSrc,
  alt,
  className = "",
  tone,
  label,
  children,
}: IllustrationAssetProps) {
  return (
    <span
      className={`illustration-asset ${className}`.trim()}
      data-asset-status={assetSrc ? "ready" : "placeholder"}
      data-tone={tone}
      role="img"
      aria-label={alt}
    >
      {assetSrc ? <img src={assetSrc} alt="" /> : children}
      {label && <small>{label}</small>}
    </span>
  );
}
