import type { ReactElement, ReactNode } from "react";
import type {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet, View } from "react-native";
import type { SpacingKey } from "@/theme";
import { colors, radius, shadows, spacing } from "@/theme";

export type CardVariant = "default" | "elevated" | "outlined";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: SpacingKey;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: CardProps): ReactElement {
  const cardStyles = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`padding_${padding}`],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          cardStyles,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  variant_default: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  variant_outlined: {
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  variant_elevated: {
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.card,
  },
  pressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  padding_xxs: { padding: spacing.xxs },
  padding_xs: { padding: spacing.xs },
  padding_sm: { padding: spacing.sm },
  padding_md: { padding: spacing.md },
  padding_lg: { padding: spacing.lg },
  padding_xl: { padding: spacing.xl },
  "padding_2xl": { padding: spacing["2xl"] },
  "padding_3xl": { padding: spacing["3xl"] },
  "padding_4xl": { padding: spacing["4xl"] },
});
