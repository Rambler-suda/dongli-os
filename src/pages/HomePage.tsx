import { useEffect, useState } from "react";
import { BirthdayCard } from "../components/home/BirthdayCard";
import { GreetingCard } from "../components/home/GreetingCard";
import { QuickActionCards } from "../components/home/QuickActionCards";
import { RelationshipCard } from "../components/home/RelationshipCard";
import {
  getAnniversaryText,
  getDaysUntilNextAnniversary,
  getRelationshipDays,
} from "../domain/anniversary";
import { getBirthdayReminder } from "../domain/birthday";
import { getTodayGreeting } from "../domain/greeting";
import { useAppStore } from "../store/appStore";

export function HomePage() {
  const [today, setToday] = useState(() => new Date());
  const profiles = useAppStore((state) => state.profiles);
  const home = useAppStore((state) => state.home);
  const setHomeCache = useAppStore((state) => state.setHomeCache);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);

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

  return (
    <section className="page page--home">
      <GreetingCard greeting={greeting} />
      <RelationshipCard
        relationshipDays={getRelationshipDays(today)}
        daysUntilAnniversary={getDaysUntilNextAnniversary(today)}
        anniversaryText={getAnniversaryText(today)}
      />
      <BirthdayCard reminder={birthdayReminder} />
      <QuickActionCards onNavigate={setCurrentTab} />
    </section>
  );
}
