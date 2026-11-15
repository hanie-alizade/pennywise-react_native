import type { ReactElement } from "react";
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing, touchTargets } from "@/theme";
import { AppText } from "./AppText";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}: ButtonProps): ReactElement {
  const isDisabled = disabled || isLoading;

  const spinnerColor =
    variant === "primary" || variant === "danger"
      ? colors.textOnPrimary
      : colors.primary;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        pressed && !isDisabled && styles[`variant_${variant}_pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          accessibilityLabel="Loading"
          color={spinnerColor}
          size="small"
          style={styles.spinner}
        />
      ) : null}
      <AppText
        style={[styles[`text_${variant}`], textStyle]}
        variant="label"
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: touchTargets.min,
    minWidth: touchTargets.min,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  size_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_primary_pressed: {
    backgroundColor: colors.primaryHover,
  },
  variant_secondary: {
    backgroundColor: colors.primarySoft,
  },
  variant_secondary_pressed: {
    backgroundColor: colors.accentSoft,
  },
  variant_danger: {
    backgroundColor: colors.error,
  },
  variant_danger_pressed: {
    backgroundColor: colors.charcoal,
  },
  variant_ghost: {
    backgroundColor: "transparent",
  },
  variant_ghost_pressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
  text_primary: {
    color: colors.textOnPrimary,
  },
  text_secondary: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.textOnPrimary,
  },
  text_ghost: {
    color: colors.primary,
  },
  spinner: {
    marginRight: spacing.xs,
  },
});
