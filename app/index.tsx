import type { ReactElement } from "react";
import { Redirect } from "expo-router";

/**
 * Root index route.
 * In Phase 2, redirects directly to the main app tabs.
 * Authentication gating will be introduced in Step 3.3.
 */
export default function IndexRoute(): ReactElement {
  return <Redirect href="/(app)/(tabs)" />;
}
