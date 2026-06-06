import { IllustrationAsset } from "./IllustrationAsset";

type QuoteIllustrationProps = {
  assetSrc?: string;
};

export function QuoteIllustration({ assetSrc }: QuoteIllustrationProps) {
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt="今日一句信封插画"
      className="quote-illustration"
      tone="pink"
    >
      <span className="quote-illustration__letter" />
      <span className="quote-illustration__heart">♡</span>
    </IllustrationAsset>
  );
}
