import type { TabId } from "../../store/types";

type QuickActionCardsProps = {
  onNavigate: (tab: TabId) => void;
};

const actions: Array<{
  tab: Exclude<TabId, "home">;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    tab: "travel",
    icon: "⌖",
    title: "去旅游 LIST 添加一个地方",
    description: "下一站，先记下来",
  },
  {
    tab: "love",
    icon: "♡",
    title: "去 Love List 添加一件小事",
    description: "把共同期待慢慢点亮",
  },
  {
    tab: "chips",
    icon: "✦",
    title: "去筹码记一笔小手",
    description: "愿赌服输，轻轻来",
  },
];

export function QuickActionCards({ onNavigate }: QuickActionCardsProps) {
  return (
    <section className="quick-actions" aria-labelledby="quick-actions-title">
      <div className="section-heading">
        <h2 id="quick-actions-title">一起去做点什么</h2>
        <span>轻量入口</span>
      </div>
      <div className="quick-actions__list">
        {actions.map((action) => (
          <button
            className="quick-action"
            key={action.tab}
            type="button"
            onClick={() => onNavigate(action.tab)}
          >
            <span className="quick-action__icon" aria-hidden="true">
              {action.icon}
            </span>
            <span>
              <strong>{action.title}</strong>
              <small>{action.description}</small>
            </span>
            <i aria-hidden="true">›</i>
          </button>
        ))}
      </div>
    </section>
  );
}
