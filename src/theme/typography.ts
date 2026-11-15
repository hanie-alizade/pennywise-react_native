import { Platform } from "react-native";
import { colors } from "./colors";

export const typography = {
  fontFamily: {
    // Replace with bundled font names if a custom font is added later.
    regular: undefined,
    medium: undefined,
    semibold: undefined,
    bold: undefined,
    mono: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    "2xl": 28,
    display: 32,
  },
  lineHeight: {
    compact: 1.2,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;

export const textVariants = {
  title: {
    fontSize: typography.fontSize["2xl"],
    lineHeight: Math.round(typography.fontSize["2xl"] * typography.lineHeight.compact),
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: typography.fontSize.md,
    lineHeight: Math.round(typography.fontSize.md * typography.lineHeight.normal),
    fontWeight: "400" as const,
    color: colors.textPrimary,
  },
  label: {
    fontSize: typography.fontSize.sm,
    lineHeight: Math.round(typography.fontSize.sm * typography.lineHeight.normal),
    fontWeight: "600" as const,
    color: colors.textSecondary,
  },
  mono: {
    fontSize: typography.fontSize.sm,
    lineHeight: Math.round(typography.fontSize.sm * typography.lineHeight.normal),
    fontFamily: typography.fontFamily.mono,
    color: colors.textPrimary,
  },
} as const;

export type Typography = typeof typography;
export type TextVariant = keyof typeof textVariants;
