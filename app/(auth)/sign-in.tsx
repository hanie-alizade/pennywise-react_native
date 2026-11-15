import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppText, Button, Screen } from "@/components/ui";
import { spacing } from "@/theme";

export default function SignInRoute(): ReactElement {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Sign In
      </AppText>
      <AppText style={styles.description} variant="body">
        Sign in placeholder screen (auth forms arrive in Step 3.3).
      </AppText>
      <View style={styles.buttonGroup}>
        <Button
          accessibilityHint="Go to sign up screen"
          onPress={() => router.push("/(auth)/sign-up")}
          title="Create an Account"
          variant="secondary"
        />
        <Button
          accessibilityHint="Return to main app"
          onPress={() => router.replace("/(app)/(tabs)")}
          title="Back to App"
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
