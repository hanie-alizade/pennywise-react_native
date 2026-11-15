import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function RootLayout(): ReactElement {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
      }}
    />
  );
}
