export type TabId = "home" | "travel" | "love" | "chips";
export type PersonId = "dongdong" | "lili";
export type CoupleRole = "me" | "partner";

export type CoupleProfile = {
  id: PersonId;
  role: CoupleRole;
  displayName: string;
  birthday: string;
  pixelAvatarKey: string;
  realAvatarUrl?: string;
};

export type ProfilePatch = Partial<
  Pick<CoupleProfile, "displayName" | "birthday" | "pixelAvatarKey" | "realAvatarUrl">
>;

export type DailyCache = {
  key: string;
  label?: string;
  value: string;
};

export type TravelStatus = "want" | "visited";

export type TravelItem = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  status: TravelStatus;
  createdAt: string;
  updatedAt: string;
};

export type LoveStatus = "todo" | "done";

export type LoveItem = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  status: LoveStatus;
  createdAt: string;
  updatedAt: string;
};

export type MemoItem = {
  id: string;
  text: string;
  imageDataUrl?: string;
  imageName?: string;
  createdAt: string;
  updatedAt: string;
};

export type TravelItemInput = Pick<TravelItem, "title" | "description" | "emoji">;
export type TravelItemPatch = Partial<TravelItemInput>;
export type LoveItemInput = Pick<LoveItem, "title" | "description" | "emoji">;
export type LoveItemPatch = Partial<LoveItemInput>;
export type MemoItemInput = Pick<MemoItem, "text" | "imageDataUrl" | "imageName">;
export type MemoItemPatch = Partial<MemoItemInput>;

export type AppDataState = {
  version: number;
  updatedAt: string;
  appStatus: {
    hasUnlocked: boolean;
    hasCompletedProfileSetup: boolean;
    selectedPersonId: PersonId | null;
    currentTab: TabId;
  };
  profiles: Record<PersonId, CoupleProfile>;
  home: {
    dailyGreetingCache: DailyCache | null;
    dailyQuoteCache: DailyCache | null;
    dailyReminderCache: DailyCache | null;
  };
  travelItems: TravelItem[];
  loveItems: LoveItem[];
  memoItems: MemoItem[];
  chips: {
    dongdongHands: number;
    liliHands: number;
  };
};

export type AppActions = {
  setCurrentTab: (tab: TabId) => void;
  unlockApp: () => void;
  logoutApp: () => void;
  completeRoleSelection: (personId: PersonId) => void;
  completeProfileSetup: () => void;
  updateProfile: (profileId: PersonId, patch: ProfilePatch) => void;
  setHomeCache: (
    cacheName: "dailyGreetingCache" | "dailyQuoteCache" | "dailyReminderCache",
    cache: DailyCache,
  ) => void;
  resetAppData: () => void;
  addTravelItem: (input: TravelItemInput) => void;
  updateTravelItem: (id: string, patch: TravelItemPatch) => void;
  deleteTravelItem: (id: string) => void;
  markTravelVisited: (id: string) => void;
  undoTravelVisited: (id: string) => void;
  addLoveItem: (input: LoveItemInput) => void;
  updateLoveItem: (id: string, patch: LoveItemPatch) => void;
  deleteLoveItem: (id: string) => void;
  markLoveDone: (id: string) => void;
  undoLoveDone: (id: string) => void;
  addMemoItem: (input: MemoItemInput) => void;
  updateMemoItem: (id: string, patch: MemoItemPatch) => void;
  deleteMemoItem: (id: string) => void;
  addHands: (personId: PersonId, amount: number) => void;
  removeOneHand: (personId: PersonId) => void;
  resetHands: (personId: PersonId) => void;
};

export type AppState = AppDataState & AppActions;
export type PersistedState = AppDataState;
