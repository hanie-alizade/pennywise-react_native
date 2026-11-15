import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppText, Button, Screen } from "@/components/ui";
import { spacing } from "@/theme";

export default function SignUpRoute(): ReactElement {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Sign Up
      </AppText>
      <AppText style={styles.description} variant="body">
        Sign up placeholder screen (auth forms arrive in Step 3.3).
      </AppText>
      <View style={styles.buttonGroup}>
        <Button
          accessibilityHint="Go back to sign in screen"
          onPress={() => router.back()}
          title="Already have an account? Sign In"
          variant="secondary"
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
