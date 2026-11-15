import type { ReactElement } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";
import { AppText } from "./AppText";

export type BadgeVariant =
  | "default"
  | "income"
  | "expense"
  | "warning"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  label,
  variant = "default",
  size = "md",
  style,
  textStyle,
}: BadgeProps): ReactElement {
  return (
    <View
      accessibilityRole="text"
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        style,
      ]}
    >
      <AppText
        style={[
          styles.text,
          styles[`text_${variant}`],
          styles[`textSize_${size}`],
          textStyle,
        ]}
        variant="label"
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  size_sm: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
  },
  size_md: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  variant_default: {
    backgroundColor: colors.primarySoft,
  },
  variant_income: {
    backgroundColor: colors.incomeSoft,
  },
  variant_expense: {
    backgroundColor: colors.expenseSoft,
  },
  variant_warning: {
    backgroundColor: colors.warningSoft,
  },
  variant_info: {
    backgroundColor: colors.infoSoft,
  },
  variant_neutral: {
    backgroundColor: colors.surfaceSecondary,
  },
  text: {
    fontWeight: "600",
  },
  text_default: {
    color: colors.primary,
  },
  text_income: {
    color: colors.income,
  },
  text_expense: {
    color: colors.expense,
  },
  text_warning: {
    color: colors.warning,
  },
  text_info: {
    color: colors.info,
  },
  text_neutral: {
    color: colors.textSecondary,
  },
  textSize_sm: {
    fontSize: typography.fontSize.xs,
  },
  textSize_md: {
    fontSize: typography.fontSize.sm,
  },
});
