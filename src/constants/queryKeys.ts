export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  categories: {
    all: () => ["categories"] as const,
    list: (includeArchived?: boolean) =>
      ["categories", "list", { includeArchived: Boolean(includeArchived) }] as const,
  },
  months: {
    all: () => ["months"] as const,
    list: () => ["months", "list"] as const,
    detail: (year: number, month: number) =>
      ["months", "detail", year, month] as const,
  },
  lines: {
    all: () => ["lines"] as const,
    transactions: (lineId: string) =>
      ["lines", lineId, "transactions"] as const,
  },
} as const;
