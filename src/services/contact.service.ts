import apiClient from "@/lib/axios";
import { ContactFormValues } from "@/validations/contact.schema";

function unwrap(responseData: {
  success: boolean;
  data: unknown;
  message?: string;
}): void {
  if (!responseData.success) {
    throw new Error(responseData.message || "Request failed");
  }
}

export const contactService = {
  submit: async (data: ContactFormValues): Promise<void> => {
    const res = await apiClient.post("/contact", data);
    unwrap(res.data);
  },
};
