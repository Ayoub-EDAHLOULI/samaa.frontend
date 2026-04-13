import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

export const reciterFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(slugRegex, "Only lowercase, numbers, and hyphens"),
  biography: z.string().max(5000).optional().or(z.literal("")),
  nationality: z.string().max(100).optional().or(z.literal("")),
  spotifyUrl: z
    .union([z.literal(""), z.string().url("Invalid URL")])
    .optional(),
  youtubeUrl: z
    .union([z.literal(""), z.string().url("Invalid URL")])
    .optional(),
  // We use any() here because HTML file inputs return a FileList in the browser
  image: z.any().optional(),
});

export type ReciterFormValues = z.infer<typeof reciterFormSchema>;
