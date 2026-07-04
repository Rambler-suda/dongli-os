import type { TabId } from "../../store/types";
import { QuickEntryIcon } from "../illustrations/QuickEntryIcon";

type QuickActionId = TabId | "memo";

type QuickActionCardsProps = {
  onNavigate: (tab: TabId) => void;
  onOpenMemo: () => void;
};

const actions: Array<{
  id: QuickActionId;
  title: string;
  description: string;
}> = [
  {
    id: "memo",
    title: "备忘录",
    description: "记下文字或图片",
  },
  {
    id: "travel",
    title: "旅游 LIST",
    description: "下一站慢慢点亮",
  },
  {
    id: "love",
    title: "Love List",
    description: "一起完成一件小事",
  },
  {
    id: "chips",
    title: "筹码",
    description: "记下一笔小手",
  },
];

export function QuickActionCards({ onNavigate, onOpenMemo }: QuickActionCardsProps) {
  return (
    <section className="quick-actions" aria-labelledby="quick-actions-title">
      <div className="section-heading">
        <h2 id="quick-actions-title">一起去做点什么</h2>
        <span>QUICK ACCESS</span>
      </div>
      <div className="quick-actions__list">
        {actions.map((action) => (
          <button
            className="quick-action"
            key={action.id}
            type="button"
            onClick={() => (action.id === "memo" ? onOpenMemo() : onNavigate(action.id))}
          >
            <QuickEntryIcon entry={action.id} />
            <span className="quick-action__copy">
              <strong>{action.title}</strong>
              <small>{action.description}</small>
            </span>
            <i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>
    </section>
  );
}
