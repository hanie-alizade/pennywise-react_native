/**
 * Pennywise — Light Theme Colors
 *
 * Visual direction:
 * - Calm, restrained teal + mint
 * - White / near-white surfaces
 * - Muted slate support colors
 * - No neon, glossy gradients, glow effects, or pure-black UI
 */

export const colors = {
  // Brand palette
  primary: "#075B59", // Deep teal: primary actions, selected states
  primaryHover: "#064D4B", // Slightly deeper teal for pressed states
  primarySoft: "#E6F2F0", // Subtle teal-tinted background
  accent: "#55BFAF", // Muted mint: secondary highlights and charts
  accentSoft: "#E8F5F2", // Very light mint background

  // App surfaces
  background: "#F7F8F7", // Main app background
  surface: "#FFFFFF", // Cards, sheets, inputs
  surfaceSecondary: "#F1F4F3",
  surfaceElevated: "#FFFFFF",

  // Text
  textPrimary: "#172A2A",
  textSecondary: "#647575",
  textTertiary: "#8A9998",
  textOnPrimary: "#FFFFFF",
  textOnDarkSurface: "#FFFFFF",

  // Borders and separators
  border: "#E3EAE8",
  borderStrong: "#CBD8D5",
  divider: "#E9EEEC",

  // Financial meaning
  income: "#27866F", // Calm green, not neon
  incomeSoft: "#E9F4EF",
  expense: "#C96F68", // Muted coral
  expenseSoft: "#F9EEEC",
  warning: "#B9853D", // Muted amber
  warningSoft: "#F8F1E5",
  info: "#647D98", // Muted slate blue
  infoSoft: "#EDF1F5",

  // Supporting palette
  support: "#64758B", // Slate blue from the reference direction
  supportSoft: "#EEF1F5",
  charcoal: "#293235", // For restrained dark details, not page backgrounds

  // Feedback
  success: "#27866F",
  successSoft: "#E9F4EF",
  error: "#BD5E59",
  errorSoft: "#F9ECEB",

  // Shadows
  shadow: "#263634",
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
