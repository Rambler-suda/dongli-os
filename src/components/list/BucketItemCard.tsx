type BucketItemCardProps = {
  emoji: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedLabel: string;
  pendingLabel: string;
  completeActionLabel: string;
  undoActionLabel: string;
  tone: "travel" | "love";
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function BucketItemCard({
  emoji,
  title,
  description,
  isCompleted,
  completedLabel,
  pendingLabel,
  completeActionLabel,
  undoActionLabel,
  tone,
  onToggle,
  onEdit,
  onDelete,
}: BucketItemCardProps) {
  return (
    <article className="bucket-item-card" data-completed={isCompleted} data-tone={tone}>
      <div className="bucket-item-card__top">
        <div className="bucket-item-card__emoji" aria-hidden="true">
          {emoji}
        </div>
        <div className="bucket-item-card__content">
          <div className="bucket-item-card__title-row">
            <h2>{title}</h2>
            <span className="bucket-status">{isCompleted ? completedLabel : pendingLabel}</span>
          </div>
          <p>{description || "先留一点空白，等以后慢慢补上。"}</p>
        </div>
      </div>
      <div className="bucket-item-card__actions">
        <button className="bucket-toggle-button" type="button" onClick={onToggle}>
          <span aria-hidden="true">{isCompleted ? "↶" : "✦"}</span>
          {isCompleted ? undoActionLabel : completeActionLabel}
        </button>
        <div>
          <button className="icon-text-button" type="button" onClick={onEdit}>
            编辑
          </button>
          <button className="icon-text-button icon-text-button--danger" type="button" onClick={onDelete}>
            删除
          </button>
        </div>
      </div>
    </article>
  );
}
