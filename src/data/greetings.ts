export type TimeSlotKey =
  | "earlyMorning"
  | "morning"
  | "lateMorning"
  | "noon"
  | "afternoon"
  | "evening"
  | "night"
  | "midnight"
  | "deepNight";

export type GreetingConfig = {
  slot: TimeSlotKey;
  startHour: number;
  endHour: number;
  icon: string;
  mainText: string;
  subTexts: readonly string[];
};

export const greetings: readonly GreetingConfig[] = [
  {
    slot: "earlyMorning",
    startHour: 6,
    endHour: 7,
    icon: "☀",
    mainText: "早上好，呀婷婷",
    subTexts: [
      "先睁一只眼也算起床成功。",
      "今天也要慢慢变好。",
      "如果还没睡，那就是另一种意义上的早起。",
    ],
  },
  {
    slot: "morning",
    startHour: 7,
    endHour: 9,
    icon: "☀",
    mainText: "早上好，呀婷婷",
    subTexts: [
      "美好的一天从先睁开一只眼睛瞄手机开始。",
      "愿晨起一睁眼，看到的是我们彼此。",
      "今天也要记得好好吃早餐。",
    ],
  },
  {
    slot: "lateMorning",
    startHour: 9,
    endHour: 12,
    icon: "☀",
    mainText: "早上好，呀婷婷",
    subTexts: ["昨晚有没有梦到我？", "喝水！喝水！喝水！", "健康的猪猪需要营养，快去觅食！"],
  },
  {
    slot: "noon",
    startHour: 12,
    endHour: 15,
    icon: "☼",
    mainText: "中午好，呀婷婷",
    subTexts: ["刚起床补水会有小奖励哦。", "先认真吃饭，再慢慢忙。", "午后也要留一点时间给自己。"],
  },
  {
    slot: "afternoon",
    startHour: 15,
    endHour: 18,
    icon: "☼",
    mainText: "下午好，呀婷婷",
    subTexts: ["多久没一起看夕阳啦？", "喝水！喝水！喝水！", "忙完这一点，就休息一下。"],
  },
  {
    slot: "evening",
    startHour: 18,
    endHour: 21,
    icon: "◐",
    mainText: "傍晚好，呀婷婷",
    subTexts: ["今天有没有想我？", "该寻找同伴一起觅食了。", "今晚也要好好吃饭。"],
  },
  {
    slot: "night",
    startHour: 21,
    endHour: 24,
    icon: "☾",
    mainText: "晚上好，呀婷婷",
    subTexts: ["该香香洗个澡准备睡觉喽。", "今天辛苦了，慢慢放松下来吧。", "做个好梦，记得梦到我。"],
  },
  {
    slot: "midnight",
    startHour: 0,
    endHour: 3,
    icon: "☾",
    mainText: "半夜好，婷婷",
    subTexts: ["午夜降临，美梦开启。", "做个好梦宝宝，记得梦到我。", "睡不着也要先让眼睛休息一下。"],
  },
  {
    slot: "deepNight",
    startHour: 3,
    endHour: 6,
    icon: "✦",
    mainText: "深夜好，婷婷",
    subTexts: ["还不睡还不睡还不睡。", "实在睡不着就打给我。", "现在最重要的事情是好好休息。"],
  },
];
