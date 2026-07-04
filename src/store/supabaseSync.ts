import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import type { StoreApi } from "zustand/vanilla";
import { createDefaultState } from "./defaultState";
import { normalizePersistedState } from "./migrations";
import type { AppDataState, AppState, CoupleProfile, PersonId } from "./types";

export type CloudState = {
  version: number;
  updatedAt: string;
  profiles: Record<PersonId, Omit<CoupleProfile, "role">>;
  home: AppDataState["home"];
  travelItems: AppDataState["travelItems"];
  loveItems: AppDataState["loveItems"];
  memoItems: AppDataState["memoItems"];
  chips: AppDataState["chips"];
};

type SyncStore = Pick<StoreApi<AppState>, "getState" | "setState" | "subscribe">;

const TABLE_NAME = "couple_app_state";
const SINGLETON_ID = "shared";
const DEBOUNCE_MS = 350;

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function createSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function toCloudState(state: AppDataState): CloudState {
  return {
    version: state.version,
    updatedAt: state.updatedAt,
    profiles: {
      dongdong: {
        id: state.profiles.dongdong.id,
        displayName: state.profiles.dongdong.displayName,
        birthday: state.profiles.dongdong.birthday,
        pixelAvatarKey: state.profiles.dongdong.pixelAvatarKey,
        realAvatarUrl: state.profiles.dongdong.realAvatarUrl,
      },
      lili: {
        id: state.profiles.lili.id,
        displayName: state.profiles.lili.displayName,
        birthday: state.profiles.lili.birthday,
        pixelAvatarKey: state.profiles.lili.pixelAvatarKey,
        realAvatarUrl: state.profiles.lili.realAvatarUrl,
      },
    },
    home: state.home,
    travelItems: state.travelItems,
    loveItems: state.loveItems,
    memoItems: state.memoItems,
    chips: state.chips,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCloudState(value: unknown): CloudState {
  const base = isObject(value)
    ? value
    : { ...createDefaultState(), appStatus: undefined };
  const local = normalizePersistedState(base);

  return toCloudState(local);
}

function mergeCloudIntoLocal(state: AppState, cloudState: CloudState): AppState {
  return {
    ...state,
    version: cloudState.version,
    updatedAt: cloudState.updatedAt,
    profiles: {
      dongdong: {
        ...state.profiles.dongdong,
        ...cloudState.profiles.dongdong,
        role: state.profiles.dongdong.role,
      },
      lili: {
        ...state.profiles.lili,
        ...cloudState.profiles.lili,
        role: state.profiles.lili.role,
      },
    },
    home: cloudState.home,
    travelItems: cloudState.travelItems,
    loveItems: cloudState.loveItems,
    memoItems: cloudState.memoItems,
    chips: cloudState.chips,
  };
}

function compareTimestamp(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  return a > b ? 1 : -1;
}

function sameCloudState(a: CloudState, b: CloudState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function startSupabaseSync(store: SyncStore): () => void {
  const client = createSupabaseClient();
  if (!client) {
    return () => {};
  }

  let disposed = false;
  let applyingRemote = false;
  let initialized = false;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  let lastQueuedState = toCloudState(store.getState());
  let channel: RealtimeChannel | null = null;

  const clearPending = () => {
    if (pendingTimer != null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  };

  const pushCloudState = async (cloudState: CloudState) => {
    if (disposed) {
      return;
    }

    const { error } = await client
      .from(TABLE_NAME)
      .upsert({ id: SINGLETON_ID, state: cloudState }, { onConflict: "id" })
      .select("updated_at")
      .single();

    if (error && !disposed) {
      console.error("Supabase sync write failed", error);
    }
  };

  const schedulePush = (cloudState: CloudState) => {
    if (disposed) {
      return;
    }

    lastQueuedState = cloudState;
    clearPending();
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      void pushCloudState(lastQueuedState);
    }, DEBOUNCE_MS);
  };

  const applyRemoteState = (cloudState: CloudState) => {
    applyingRemote = true;
    store.setState((state) => mergeCloudIntoLocal(state, cloudState));
    applyingRemote = false;
    lastQueuedState = cloudState;
  };

  const loadInitialState = async () => {
    const startTimestamp = store.getState().updatedAt;

    const { data, error } = await client
      .from(TABLE_NAME)
      .select("state, updated_at")
      .eq("id", SINGLETON_ID)
      .maybeSingle();

    if (disposed) {
      return;
    }

    if (error && error.code !== "PGRST116") {
      console.error("Supabase sync load failed", error);
      initialized = true;
      schedulePush(toCloudState(store.getState()));
      return;
    }

    const currentState = store.getState();
    const currentSharedTimestamp = currentState.updatedAt;
    const currentCloudState = toCloudState(currentState);

    if (!data?.state) {
      await pushCloudState(currentCloudState);
      initialized = true;
      return;
    }

    const remoteState = normalizeCloudState(data.state);
    const remoteTimestamp = typeof data.updated_at === "string" ? data.updated_at : remoteState.updatedAt;

    if (compareTimestamp(currentSharedTimestamp, startTimestamp) !== 0) {
      await pushCloudState(currentCloudState);
      initialized = true;
      return;
    }

    if (compareTimestamp(remoteTimestamp, currentSharedTimestamp) > 0) {
      applyRemoteState({ ...remoteState, updatedAt: remoteTimestamp });
    } else if (!sameCloudState(remoteState, currentCloudState)) {
      await pushCloudState(currentCloudState);
    }

    initialized = true;
  };

  void loadInitialState();

  const unsubscribeStore = store.subscribe((state, previousState) => {
    if (disposed || applyingRemote || !initialized) {
      return;
    }

    const nextCloudState = toCloudState(state);
    const previousCloudState = toCloudState(previousState);

    if (sameCloudState(nextCloudState, previousCloudState)) {
      return;
    }

    schedulePush(nextCloudState);
  });

  channel = client
    .channel(`dongli-os-${SINGLETON_ID}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: TABLE_NAME,
        filter: `id=eq.${SINGLETON_ID}`,
      },
      (payload) => {
        if (disposed) {
          return;
        }

        const remoteRow = payload.new as { state?: unknown; updated_at?: string } | null;
        if (!remoteRow?.state) {
          return;
        }

        const remoteState = normalizeCloudState(remoteRow.state);
        const remoteTimestamp = typeof remoteRow.updated_at === "string" ? remoteRow.updated_at : remoteState.updatedAt;
        const currentTimestamp = store.getState().updatedAt;

        if (compareTimestamp(remoteTimestamp, currentTimestamp) > 0) {
          applyRemoteState({ ...remoteState, updatedAt: remoteTimestamp });
        }
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.error("Supabase realtime status", status);
      }
    });

  return () => {
    disposed = true;
    clearPending();
    unsubscribeStore();
    if (channel) {
      void client.removeChannel(channel);
    }
  };
}
