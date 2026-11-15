import { z } from "zod";

export const PRODUCTION_API_URL = "https://pennywise-api-two.vercel.app";

export const envSchema = z
  .object({
    EXPO_PUBLIC_API_URL: z
      .string()
      .url("EXPO_PUBLIC_API_URL must be a valid HTTP or HTTPS URL"),
    EXPO_PUBLIC_USE_MOCK: z
      .enum(["true", "false"])
      .default("false"),
  })
  .superRefine((data, ctx) => {
    // In React Native / Metro, __DEV__ is true in development and false in production builds
    const isProduction =
      typeof __DEV__ !== "undefined"
        ? !__DEV__
        : process.env.NODE_ENV === "production";

    if (isProduction) {
      if (data.EXPO_PUBLIC_USE_MOCK === "true") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "EXPO_PUBLIC_USE_MOCK cannot be 'true' in production builds. Production must connect to the real backend.",
          path: ["EXPO_PUBLIC_USE_MOCK"],
        });
      }

      const isLocalhost =
        data.EXPO_PUBLIC_API_URL.includes("localhost") ||
        data.EXPO_PUBLIC_API_URL.includes("127.0.0.1");

      if (isLocalhost || !data.EXPO_PUBLIC_API_URL.startsWith("https://")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Production API URL must use HTTPS and cannot point to localhost or an offline mock server.",
          path: ["EXPO_PUBLIC_API_URL"],
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;
