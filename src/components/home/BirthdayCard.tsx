import type { BirthdayReminder } from "../../domain/birthday";
import { Card } from "../ui/Card";

type BirthdayCardProps = {
  reminder: BirthdayReminder;
};

export function BirthdayCard({ reminder }: BirthdayCardProps) {
  return (
    <Card className="birthday-card">
      <div className="home-widget-heading">
        <div className="home-widget-icon home-widget-icon--birthday" aria-hidden="true">
          ♡
        </div>
        <div>
          <span>生日提醒</span>
          <strong>Birthday</strong>
        </div>
      </div>
      <h2>{reminder.title}</h2>
      <p>{reminder.message}</p>
      <div className="birthday-tags">
        {reminder.birthdays.map((birthday) => (
          <span key={birthday.personId}>
            {birthday.displayName}
            <strong>{birthday.monthDay}</strong>
          </span>
        ))}
      </div>
    </Card>
  );
}
