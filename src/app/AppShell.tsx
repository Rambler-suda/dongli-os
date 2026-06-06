import { BottomTabBar } from "./BottomTabBar";
import { ChipsPage } from "../pages/ChipsPage";
import { HomePage } from "../pages/HomePage";
import { LovePage } from "../pages/LovePage";
import { TravelPage } from "../pages/TravelPage";
import { useAppStore } from "../store/appStore";
import type { TabId } from "../store/types";

const pages: Record<TabId, React.ReactNode> = {
  home: <HomePage />,
  travel: <TravelPage />,
  love: <LovePage />,
  chips: <ChipsPage />,
};

export function AppShell() {
  const currentTab = useAppStore((state) => state.appStatus.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);

  return (
    <div className="app-shell">
      <main className="app-main">{pages[currentTab]}</main>
      <BottomTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
