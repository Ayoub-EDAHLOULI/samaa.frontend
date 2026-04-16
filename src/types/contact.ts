export const CONTACT_SUBJECTS = [
  "general",
  "support",
  "reciter",
  "partnership",
  "press",
  "careers",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export interface ContactFormData {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
}
