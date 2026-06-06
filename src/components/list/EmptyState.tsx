type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className="bucket-empty-state">
      <div aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="secondary-button" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </section>
  );
}
