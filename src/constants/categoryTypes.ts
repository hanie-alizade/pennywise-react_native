export const CATEGORY_TYPE = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type CategoryTypeValue =
  (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];
