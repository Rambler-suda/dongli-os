import type { TravelItem } from "../store/types";

const DEFAULT_CREATED_AT = "2025-06-07T00:00:00.000Z";

const travelSeeds = [
  ["suzhou-amusement-land", "苏州乐园", "在熟悉的城市里，也要认真约会。", "🎡"],
  ["zhejiang-rafting", "浙江漂流", "去夏天的水里大笑一场。", "🌊"],
  ["changzhou-dinosaur-park", "常州恐龙乐园", "幼稚一点没关系，开心最重要。", "🦖"],
  ["western-sichuan-snow-mountain", "川西雪山", "一起去很远的地方，看很大的雪山。", "🏔️"],
  ["grassland", "草原", "去风很大的地方，看辽阔的绿色。", "🌿"],
  ["yunnan", "云南", "大理、昆明、丽江，都想和你慢慢走。", "🌸"],
  ["xiamen", "厦门", "去海边、街巷和有风的地方。", "🌊"],
  ["shanghai-disneyland", "上海迪士尼", "一起快乐一整天，晚上看烟花。", "🏰"],
] as const;

export function createDefaultTravelItems(): TravelItem[] {
  return travelSeeds.map(([id, title, description, emoji]) => ({
    id: `travel-${id}`,
    title,
    description,
    emoji,
    status: "want",
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  }));
}
