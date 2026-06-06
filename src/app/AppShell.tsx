import { useState } from "react";
import { BottomTabBar, type TabId } from "./BottomTabBar";
import { ChipsPage } from "../pages/ChipsPage";
import { HomePage } from "../pages/HomePage";
import { LovePage } from "../pages/LovePage";
import { TravelPage } from "../pages/TravelPage";

const pages: Record<TabId, React.ReactNode> = {
  home: <HomePage />,
  travel: <TravelPage />,
  love: <LovePage />,
  chips: <ChipsPage />,
};

export function AppShell() {
  const [currentTab, setCurrentTab] = useState<TabId>("home");

  return (
    <div className="app-shell">
      <main className="app-main">{pages[currentTab]}</main>
      <BottomTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
