import type { ReactElement } from "react";
import type { TextProps } from "react-native";
import { StyleSheet, Text } from "react-native";
import type { TextVariant } from "@/theme";
import { textVariants } from "@/theme";

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export function AppText({
  variant = "body",
  style,
  children,
  allowFontScaling = true,
  ...rest
}: AppTextProps): ReactElement {
  return (
    <Text
      allowFontScaling={allowFontScaling}
      style={[styles[variant], style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: textVariants.title,
  body: textVariants.body,
  label: textVariants.label,
  mono: textVariants.mono,
});
