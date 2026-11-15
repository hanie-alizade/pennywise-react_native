import { z } from "zod";

export const errorDetailSchema = z.object({
  path: z.string().optional(),
  message: z.string().optional(),
});

export const errorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(errorDetailSchema).optional(),
});

export const errorSchema = z.object({
  error: errorPayloadSchema,
});

export type ErrorDetail = z.infer<typeof errorDetailSchema>;
export type ErrorPayload = z.infer<typeof errorPayloadSchema>;
export type ErrorResponse = z.infer<typeof errorSchema>;
