import type { ReactNode } from "react";
import type { TodayGreeting } from "../../domain/greeting";
import { GreetingIcon } from "../illustrations/GreetingIcon";

type GreetingCardProps = {
  greeting: TodayGreeting;
  action?: ReactNode;
};

export function GreetingCard({ greeting, action }: GreetingCardProps) {
  return (
    <header className="home-greeting-card">
      <GreetingIcon icon={greeting.icon} />
      <div className="home-greeting-card__copy">
        <p className="eyebrow">冻梨 OS · 今日状态</p>
        <h1>{greeting.mainText}</h1>
        <p>{greeting.subText}</p>
      </div>
      {action ? <div className="home-greeting-card__action">{action}</div> : null}
    </header>
  );
}
