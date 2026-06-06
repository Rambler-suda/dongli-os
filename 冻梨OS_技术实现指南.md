<!--
导出说明：冻梨 OS 技术实现指南 / Markdown 版
用途：提供给 Codex / Cursor / 前端开发作为工程实现参考
-->

# 《冻梨 OS》技术实现指南

## 1. 推荐实现形态

冻梨 OS 第一版建议实现为：

```txt
Mobile-first PWA
React + TypeScript + Vite
Local-first 本地数据存储
无后端
无账号系统
无云同步
```

原因很明确：PRD 里 V1 的定位是“一周年礼物 MVP”，只做首页、旅游、Love、筹码四个主入口，不新增“回忆”“我们”等底部主入口，也不做账号、云同步、聊天、相册、地图、天气等复杂功能。

所以第一版不应该按“商业化情侣 App”来搭，而应该按一个**本地运行、可安装、移动端优先的小型私人系统**来做。

技术目标不是“功能堆满”，而是：

```txt
1. iPhone 上打开舒服
2. 首次进入流程完整
3. 四个 Tab 稳定可用
4. 数据刷新后不丢
5. 日期计算准确
6. 视觉接近 iOS 小组件
7. 后续可以扩展成原生 App / 云同步版本
```

---

## 2. 技术架构建议

整体可以采用单页应用结构：

```txt
App 启动
 ↓
读取本地存储
 ↓
判断是否首次进入
 ↓
如果未解锁：进入暗号页
 ↓
如果已解锁但未设置资料：进入资料设置页
 ↓
如果已完成设置：进入主 App Shell
 ↓
底部 Tab 切换：首页 / 旅游 / Love / 筹码
```

不要一开始做复杂路由。V1 可以用一个简单的 `currentTab` 状态控制页面切换。

推荐架构：

```txt
src/
 main.tsx
 App.tsx

 app/
 AppShell.tsx
 BottomTabBar.tsx
 OnboardingGate.tsx

 pages/
 PasscodePage.tsx
 ProfileSetupPage.tsx
 HomePage.tsx
 TravelPage.tsx
 LovePage.tsx
 ChipsPage.tsx

 components/
 ui/
 Card.tsx
 Button.tsx
 Pill.tsx
 Modal.tsx
 BottomSheet.tsx
 ConfirmDialog.tsx
 TextInput.tsx
 EmptyState.tsx

 home/
 GreetingCard.tsx
 RelationshipCard.tsx
 BirthdayCard.tsx
 DailyReminderCard.tsx
 DailyQuoteCard.tsx

 list/
 ProgressCard.tsx
 BucketItemCard.tsx
 BucketItemEditor.tsx

 chips/
 PersonChipCard.tsx
 ChipAssetDisplay.tsx

 pixel/
 PixelAvatar.tsx
 PixelWorld.tsx
 PixelBadge.tsx

 store/
 appStore.ts
 storage.ts
 defaultState.ts
 migrations.ts

 domain/
 date.ts
 greeting.ts
 birthday.ts
 anniversary.ts
 chips.ts
 bucketList.ts
 dailyRandom.ts

 data/
 greetings.ts
 dailyQuotes.ts
 dailyReminders.ts
 defaultTravelItems.ts
 defaultLoveItems.ts
 profiles.ts

 styles/
 tokens.css
 global.css
```

重点是：**业务逻辑不要写死在页面组件里**。页面只负责展示和调用方法，日期、筹码、每日随机、列表状态切换这些逻辑要放进 `domain/`。

---

## 3. 状态管理方案

V1 数据量很小，不需要 Redux。推荐：

```txt
Zustand + localStorage persistence
```

或者：

```txt
React Context + useReducer + localStorage
```

如果让 Codex 写，Zustand 更稳定、代码更清楚。

全局状态建议拆成 6 类：

```txt
1. AppStatus：是否解锁、是否完成首次设置、当前 Tab
2. Profiles：两个人的昵称、头像、像素 IP key
3. HomeDailyCache：首页每日随机结果缓存
4. TravelItems：旅游清单
5. LoveItems：Love 清单
6. Chips：双方小手余额
```

