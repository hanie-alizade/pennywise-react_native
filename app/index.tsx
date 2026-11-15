import { useState } from "react";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, Screen } from "@/components/ui";
import { colors, radius, spacing } from "@/theme";

/**
 * Temporary UI kit demo screen for Step 1.2.
 * Exercises all AppText variants and Button states.
 * Note: This demo will be replaced by the routing skeleton in Step 2.1.
 */
export default function IndexRoute(): ReactElement {
  const [clickCount, setClickCount] = useState(0);

  const handleIncrement = (): void => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <Screen contentContainerStyle={styles.content} scrollable>
      <View style={styles.header}>
        <AppText style={styles.brandTitle} variant="title">
          Pennywise
        </AppText>
        <AppText variant="label">Phase 1 — Theme and Core UI Demo</AppText>
      </View>

      <View style={styles.card}>
        <AppText style={styles.sectionTitle} variant="label">
          Typography Variants
        </AppText>
        <View style={styles.group}>
          <AppText variant="title">Title Variant (28pt bold)</AppText>
          <AppText variant="body">
            Body Variant: Calm teal and mint design language. This text
            demonstrates standard readable body copy with comfortable line
            height.
          </AppText>
          <AppText variant="label">Label Variant: Section & metadata</AppText>
          <AppText variant="mono">
            Mono Variant: MYR 1,250.00 | 2026-11-15
          </AppText>
        </View>
      </View>

      <View style={styles.card}>
        <AppText style={styles.sectionTitle} variant="label">
          Button States & Variants
        </AppText>
        <View style={styles.group}>
          <Button
            accessibilityHint="Increments test interaction counter"
            onPress={handleIncrement}
            title={`Primary Button (Taps: ${clickCount})`}
            variant="primary"
          />
          <Button
            accessibilityHint="Demonstrates secondary button appearance"
            title="Secondary Button"
            variant="secondary"
          />
          <Button
            accessibilityHint="Demonstrates danger button appearance"
            title="Danger Button"
            variant="danger"
          />
          <Button
            accessibilityHint="Demonstrates ghost button appearance"
            title="Ghost Button"
            variant="ghost"
          />
          <Button
            accessibilityHint="Demonstrates disabled button state"
            disabled
            title="Disabled Button"
            variant="primary"
          />
          <Button
            accessibilityHint="Demonstrates loading spinner button state"
            isLoading
            title="Loading Button"
            variant="primary"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  brandTitle: {
    marginBottom: spacing.xxs,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  group: {
    gap: spacing.sm,
  },
});
