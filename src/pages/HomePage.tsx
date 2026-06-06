import { useEffect, useState } from "react";
import { BirthdayCard } from "../components/home/BirthdayCard";
import { DailyQuoteCard } from "../components/home/DailyQuoteCard";
import { DailyReminderCard } from "../components/home/DailyReminderCard";
import { GreetingCard } from "../components/home/GreetingCard";
import { QuickActionCards } from "../components/home/QuickActionCards";
import { RelationshipCard } from "../components/home/RelationshipCard";
import {
  getAnniversaryText,
  getDaysUntilNextAnniversary,
  getRelationshipDays,
} from "../domain/anniversary";
import { getBirthdayReminder } from "../domain/birthday";
import { getTodayQuote, getTodayReminder } from "../domain/dailyContent";
import { getTodayGreeting } from "../domain/greeting";
import { useAppStore } from "../store/appStore";

export function HomePage() {
  const [today, setToday] = useState(() => new Date());
  const profiles = useAppStore((state) => state.profiles);
  const home = useAppStore((state) => state.home);
  const setHomeCache = useAppStore((state) => state.setHomeCache);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);

  const greeting = getTodayGreeting(today, home.dailyGreetingCache);
  const quoteCache = getTodayQuote(today, home.dailyQuoteCache);
  const { reminder, cache: reminderCache } = getTodayReminder(
    today,
    home.dailyReminderCache,
  );
  const birthdayReminder = getBirthdayReminder(profiles, today);

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (home.dailyGreetingCache?.key !== greeting.cache.key) {
      setHomeCache("dailyGreetingCache", greeting.cache);
    }
    if (home.dailyQuoteCache?.key !== quoteCache.key) {
      setHomeCache("dailyQuoteCache", quoteCache);
    }
    if (home.dailyReminderCache?.key !== reminderCache.key) {
      setHomeCache("dailyReminderCache", reminderCache);
    }
  }, [
    greeting.cache,
    home.dailyGreetingCache?.key,
    home.dailyQuoteCache?.key,
    home.dailyReminderCache?.key,
    quoteCache,
    reminderCache,
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
      <div className="home-daily-grid">
        <DailyReminderCard reminder={reminder} />
        <DailyQuoteCard quote={quoteCache.value} />
      </div>
      <QuickActionCards onNavigate={setCurrentTab} />
    </section>
  );
}