示例：

```ts
type AppState = {
 version: number;

 appStatus: {
 hasUnlocked: boolean;
 hasCompletedProfileSetup: boolean;
 currentTab: "home" | "travel" | "love" | "chips";
 };

 profiles: {
 dongdong: CoupleProfile;
 lili: CoupleProfile;
 };

 home: {
 dailyGreetingCache: DailyCache | null;
 dailyQuoteCache: DailyCache | null;
 dailyReminderCache: DailyCache | null;
 };

 travelItems: TravelItem[];
 loveItems: LoveItem[];

 chips: {
 dongdongHands: number;
 liliHands: number;
 };
};
```

---

## 4. 本地存储设计

V1 推荐只使用本地存储，不接数据库。

建议使用一个主 key：

```ts
const STORAGE_KEY = "dongli-os:v1";
```

存储结构：

```ts
type PersistedState = {
 version: 1;
 appStatus: AppState["appStatus"];
 profiles: AppState["profiles"];
 home: AppState["home"];
 travelItems: TravelItem[];
 loveItems: LoveItem[];
 chips: AppState["chips"];
 updatedAt: string;
};
```

实现时要注意三点：

第一，必须做默认数据合并。用户第一次打开时，本地没有数据，要从 `defaultState` 初始化。

第二，要预留版本号。以后如果 V2 增加回忆页、云同步、筹码历史，需要能迁移旧数据。

第三，头像不要直接把大图塞进 localStorage。真实头像可以先不做复杂上传，或者压缩后存 IndexedDB。V1 最稳妥的方案是：默认使用静态像素 IP，真实头像上传作为可选项。

---

## 5. 核心数据模型

### 5.1 用户资料

```ts
type CoupleProfile = {
 id: "dongdong" | "lili";
 role: "me" | "partner";
 displayName: string;
 birthday: string; // YYYY-MM-DD
 pixelAvatarKey: "dongdong-default" | "lili-default";
 realAvatarUrl?: string;
};
```

默认数据：

```ts
const DEFAULT_PROFILES = {
 dongdong: {
 id: "dongdong",
 role: "me",
 displayName: "大冻梨",
 birthday: "2002-02-03",
 pixelAvatarKey: "dongdong-default",
 },
 lili: {
 id: "lili",
 role: "partner",
 displayName: "婷婷",
 birthday: "2002-03-18",
 pixelAvatarKey: "lili-default",
 },
};
```

IP 要按照 PRD 的人物设定来建模：冻冻对应男生，梨梨对应女生；冻冻有暗红头发、黑色重磅短袖、白色宽松美式短裤；梨梨有深紫头发、细框眼镜、舞蹈服装和小个子灵动感。

---

### 5.2 旅游项目

```ts
type TravelItem = {
 id: string;
 title: string;
 description: string;
 emoji: string;
 status: "want" | "visited";
 createdAt: string;
 updatedAt: string;
};
```

操作方法：

```ts
addTravelItem(input)
updateTravelItem(id, patch)
deleteTravelItem(id)
markTravelVisited(id)
undoTravelVisited(id)
```

旅游只保留两种状态：`want` 和 `visited`。不要加“计划中”“优先级”“日期”“路线”“预算”等字段，V1 不需要。

---

### 5.3 Love 项目

```ts
type LoveItem = {
 id: string;
 title: string;
 description: string;
 emoji: string;
 status: "todo" | "done";
 createdAt: string;
 updatedAt: string;
};
```

操作方法：

```ts
addLoveItem(input)
updateLoveItem(id, patch)
deleteLoveItem(id)
markLoveDone(id)
undoLoveDone(id)
```

Love 也只保留两种状态：`todo` 和 `done`。不要做复杂任务系统。

---

### 5.4 筹码数据

```ts
type ChipsState = {
 dongdongHands: number;
 liliHands: number;
};
```

筹码换算必须写成纯函数：

```ts
function convertHandsToAssets(hands: number) {
 const safeHands = Math.max(0, hands);

 return {
 wishes: Math.floor(safeHands / 10),
 hands: safeHands % 10,
 };
}
```

