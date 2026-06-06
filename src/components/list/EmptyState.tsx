import { EmptyIllustration } from "../illustrations/EmptyIllustration";

type EmptyStateProps = {
  tone: "travel" | "love";
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({
  tone,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className="bucket-empty-state">
      <EmptyIllustration scene={tone} />
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="secondary-button" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </section>
  );
}
