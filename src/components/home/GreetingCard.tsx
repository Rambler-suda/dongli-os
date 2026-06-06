import type { TodayGreeting } from "../../domain/greeting";

type GreetingCardProps = {
  greeting: TodayGreeting;
};

export function GreetingCard({ greeting }: GreetingCardProps) {
  return (
    <header className="home-greeting">
      <div className="home-greeting__icon" aria-hidden="true">
        {greeting.icon}
      </div>
      <div>
        <p className="eyebrow">DL universe · 今日状态</p>
        <h1>{greeting.mainText}</h1>
        <p>{greeting.subText}</p>
      </div>
    </header>
  );
}
