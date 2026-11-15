import { z } from "zod";

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z
    .string()
    .url("EXPO_PUBLIC_API_URL must be a valid HTTP or HTTPS URL"),
});

export type Env = z.infer<typeof envSchema>;
