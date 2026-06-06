import type { DailyReminder } from "../../data/dailyReminders";
import { Card } from "../ui/Card";

type DailyReminderCardProps = {
  reminder: DailyReminder;
};

export function DailyReminderCard({ reminder }: DailyReminderCardProps) {
  return (
    <Card className="daily-card">
      <div className="home-card-heading">
        <div className="home-card-icon home-card-icon--reminder" aria-hidden="true">
          {reminder.icon}
        </div>
        <span>今日提醒 · {reminder.theme}</span>
      </div>
      <h2>{reminder.text}</h2>
      <p>只是轻轻提醒，不需要打卡。</p>
    </Card>
  );
}
