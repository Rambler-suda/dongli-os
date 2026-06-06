import type { TabId } from "../../store/types";
import { QuickEntryIcon } from "../illustrations/QuickEntryIcon";

type QuickActionCardsProps = {
  onNavigate: (tab: TabId) => void;
};

const actions: Array<{
  tab: TabId;
  title: string;
  description: string;
}> = [
  {
    tab: "home",
    title: "今日状态",
    description: "看看属于我们的今天",
  },
  {
    tab: "travel",
    title: "旅游 LIST",
    description: "下一站慢慢点亮",
  },
  {
    tab: "love",
    title: "Love List",
    description: "一起完成一件小事",
  },
  {
    tab: "chips",
    title: "筹码",
    description: "记下一笔小手",
  },
];

export function QuickActionCards({ onNavigate }: QuickActionCardsProps) {
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
            key={action.tab}
            type="button"
            onClick={() => onNavigate(action.tab)}
          >
            <QuickEntryIcon entry={action.tab} />
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
