import { colors } from "./colors";

/**
 * Keep shadows subtle. Avoid glow, colored shadows, and glossy effects.
 * Use platform-appropriate shadow props where needed.
 */
export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
  },
} as const;

export type Shadows = typeof shadows;
