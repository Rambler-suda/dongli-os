import { IllustrationAsset } from "./IllustrationAsset";

type GreetingIconProps = {
  assetSrc?: string;
  icon: string;
};

export function GreetingIcon({ assetSrc, icon }: GreetingIconProps) {
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt="今日问候插画"
      className="greeting-illustration"
      tone="yellow"
    >
      <span className="greeting-illustration__glow" />
      <strong>{icon}</strong>
    </IllustrationAsset>
  );
}
