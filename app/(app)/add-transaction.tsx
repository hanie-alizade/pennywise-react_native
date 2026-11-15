import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppText, Button, Card, Screen } from "@/components/ui";
import { colors, spacing } from "@/theme";

export default function AddTransactionModal(): ReactElement {
  const router = useRouter();
  const { lineId } = useLocalSearchParams<{ lineId?: string }>();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Add Transaction
      </AppText>

      <Card padding="md" style={styles.card} variant="default">
        <AppText style={styles.label} variant="label">
          Modal Target
        </AppText>
        <AppText style={styles.info} variant="body">
          {lineId
            ? `Adding transaction for Line: ${lineId}`
            : "No lineId specified. Transaction form will be implemented in Step 5.1."}
        </AppText>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          accessibilityHint="Close this modal"
          onPress={() => router.back()}
          title="Dismiss Modal"
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
  info: {
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