展示逻辑：

```txt
0：暂无小手
1-9：显示对应数量 ✋
10：显示 1 个 ⭐
12：显示 1 个 ⭐ + 2 个 ✋
27：显示 2 个 ⭐ + 7 个 ✋
超过 50：建议显示 ⭐ × N + ✋ × N
```

筹码页面是 V1 的重点功能之一。PRD 明确要求筹码支持双方余额、+1、+5、-1、清零，以及小手与小愿望自动换算。

---

## 6. 日期计算实现

日期是这个项目里最容易出 bug 的地方，尤其是 iPhone Safari、时区和 UTC。

不要直接写：

```ts
new Date("2025-06-07")
```

这种写法在部分环境中会按 UTC 解析，可能导致日期偏移。

建议统一写本地日期构造函数：

```ts
function createLocalDate(year: number, month: number, day: number) {
 return new Date(year, month - 1, day);
}
```

### 6.1 在一起天数

```ts
const RELATIONSHIP_START = {
 year: 2025,
 month: 6,
 day: 7,
};

function getStartOfLocalDay(date: Date) {
 return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRelationshipDays(today = new Date()) {
 const start = createLocalDate(2025, 6, 7);
 const current = getStartOfLocalDay(today);
 const diff = current.getTime() - start.getTime();

 return Math.floor(diff / 86400000) + 1;
}
```

### 6.2 周年倒计时

```ts
function getNextAnniversary(today = new Date()) {
 const currentYear = today.getFullYear();
 const thisYearAnniversary = createLocalDate(currentYear, 6, 7);
 const todayStart = getStartOfLocalDay(today);

 if (todayStart.getTime() <= thisYearAnniversary.getTime()) {
 return thisYearAnniversary;
 }

 return createLocalDate(currentYear + 1, 6, 7);
}
```

### 6.3 生日倒计时

生日卡片不要做成完整生日系统，只需要计算下一个生日。

```ts
function getNextBirthday(month: number, day: number, today = new Date()) {
 const year = today.getFullYear();
 const thisYearBirthday = createLocalDate(year, month, day);
 const todayStart = getStartOfLocalDay(today);

 if (todayStart.getTime() <= thisYearBirthday.getTime()) {
 return thisYearBirthday;
 }

 return createLocalDate(year + 1, month, day);
}
```

首页生日提醒固定使用双方生日：我的生日 `2002.02.03`，婷婷生日 `2002.03.18`。PRD 里也明确 V1 生日信息固定写入，不做生日编辑、农历生日、礼物清单和推送通知。

---

## 7. 首页分时问候实现

首页问候不要每次刷新都变，否则会显得跳。

实现方式：

```txt
1. 根据当前小时判断时间段
2. 获取该时间段主文案
3. 从该时间段副文案池里抽一条
4. 抽取结果按 “日期 + 时间段” 缓存
5. 同一天同一时间段保持一致
6. 第二天或时间段变化后重新抽取
```

缓存 key 示例：

```ts
const cacheKey = `${yyyyMMdd}-${timeSlotKey}`;
```

数据结构：

```ts
type TimeSlotKey =
 | "earlyMorning"
 | "morning"
 | "lateMorning"
 | "noon"
 | "afternoon"
 | "evening"
 | "night"
 | "midnight"
 | "deepNight";

type GreetingConfig = {
 slot: TimeSlotKey;
 startHour: number;
 endHour: number;
 mainText: string;
 subTexts: string[];
};
```

随机函数也要稳定，不要直接在组件里 `Math.random()`：

```ts
function pickStableRandom<T>(items: T[], seed: string): T {
 const index = hashString(seed) % items.length;
 return items[index];
}
```

这样每天文案不会乱跳。

---

## 8. 页面实现结构

## 8.1 AppShell

`AppShell` 负责主结构：

```txt
顶部安全区
页面内容区
底部 Tab Bar
iPhone safe-area
```

大致结构：

