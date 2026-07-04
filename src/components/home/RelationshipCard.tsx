import { Card } from "../ui/Card";
import { CoupleScene } from "../illustrations/CoupleScene";
import { PixelIcon } from "../pixel/PixelIcon";

type RelationshipCardProps = {
  relationshipDays: number;
  anniversaryText: string;
  daysUntilAnniversary: number;
};

export function RelationshipCard({
  relationshipDays,
  anniversaryText,
  daysUntilAnniversary,
}: RelationshipCardProps) {
  const anniversarySummary = daysUntilAnniversary === 0
    ? "今天值得庆祝"
    : anniversaryText.replace("距离 ", "").replace("纪念日还有", "还有");
  const countdownText = daysUntilAnniversary === 0 ? "今天" : `${daysUntilAnniversary} 天`;

  return (
    <Card className="relationship-card" tone="pear">
      <div className="relationship-card__summary">
        <div className="relationship-card__content">
          <div className="relationship-card__topline">
            <span className="status-pill">OUR DAYS</span>
            <span className="relationship-card__pixels" aria-hidden="true">
              <PixelIcon name="heart" />
              <PixelIcon name="star" />
              <PixelIcon name="leaf" />
            </span>
          </div>
          <p>我们已经在一起</p>
          <strong>
            {relationshipDays}
            <span>天</span>
          </strong>
          <div className="relationship-card__countdown">
            <span>
              <PixelIcon name="ticket" />
              纪念日倒计时
            </span>
            <strong>{countdownText}</strong>
          </div>
          <div className="relationship-card__meta">
            <span>
              <PixelIcon name="heart" />
              Since 2025.06.07
            </span>
            <strong>{anniversarySummary}</strong>
          </div>
        </div>
        <div className="relationship-card__scene">
          <CoupleScene />
        </div>
      </div>
    </Card>
  );
}
