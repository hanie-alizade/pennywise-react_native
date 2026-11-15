import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppText, Button, Card, Screen } from "@/components/ui";
import { colors, spacing } from "@/theme";

export default function NewMonthModal(): ReactElement {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        New Month
      </AppText>

      <Card padding="md" style={styles.card} variant="default">
        <AppText style={styles.label} variant="label">
          Create Month
        </AppText>
        <AppText style={styles.info} variant="body">
          Month creation with optional copy-from selector will be implemented in
          Step 5.3.
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
