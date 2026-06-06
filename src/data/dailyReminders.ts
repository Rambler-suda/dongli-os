export type DailyReminder = {
  theme: string;
  icon: string;
  text: string;
};

export const dailyReminders: readonly DailyReminder[] = [
  { theme: "喝水", icon: "◌", text: "补水有益身心健康，看到这条先喝一口。" },
  { theme: "吃饭", icon: "⌁", text: "健康的猪猪需要营养，快去觅食。" },
  { theme: "早睡", icon: "☾", text: "世界不会因为你晚睡两小时就变好，但你会变困。" },
  { theme: "休息", icon: "◐", text: "忙完手上的一点点，就让自己休息一下。" },
  { theme: "放松", icon: "✦", text: "今天已经很努力了，记得慢慢放松下来。" },
  { theme: "想我一下", icon: "♡", text: "今天也可以抽一点时间，认真想我一下。" },
];
