import type { BirthdayReminder } from "../../domain/birthday";
import { Card } from "../ui/Card";

type BirthdayCardProps = {
  reminder: BirthdayReminder;
};

export function BirthdayCard({ reminder }: BirthdayCardProps) {
  return (
    <Card className="birthday-card">
      <div className="home-card-heading">
        <div className="home-card-icon home-card-icon--birthday" aria-hidden="true">
          ♡
        </div>
        <span>生日提醒</span>
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
