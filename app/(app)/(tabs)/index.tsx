import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppText, Button, Card, Screen } from "@/components/ui";
import { colors, spacing } from "@/theme";

export default function OverviewRoute(): ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams<{ year?: string; month?: string }>();

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString();

  const selectedYear = params.year ?? currentYear;
  const selectedMonth = params.month ?? currentMonth;

  return (
    <Screen contentContainerStyle={styles.container} scrollable>
      <View style={styles.header}>
        <AppText style={styles.title} variant="title">
          Month Overview
        </AppText>
        <AppText variant="label">Phase 2 — Routing Skeleton</AppText>
      </View>

      <Card padding="md" style={styles.card} variant="elevated">
        <AppText style={styles.cardHeader} variant="label">
          Route Parameters
        </AppText>
        <AppText style={styles.paramDisplay} variant="mono">
          year: {selectedYear} | month: {selectedMonth}
        </AppText>
        <AppText style={styles.paramNote} variant="body">
          {params.year && params.month
            ? "Parameters loaded from URL query params."
            : "Defaulting to current local calendar month."}
        </AppText>

        <Button
          accessibilityHint="Updates route query parameters to 2026 and 10"
          onPress={() => router.setParams({ year: "2026", month: "10" })}
          style={styles.actionButton}
          title="Set ?year=2026&month=10"
          variant="secondary"
        />
      </Card>

      <Card padding="md" style={styles.card} variant="default">
        <AppText style={styles.cardHeader} variant="label">
          Route Navigation Verification
        </AppText>
        <View style={styles.buttonGroup}>
          <Button
            accessibilityHint="Navigate to line 123"
            onPress={() => router.push("/(app)/line/123")}
            title="Open /line/123"
            variant="primary"
          />
          <Button
            accessibilityHint="Open add transaction modal"
            onPress={() => router.push("/(app)/add-transaction")}
            title="Open Add Transaction Modal"
            variant="secondary"
          />
          <Button
            accessibilityHint="Open new month modal"
            onPress={() => router.push("/(app)/new-month")}
            title="Open New Month Modal"
            variant="secondary"
          />
          <Button
            accessibilityHint="Navigate to sign in screen"
            onPress={() => router.push("/(auth)/sign-in")}
            title="Preview Auth: Sign In"
            variant="ghost"
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xxs,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  paramDisplay: {
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  paramNote: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  actionButton: {
    marginTop: spacing.xs,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
