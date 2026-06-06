import type { LoveItem } from "../store/types";

const DEFAULT_CREATED_AT = "2025-06-07T00:00:00.000Z";

const loveSeeds = [
  ["couple-rings", "做情侣对戒", "把属于我们的纪念，戴在手上。", "💍"],
  ["couple-photos", "拍情侣写真", "认真留下一组属于现在的我们。", "📷"],
  ["stargazing-hike", "爬山看星空", "一起走到高一点的地方，看一整片星空。", "🌌"],
  ["hot-spring", "泡温泉", "找一个舒服的地方，好好放松一下。", "♨️"],
  ["camping", "去野营", "在帐篷、晚风和灯光里待一晚。", "⛺"],
  ["couple-hair-color", "去染情侣发色", "一起做一次有点大胆的小改变。", "🎨"],
  ["cosplay-convention", "去漫展出 cos", "一起进入另一个可爱的世界。", "🎭"],
  ["skiing-skating", "滑雪滑冰", "摔倒也没关系，反正可以一起笑。", "⛸️"],
  ["music-festival", "去音乐节", "在人群和音乐里，一起大声快乐。", "🎵"],
  ["raise-a-dog", "一起养一只小狗", "等准备好了，就一起照顾一个小生命。", "🐶"],
  ["ultimate-goal", "终极目标（猜猜是什么呢）", "先不告诉你，慢慢解锁。", "🔐"],
] as const;

export function createDefaultLoveItems(): LoveItem[] {
  return loveSeeds.map(([id, title, description, emoji]) => ({
    id: `love-${id}`,
    title,
    description,
    emoji,
    status: "todo",
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT,
  }));
}
