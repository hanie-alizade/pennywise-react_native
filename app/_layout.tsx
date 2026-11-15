import type { ReactElement } from "react";
import { Stack } from "expo-router";
import { Providers } from "@/providers";

export default function RootLayout(): ReactElement {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </Providers>
  );
}
