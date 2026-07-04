import greetingSunIcon from "../assets/nav/greeting-sun-nav.png";
import quickChipsIcon from "../assets/nav/quick-chips-nav.png";
import quickLoveIcon from "../assets/nav/quick-love-nav.png";
import quickTravelIcon from "../assets/nav/quick-travel-nav.png";
import type { TabId } from "../store/types";

type BottomTabBarProps = {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
};

type TabItem = {
  id: TabId;
  label: string;
  iconSrc: string;
};

const tabs: TabItem[] = [
  {
    id: "home",
    label: "首页",
    iconSrc: greetingSunIcon,
  },
  {
    id: "travel",
    label: "旅游",
    iconSrc: quickTravelIcon,
  },
  {
    id: "love",
    label: "Love",
    iconSrc: quickLoveIcon,
  },
  {
    id: "chips",
    label: "筹码",
    iconSrc: quickChipsIcon,
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
            <span className="tab-icon" aria-hidden="true">
              <img src={tab.iconSrc} alt="" />
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
