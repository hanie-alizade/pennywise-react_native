import { envSchema } from "@/schemas";
import type { Env } from "@/schemas";

function parseEnv(): Env {
  const rawUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

  const result = envSchema.safeParse({
    EXPO_PUBLIC_API_URL: rawUrl,
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
