import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppText, Button, Card, Screen } from "@/components/ui";
import { colors, spacing, typography } from "@/theme";

export default function LineDetailRoute(): ReactElement {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Budget Line
      </AppText>

      <Card padding="md" style={styles.card} variant="default">
        <AppText style={styles.label} variant="label">
          Budget Line ID
        </AppText>
        <AppText style={styles.idText} variant="mono">
          {id ?? "No ID provided"}
        </AppText>
        <AppText style={styles.description} variant="body">
          Transactions and expected amounts for this line will be integrated in
          Phase 5.
        </AppText>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          accessibilityHint="Return to previous screen"
          onPress={() => router.back()}
          title="Back"
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  idText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
