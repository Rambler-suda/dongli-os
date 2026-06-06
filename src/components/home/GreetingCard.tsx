import type { TodayGreeting } from "../../domain/greeting";
import { GreetingIcon } from "../illustrations/GreetingIcon";

type GreetingCardProps = {
  greeting: TodayGreeting;
};

export function GreetingCard({ greeting }: GreetingCardProps) {
  return (
    <header className="home-greeting-card">
      <GreetingIcon icon={greeting.icon} />
      <div className="home-greeting-card__copy">
        <p className="eyebrow">冻梨 OS · 今日状态</p>
        <h1>{greeting.mainText}</h1>
        <p>{greeting.subText}</p>
      </div>
      <button className="home-greeting-card__surprise" type="button" aria-label="今日彩蛋">
        <span aria-hidden="true">✦</span>
        TODAY
      </button>
    </header>
  );
}