```tsx
function AppShell() {
 const currentTab = useAppStore((s) => s.appStatus.currentTab);

 return (
 <div className="app-shell">
 <main className="app-main">
 {currentTab === "home" && <HomePage />}
 {currentTab === "travel" && <TravelPage />}
 {currentTab === "love" && <LovePage />}
 {currentTab === "chips" && <ChipsPage />}
 </main>

 <BottomTabBar />
 </div>
 );
}
```

底部 Tab 固定为：首页 / 旅游 / Love / 筹码。PRD 明确 V1 只保留这四个主入口。

---

## 8.2 HomePage

`HomePage` 只做状态展示，不做复杂管理。

组件拆分：

```txt
HomePage
 ├─ GreetingCard
 ├─ RelationshipCard
 ├─ BirthdayCard
 ├─ DailyReminderCard
 ├─ DailyQuoteCard
 └─ QuickActionCards
```

首页不要读取太多列表数据。最多展示：

```txt
旅游已点亮数量
Love 已完成数量
筹码入口
```

不要在首页渲染完整 Travel / Love 列表。

---

## 8.3 TravelPage / LovePage

这两个页面可以共用一套 `BucketList` 逻辑，但文案和状态不同。

抽象组件：

```txt
BucketListPage
BucketItemCard
BucketItemEditor
ProgressCard
```

但不建议过度抽象到看不懂。可以先做两个页面，复用底层小组件。

交互建议：

```txt
新增 / 编辑：底部弹窗 BottomSheet
删除：ConfirmDialog
点亮 / 完成：卡片内按钮
取消状态：卡片内弱按钮
```

状态变化必须即时更新，不要等弹窗关闭后才变化。

---

## 8.4 ChipsPage

`ChipsPage` 结构：

```txt
ChipsPage
 ├─ ChipsSummaryCard
 ├─ PersonChipCard: 冻冻
 ├─ PersonChipCard: 梨梨
 └─ WishRuleCard
```

`PersonChipCard` 接收：

```ts
type PersonChipCardProps = {
 profile: CoupleProfile;
 hands: number;
 onAddOne: () => void;
 onAddFive: () => void;
 onRemoveOne: () => void;
 onReset: () => void;
};
```

`onRemoveOne` 要防止负数：

```ts
Math.max(0, currentHands - 1)
```

清零必须弹确认框。

---

## 9. 视觉技术实现

视觉不要靠零散 CSS 写死。建议先建立设计变量。

视觉规范已经明确：冻梨 OS 的底层是 iOS 高级原生感，像素风只作为情绪层；整体要接近 Apple 小组件、iOS 提醒事项、iOS 日历等轻量原生体验。

`tokens.css` 建议：

```css
:root {
 --color-bg: #F8F7F4;
 --color-surface: #FBFBFD;
 --color-surface-muted: #F4F5F7;

 --color-pear-light: #DCE9D9;
 --color-pear: #BFD3BE;
 --color-pear-active: #AFC7B0;
 --color-pear-dark: #6F8F77;

 --color-pink: #F3D9DF;
 --color-pink-soft: #F6E4E8;
 --color-blue: #DCE8F6;
 --color-purple: #E3DDF2;
 --color-yellow: #F5E8C9;

 --color-text: #1D1D1F;
 --color-text-secondary: #6E6E73;
 --color-text-tertiary: #A1A1A6;
 --color-border: #E5E5EA;

 --radius-lg: 30px;
 --radius-md: 24px;
 --radius-sm: 16px;
 --radius-pill: 999px;

 --shadow-card: 0 18px 45px rgba(29, 29, 31, 0.06);
 --shadow-soft: 0 8px 22px rgba(29, 29, 31, 0.05);

 --page-padding-x: 22px;
 --tabbar-height: 76px;
}
```

基础 Card：

```css
.card {
 background: rgba(251, 251, 253, 0.82);
 border: 1px solid rgba(229, 229, 234, 0.72);
 border-radius: var(--radius-lg);
 box-shadow: var(--shadow-card);
 backdrop-filter: blur(18px);
 -webkit-backdrop-filter: blur(18px);
}
```

按钮：

```css
.primaryButton {
 min-height: 44px;
 border-radius: var(--radius-pill);
 background: var(--color-pear);
 color: var(--color-text);
 font-weight: 600;
}
```

