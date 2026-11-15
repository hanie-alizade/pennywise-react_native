import { colors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { textVariants, typography } from "./typography";

export * from "./colors";
export * from "./radius";
export * from "./shadows";
export * from "./spacing";
export * from "./typography";

export const theme = {
  mode: "light" as const,
  colors,
  typography,
  textVariants,
  spacing,
  radius,
  shadows,
} as const;

export type PennywiseTheme = typeof theme;
