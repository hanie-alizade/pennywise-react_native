import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppText, Button, Screen } from "@/components/ui";
import { spacing } from "@/theme";

export default function SettingsRoute(): ReactElement {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Settings
      </AppText>
      <AppText style={styles.description} variant="body">
        Account settings and sign-out placeholder (auth logic arrives in Step 3.3).
      </AppText>
      <View style={styles.buttonContainer}>
        <Button
          accessibilityHint="Simulate going to sign-in"
          onPress={() => router.push("/(auth)/sign-in")}
          title="Sign Out (Preview)"
          variant="danger"
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
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
