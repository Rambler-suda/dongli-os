import { useEffect, useState } from "react";
import { BirthdayCard } from "../components/home/BirthdayCard";
import { GreetingCard } from "../components/home/GreetingCard";
import { QuickActionCards } from "../components/home/QuickActionCards";
import { RelationshipCard } from "../components/home/RelationshipCard";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import {
  getAnniversaryText,
  getDaysUntilNextAnniversary,
  getRelationshipDays,
} from "../domain/anniversary";
import { getBirthdayReminder } from "../domain/birthday";
import { getTodayGreeting } from "../domain/greeting";
import { useAppStore } from "../store/appStore";
import { MemoPage } from "./MemoPage";

const LOGOUT_LABEL = "\u9000\u51fa\u767b\u5f55";
const LOGOUT_DIALOG_TITLE = "\u786e\u8ba4\u9000\u51fa\u767b\u5f55\uff1f";
const LOGOUT_DIALOG_MESSAGE =
  "\u9000\u51fa\u540e\u9700\u8981\u91cd\u65b0\u8f93\u5165\u6697\u53f7\u624d\u80fd\u8fdb\u5165\u51bb\u68a8 OS\u3002";
const LOGOUT_CONFIRM_LABEL = "\u9000\u51fa";

export function HomePage() {
  const [today, setToday] = useState(() => new Date());
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const profiles = useAppStore((state) => state.profiles);
  const home = useAppStore((state) => state.home);
  const setHomeCache = useAppStore((state) => state.setHomeCache);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const logoutApp = useAppStore((state) => state.logoutApp);

  const greeting = getTodayGreeting(today, home.dailyGreetingCache);
  const birthdayReminder = getBirthdayReminder(profiles, today);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (home.dailyGreetingCache?.key !== greeting.cache.key) {
      setHomeCache("dailyGreetingCache", greeting.cache);
    }
  }, [
    greeting.cache,
    home.dailyGreetingCache?.key,
    setHomeCache,
  ]);

  if (isMemoOpen) {
    return <MemoPage onBack={() => setIsMemoOpen(false)} />;
  }

  function handleConfirmLogout() {
    setIsLogoutDialogOpen(false);
    logoutApp();
  }

  return (
    <section className="page page--home">
      <GreetingCard
        greeting={greeting}
        action={
          <button
            className="home-logout-button"
            type="button"
            aria-label={LOGOUT_LABEL}
            title={LOGOUT_LABEL}
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12H9" />
            </svg>
          </button>
        }
      />
      <RelationshipCard
        relationshipDays={getRelationshipDays(today)}
        daysUntilAnniversary={getDaysUntilNextAnniversary(today)}
        anniversaryText={getAnniversaryText(today)}
      />
      <BirthdayCard reminder={birthdayReminder} />
      <QuickActionCards onNavigate={setCurrentTab} onOpenMemo={() => setIsMemoOpen(true)} />
      <ConfirmDialog
        open={isLogoutDialogOpen}
        title={LOGOUT_DIALOG_TITLE}
        message={LOGOUT_DIALOG_MESSAGE}
        confirmLabel={LOGOUT_CONFIRM_LABEL}
        onCancel={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </section>
  );
}
