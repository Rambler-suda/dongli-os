import { Card } from "../ui/Card";

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
      <div className="relationship-card__content">
        <span className="status-pill">我们的时间</span>
        <p>我们已经在一起</p>
        <strong>
          {relationshipDays}
          <span>天</span>
        </strong>
        <div className="relationship-card__meta">
          <span>Since 2025.06.07</span>
          <span>{daysUntilAnniversary === 0 ? "今天值得庆祝" : anniversaryText}</span>
        </div>
      </div>
      <div className="relationship-orbit" aria-hidden="true">
        <span />
        <span />
        <i>✦</i>
      </div>
    </Card>
  );
}
