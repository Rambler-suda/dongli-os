import { QuoteIllustration } from "../illustrations/QuoteIllustration";
import { Card } from "../ui/Card";

type DailyQuoteCardProps = {
  quote: string;
};

export function DailyQuoteCard({ quote }: DailyQuoteCardProps) {
  return (
    <Card className="quote-card">
      <span className="quote-card__mark" aria-hidden="true">
        ✦
      </span>
      <div>
        <p className="eyebrow">今日一句</p>
        <h2>{quote}</h2>
      </div>
      <QuoteIllustration />
      <span className="quote-card__date">TODAY</span>
    </Card>
  );
}
