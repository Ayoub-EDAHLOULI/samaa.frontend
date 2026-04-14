import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

export const translationSchema = z.object({
  name: z.string().max(200, "Max 200 characters").optional().or(z.literal("")),
  nationality: z
    .string()
    .max(100, "Max 100 characters")
    .optional()
    .or(z.literal("")),
  shortBio: z
    .string()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
  biography: z
    .string()
    .max(5000, "Max 5000 characters")
    .optional()
    .or(z.literal("")),
  seoTitle: z
    .string()
    .max(200, "Max 200 characters")
    .optional()
    .or(z.literal("")),
  tags: z
    .string()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
});

export type TranslationFormValues = z.infer<typeof translationSchema>;

export const reciterFormSchema = z
  .object({
    slug: z
      .string()
      .min(2, "Min 2 characters")
      .max(150, "Max 150 characters")
      .regex(slugRegex, "Only lowercase letters, numbers, and hyphens"),
    countryCode: z
      .string()
      .max(3, "Max 3 characters")
      .optional()
      .or(z.literal("")),
    style: z
      .string()
      .max(100, "Max 100 characters")
      .optional()
      .or(z.literal("")),
    spotifyUrl: z
      .union([z.literal(""), z.string().regex(/^https?:\/\/.+/, "Invalid Spotify URL")])
      .optional(),
    youtubeUrl: z
      .union([z.literal(""), z.string().regex(/^https?:\/\/.+/, "Invalid YouTube URL")])
      .optional(),
    image: z.any().optional(),
    translations: z.record(z.string(), translationSchema),
  })
  .refine(
    (data) =>
      Object.values(data.translations).some(
        (t) => t?.name && t.name.trim().length >= 2,
      ),
    {
      message: "At least one translation must include a name (min 2 characters)",
      path: ["translations"],
    },
  );

export type ReciterFormValues = z.infer<typeof reciterFormSchema>;
