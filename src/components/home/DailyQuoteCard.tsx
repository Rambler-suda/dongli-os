import { Card } from "../ui/Card";

type DailyQuoteCardProps = {
  quote: string;
};

export function DailyQuoteCard({ quote }: DailyQuoteCardProps) {
  return (
    <Card className="quote-card" tone="soft">
      <span className="quote-card__mark" aria-hidden="true">
        “
      </span>
      <div>
        <p className="card-label">今日一句</p>
        <h2>{quote}</h2>
      </div>
      <span className="quote-card__date">今天</span>
    </Card>
  );
}
