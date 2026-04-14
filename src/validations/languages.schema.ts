import { z } from "zod";

export const languageCreateSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(3, "Code must be at most 3 characters")
    .regex(
      /^[a-z]{2,3}$/,
      "Code must be lowercase letters only (e.g. en, fr, ary)",
    )
    .transform((v) => v.toLowerCase().trim()),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .transform((v) => v.trim()),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export const languageUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .transform((v) => v.trim()),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type LanguageCreateValues = z.infer<typeof languageCreateSchema>;
export type LanguageUpdateValues = z.infer<typeof languageUpdateSchema>;
