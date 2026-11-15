import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function AppLayout(): ReactElement {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="line/[id]" options={{ title: "Budget Line" }} />
      <Stack.Screen
        name="add-transaction"
        options={{ presentation: "modal", title: "Add Transaction" }}
      />
      <Stack.Screen
        name="new-month"
        options={{ presentation: "modal", title: "New Month" }}
      />
    </Stack>
  );
}
