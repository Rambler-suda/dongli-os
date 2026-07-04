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
  daysUntilAnniversary,
}: RelationshipCardProps) {
  const countdownText = daysUntilAnniversary === 0 ? "今天" : `${daysUntilAnniversary} 天`;

  return (
    <Card className="relationship-card" tone="pear">
      <div className="relationship-card__summary">
        <div className="relationship-card__content">
          <div className="relationship-card__title">
            <p>我们已经在一起</p>
            <span className="relationship-card__title-icon" aria-hidden="true">
              <PixelIcon name="heart" />
            </span>
          </div>
          <strong>
            {relationshipDays}
            <span>天</span>
          </strong>
          <div className="relationship-card__countdown">
            <span>
              <PixelIcon name="heart" />
              纪念日倒计时
            </span>
            <strong>{countdownText}</strong>
          </div>
        </div>
        <div className="relationship-card__scene">
          <CoupleScene />
        </div>
      </div>
    </Card>
  );
}