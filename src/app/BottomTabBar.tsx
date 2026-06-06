import type { ReactNode } from "react";
import type { TabId } from "../store/types";

type BottomTabBarProps = {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
};

type TabItem = {
  id: TabId;
  label: string;
  icon: ReactNode;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const tabs: TabItem[] = [
  {
    id: "home",
    label: "首页",
    icon: (
      <svg {...iconProps}>
        <path d="m4 10 8-6.5 8 6.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5Z" />
        <path d="M9.5 20v-6h5v6" />
      </svg>
    ),
  },
  {
    id: "travel",
    label: "旅游",
    icon: (
      <svg {...iconProps}>
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    ),
  },
  {
    id: "love",
    label: "Love",
    icon: (
      <svg {...iconProps}>
        <path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.3Z" />
      </svg>
    ),
  },
  {
    id: "chips",
    label: "筹码",
    icon: (
      <svg {...iconProps}>
        <path d="m12 3 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8Z" />
      </svg>
    ),
  },
];

export function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="bottom-tabbar" aria-label="主导航">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <button
            className="tab-button"
            data-active={isActive}
            key={tab.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
