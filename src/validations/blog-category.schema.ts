import { z } from "zod";

const handleRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogCategoryTranslationSchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(500).optional().or(z.literal("")),
});

export type BlogCategoryTranslationFormValues = z.infer<
  typeof blogCategoryTranslationSchema
>;

export const blogCategoryFormSchema = z
  .object({
    handle: z
      .string()
      .min(2, "Handle must be at least 2 characters")
      .max(200, "Handle must be at most 200 characters")
      .regex(handleRegex, "Handle must be lowercase letters, numbers, and hyphens only"),
    isActive: z.boolean(),
    translations: z.record(z.string(), blogCategoryTranslationSchema),
  })
  .refine(
    (data) =>
      Object.values(data.translations).some(
        (t) => t?.title && t.title.trim().length >= 2,
      ),
    {
      message: "At least one translation must include a title (min 2 characters)",
      path: ["translations"],
    },
  );

export type BlogCategoryFormValues = z.infer<typeof blogCategoryFormSchema>;
