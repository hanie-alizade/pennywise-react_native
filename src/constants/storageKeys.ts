export const STORAGE_KEYS = {
  REFRESH_TOKEN: "pennywise_refresh_token",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
