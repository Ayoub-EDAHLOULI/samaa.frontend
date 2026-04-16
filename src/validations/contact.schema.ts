import { z } from "zod";
import { CONTACT_SUBJECTS } from "@/types/contact";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be at most 5000 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
