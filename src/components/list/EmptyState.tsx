import { PixelWorld } from "../pixel/PixelWorld";
import { PixelIcon } from "../pixel/PixelIcon";

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
      {tone === "love" ? (
        <PixelWorld compact />
      ) : (
        <div className="bucket-empty-state__pixel-icon">
          <PixelIcon name="pin" label="像素旅行图标" />
        </div>
      )}
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="secondary-button" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </section>
  );
}
