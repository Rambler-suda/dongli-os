import { Card } from "../ui/Card";
import { CoupleScene } from "../illustrations/CoupleScene";

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
  return (
    <Card className="relationship-card" tone="pear">
      <div className="relationship-card__summary">
        <div className="relationship-card__content">
          <span className="status-pill">OUR DAYS</span>
          <p>我们已经在一起</p>
          <strong>
            {relationshipDays}
            <span>天</span>
          </strong>
        </div>
        <div className="relationship-card__meta">
          <span>Since 2025.06.07</span>
          <strong>{daysUntilAnniversary === 0 ? "今天值得庆祝" : anniversaryText}</strong>
        </div>
      </div>
      <CoupleScene />
    </Card>
  );
}
