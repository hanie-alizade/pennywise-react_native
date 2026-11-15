import { useState } from "react";
import type { ReactElement } from "react";
import type {
  KeyboardTypeOptions,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing, touchTargets, typography } from "@/theme";
import { AppText } from "./AppText";

export interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
}

export function TextField({
  label,
  value,
  onChangeText,
  error,
  helperText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  autoCorrect = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  inputStyle,
  onFocus,
  onBlur,
}: TextFieldProps): ReactElement {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <AppText style={styles.label} variant="label">
          {label}
        </AppText>
      ) : null}

      <TextInput
        accessibilityHint={error ?? helperText ?? accessibilityHint}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={!disabled}
        keyboardType={keyboardType}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        value={value}
      />

      {hasError ? (
        <AppText style={styles.errorText} variant="label">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText style={styles.helperText} variant="label">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xxs,
    color: colors.textPrimary,
  },
  input: {
    minHeight: touchTargets.min,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceSecondary,
    opacity: 0.6,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xxs,
  },
  helperText: {
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
});
