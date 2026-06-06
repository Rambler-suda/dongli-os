import { IllustrationAsset } from "./IllustrationAsset";

type ReminderIllustrationProps = {
  assetSrc?: string;
  theme: string;
};

export function ReminderIllustration({ assetSrc, theme }: ReminderIllustrationProps) {
  return (
    <IllustrationAsset
      assetSrc={assetSrc}
      alt={`${theme}提醒插画`}
      className="reminder-illustration"
      tone="blue"
    >
      <span className="reminder-illustration__cup" />
      <span className="reminder-illustration__drop" />
    </IllustrationAsset>
  );
}
