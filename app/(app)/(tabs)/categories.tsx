import type { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { AppText, Screen } from "@/components/ui";
import { spacing } from "@/theme";

export default function CategoriesRoute(): ReactElement {
  return (
    <Screen style={styles.container}>
      <AppText style={styles.title} variant="title">
        Categories
      </AppText>
      <AppText style={styles.description} variant="body">
        Categories and subcategories management placeholder (data integration arrives in Step 3.1).
      </AppText>
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
});
