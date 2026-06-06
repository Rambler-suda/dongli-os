import type { DailyReminder } from "../../data/dailyReminders";
import { ReminderIllustration } from "../illustrations/ReminderIllustration";
import { Card } from "../ui/Card";

type DailyReminderCardProps = {
  reminder: DailyReminder;
};

export function DailyReminderCard({ reminder }: DailyReminderCardProps) {
  return (
    <Card className="daily-card">
      <div className="home-widget-heading">
        <div className="home-widget-icon home-widget-icon--reminder" aria-hidden="true">
          {reminder.icon}
        </div>
        <div>
          <span>今日提醒</span>
          <strong>{reminder.theme}</strong>
        </div>
      </div>
      <h2>{reminder.text}</h2>
      <p>轻轻提醒，不需要打卡。</p>
      <ReminderIllustration theme={reminder.theme} />
      <div className="home-card-footer">
        <span aria-label="第 1 条提醒">
          <i data-active="true" />
          <i />
          <i />
        </span>
        <button type="button">知道啦</button>
      </div>
    </Card>
  );
}
