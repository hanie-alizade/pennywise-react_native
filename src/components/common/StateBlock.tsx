import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText, Button } from "@/components/ui";
import { colors, spacing } from "@/theme";

export type StateBlockType = "loading" | "error" | "empty";

export interface StateBlockProps {
  type: StateBlockType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionTitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function StateBlock({
  type,
  title,
  message,
  onRetry,
  actionTitle,
  style,
}: StateBlockProps): ReactElement {
  if (type === "loading") {
    return (
      <View
        accessibilityRole="progressbar"
        style={[styles.container, style]}
      >
        <ActivityIndicator
          accessibilityLabel="Loading"
          color={colors.primary}
          size="large"
          style={styles.spinner}
        />
        {message ? (
          <AppText style={styles.message} variant="body">
            {message}
          </AppText>
        ) : null}
      </View>
    );
  }

  if (type === "error") {
    return (
      <View
        accessibilityRole="alert"
        style={[styles.container, style]}
      >
        <AppText style={styles.errorTitle} variant="title">
          {title ?? "Something went wrong"}
        </AppText>
        {message ? (
          <AppText style={styles.message} variant="body">
            {message}
          </AppText>
        ) : null}
        {onRetry ? (
          <Button
            accessibilityHint="Retries loading data"
            onPress={onRetry}
            style={styles.actionButton}
            title={actionTitle ?? "Try Again"}
            variant="secondary"
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.emptyTitle} variant="title">
        {title ?? "No data yet"}
      </AppText>
      {message ? (
        <AppText style={styles.message} variant="body">
          {message}
        </AppText>
      ) : null}
      {onRetry ? (
        <Button
          accessibilityHint="Refreshes or creates new data"
          onPress={onRetry}
          style={styles.actionButton}
          title={actionTitle ?? "Refresh"}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginBottom: spacing.md,
  },
  errorTitle: {
    color: colors.error,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  emptyTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  message: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  actionButton: {
    marginTop: spacing.xs,
  },
});
