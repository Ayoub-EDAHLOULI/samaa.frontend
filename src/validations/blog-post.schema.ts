import { z } from "zod";

const handleRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogPostTranslationSchema = z.object({
  title: z
    .string()
    .max(500, "Title must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  excerpt: z
    .string()
    .max(1000, "Excerpt must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  metaTitle: z
    .string()
    .max(100, "Meta title must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(500, "Meta description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  tags: z
    .string()
    .max(500, "Tags must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type BlogPostTranslationFormValues = z.infer<
  typeof blogPostTranslationSchema
>;

export const blogPostFormSchema = z
  .object({
    handle: z
      .string()
      .min(2, "Handle must be at least 2 characters")
      .max(200, "Handle must be at most 200 characters")
      .regex(handleRegex, "Lowercase letters, numbers, and hyphens only"),
    categoryId: z
      .number({ message: "Category is required" })
      .int({ message: "Category is required" })
      .positive("Category is required"),
    isPublished: z.boolean(),
    publishedAt: z.string().optional().or(z.literal("")),
    readTimeMinutes: z.number().int().min(1).optional().nullable(),
    image: z.any().optional(),
    translations: z.record(z.string(), blogPostTranslationSchema),
  })
  .refine(
    (data) =>
      Object.values(data.translations).some(
        (t) => t?.title?.trim() && t?.content?.trim(),
      ),
    {
      message: "At least one translation must have a title and content",
      path: ["translations"],
    },
  );

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
