export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
} as const;

export const touchTargets = {
  min: 44,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