---

## 10. 移动端适配

这个项目必须按手机优先，不是桌面网页缩小版。

关键 CSS：

```css
html,
body,
#root {
 min-height: 100%;
 margin: 0;
 background: var(--color-bg);
}

.app-shell {
 min-height: 100dvh;
 max-width: 430px;
 margin: 0 auto;
 background: var(--color-bg);
 position: relative;
}

.app-main {
 padding: calc(16px + env(safe-area-inset-top)) var(--page-padding-x)
 calc(var(--tabbar-height) + 24px + env(safe-area-inset-bottom));
}

.bottom-tabbar {
 position: fixed;
 left: 50%;
 bottom: calc(12px + env(safe-area-inset-bottom));
 transform: translateX(-50%);
 width: min(calc(100% - 32px), 398px);
 height: var(--tabbar-height);
}
```

注意事项：

```txt
1. 触控区域至少 44px
2. 底部 Tab 不要贴住 Home Indicator
3. 弹窗输入时不要被键盘挡住
4. 列表滚动时底部要留空间
5. 不要使用 hover 作为核心交互
6. iPhone Safari 下要测试 100vh 问题，优先使用 100dvh
```

---

## 11. PWA 实现

PWA 要解决两个目标：

```txt
1. 可以添加到 iPhone 主屏幕
2. 打开后像一个独立 App
```

需要配置：

```txt
manifest.json
service worker
apple-touch-icon
theme-color
display: standalone
```

Manifest 示例：

```json
{
 "name": "冻梨 OS",
 "short_name": "冻梨 OS",
 "description": "只属于两个人的情侣生活小系统",
 "start_url": "/",
 "display": "standalone",
 "background_color": "#F8F7F4",
 "theme_color": "#F8F7F4",
 "icons": [
 {
 "src": "/icons/icon-192.png",
 "sizes": "192x192",
 "type": "image/png"
 },
 {
 "src": "/icons/icon-512.png",
 "sizes": "512x512",
 "type": "image/png"
 }
 ]
}
```

HTML 里补充：

```html
<meta name="theme-color" content="#F8F7F4" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

---

## 12. 动效实现

动效可以用 CSS transition，也可以用 Framer Motion。但第一版不建议做复杂动画系统。

保留几类轻动效即可：

```txt
1. 页面卡片进入：轻微上移 + fade in
2. Tab 切换：图标轻微 scale
3. 点亮 / 完成：卡片状态柔和变化
4. +1 小手：图标轻跳
5. 10 小手变星星：轻微闪一下
6. 弹窗出现：底部滑入
```

不要做：

```txt
复杂粒子
大爆炸
强弹跳
满屏爱心
游戏升级动画
```

视觉规范也明确，动效应轻、慢、柔、有呼吸感，不应抢功能。

---

## 13. 真实头像与像素 IP 的实现

第一版建议先把像素 IP 当成静态资源处理。

资源结构：

```txt
public/
 pixel/
 dongdong/
 idle.png
 happy.png
 hand.png
 star.png
 lili/
 idle.png
 dance.png
 hand.png
 star.png
```

代码层面：

```ts
type PixelAvatarKey =
 | "dongdong-idle"
 | "dongdong-happy"
 | "dongdong-hand"
 | "dongdong-star"
 | "lili-idle"
 | "lili-dance"
 | "lili-hand"
 | "lili-star";
