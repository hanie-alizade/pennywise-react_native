import { PRODUCTION_API_URL, envSchema } from "@/schemas";
import type { Env } from "@/schemas";

function parseEnv(): Env {
  const rawUseMock = process.env.EXPO_PUBLIC_USE_MOCK ?? "false";
  const isMock = rawUseMock === "true";

  const defaultUrl = isMock
    ? "http://localhost:3000"
    : PRODUCTION_API_URL;

  const rawUrl = process.env.EXPO_PUBLIC_API_URL ?? defaultUrl;

  const result = envSchema.safeParse({
    EXPO_PUBLIC_API_URL: rawUrl,
    EXPO_PUBLIC_USE_MOCK: rawUseMock,
  });

  if (!result.success) {
    const formatted = result.error.format();
    throw new Error(
      `Invalid environment variable configuration: ${JSON.stringify(formatted)}`
    );
  }

  return result.data;
}

export const env = parseEnv();
