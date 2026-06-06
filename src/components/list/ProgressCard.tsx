import { Card } from "../ui/Card";
import { PixelIcon } from "../pixel/PixelIcon";

type ProgressCardProps = {
  label: string;
  completedLabel: string;
  completed: number;
  total: number;
  tone: "travel" | "love";
};

export function ProgressCard({
  label,
  completedLabel,
  completed,
  total,
  tone,
}: ProgressCardProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="bucket-progress-card" data-tone={tone}>
      <div>
        <p className="card-label">{label}</p>
        <strong>
          {completedLabel} {completed} / 总共 {total}
        </strong>
        <span>{total === 0 ? "从第一项开始慢慢填满。" : `已经完成 ${percentage}%`}</span>
      </div>
      <div
        className="bucket-progress-ring"
        style={{ "--progress": `${percentage * 3.6}deg` } as React.CSSProperties}
        aria-label={`当前进度 ${percentage}%`}
      >
        <span>{percentage}%</span>
      </div>
      <div className="bucket-progress-pixels" aria-hidden="true">
        <PixelIcon name={tone === "travel" ? "pin" : "heart"} />
        <PixelIcon name="star" />
        <PixelIcon name="leaf" />
      </div>
    </Card>
  );
}