```

`PixelAvatar` 组件：

```tsx
type PixelAvatarProps = {
 character: "dongdong" | "lili";
 state?: "idle" | "happy" | "hand" | "star" | "dance";
 size?: "sm" | "md" | "lg";
};
```

这样以后替换素材时不影响业务逻辑。

不要把角色图片直接写死在 ChipsPage 或 HomePage 里。

---

## 14. 表单与弹窗

新增 / 编辑旅游和 Love 项目时，建议统一使用底部弹窗，而不是新页面。

字段：

```txt
标题 title：必填
描述 description：可选
emoji：可选，有默认值
```

校验：

```txt
标题不能为空
标题建议限制 20 字以内
描述建议限制 60 字以内
emoji 为空时使用默认图标
```

弹窗行为：

```txt
保存成功后关闭
取消时关闭
删除时必须二次确认
输入框聚焦时弹窗不能被键盘完全遮挡
```

---

## 15. 错误处理与边界情况

需要处理这些边界：

```txt
1. 本地存储损坏：回退到默认数据
2. 日期早于 2025-06-07：在一起天数最小显示 1 或开发环境提示
3. 小手不能小于 0
4. 删除项目后列表为空：显示 EmptyState
5. localStorage 不可用：页面仍可用，但提示无法保存
6. 用户清除浏览器数据：重新走首次进入流程
7. 数据版本不一致：执行 migration
```

本地存储读取要加 try/catch：

```ts
function loadPersistedState(): PersistedState | null {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 if (!raw) return null;

 return JSON.parse(raw);
 } catch {
 return null;
 }
}
```

---

## 16. 实现顺序

建议严格按这个顺序做，不要一上来做视觉细节。

### 第一阶段：基础工程

```txt
1. 创建 React + TypeScript + Vite 项目
2. 配置基础 CSS、tokens、移动端 viewport
3. 创建 AppShell
4. 创建 BottomTabBar
5. 四个页面能切换
```

### 第二阶段：状态与存储

```txt
1. 建立 appStore
2. 建立 defaultState
3. 建立 localStorage persistence
4. 建立 migration 结构
5. 验证刷新后数据不丢
```

### 第三阶段：首次进入

```txt
1. PasscodePage
2. 输入 0607 后解锁
3. ProfileSetupPage
4. 完成后进入主界面
5. 二次打开直接进入首页
```

### 第四阶段：首页逻辑

```txt
1. 分时问候
2. 每日稳定随机
3. 在一起天数
4. 周年倒计时
5. 生日提醒
6. 今日提醒
7. 今日一句
```

### 第五阶段：旅游 / Love

```txt
1. 默认数据
2. 列表展示
3. 新增 / 编辑弹窗
4. 删除确认
5. 点亮 / 完成状态
6. 进度统计
```

### 第六阶段：筹码

```txt
1. 双人物卡
2. +1 / +5 / -1
3. 清零确认
4. 小手转小愿望
5. 超过 50 的简化展示
```

### 第七阶段：视觉精修

```txt
1. 卡片质感
2. 圆角和阴影统一
3. 底部 Tab iOS 化
4. 像素 IP 接入
5. 轻动效
6. PWA 图标和启动配置
```

---

## 17. 技术验收标准

第一版写完后，要按技术维度检查：

```txt
1. 首次进入时必须走暗号流程
2. 暗号错误有反馈
3. 暗号正确后进入资料设置
4. 完成设置后进入首页
5. 刷新页面后不重新要求输入暗号
6. 首页日期、生日、周年计算准确
7. 今日随机文案同一天不乱跳
8. 旅游可以新增、编辑、删除、点亮、取消点亮
9. Love 可以新增、编辑、删除、完成、取消完成
10. 筹码可以 +1、+5、-1、清零
11. 小手不会出现负数
12. 10 小手能正确显示为 1 小愿望
13. 所有数据刷新后仍然保留
14. iPhone 底部 Tab 不被 Home Indicator 挡住
15. PWA 可以添加到主屏幕
16. 页面没有横向滚动
17. 列表为空时有空状态
18. 删除和清零都有确认弹窗
```

---

## 18. 最关键的工程判断

这个项目第一版不要按“大 App”做，而要按：

```txt
一个本地状态机
+
四个移动端页面
+
一套 iOS 风格组件系统
+
少量像素情绪资产
+
一组稳定日期 / 随机 / 筹码算法
```

来做。

最重要的技术底线是：

```txt
数据结构清楚
日期计算独立
状态管理集中
组件可复用
本地存储稳定
移动端体验优先
PWA 可安装
不要过度扩展
```

只要这几个点守住，Codex 生成代码时就不容易跑偏。第一版先把它做成一个**能在手机上稳定使用的本地 PWA**，后面再考虑云同步、回忆页、小世界成长和原生 App。
