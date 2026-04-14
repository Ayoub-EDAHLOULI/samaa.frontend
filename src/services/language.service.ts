import apiClient from "@/lib/axios";
import {
  Language,
  CreateLanguageDto,
  UpdateLanguageDto,
} from "@/types/languages.types";

function unwrap<T>(responseData: {
  success: boolean;
  data: T | null;
  message?: string;
}): T {
  if (!responseData.success || responseData.data == null) {
    throw new Error(responseData.message || "Request failed");
  }
  return responseData.data;
}

export const languageService = {
  // GET /languages?activeOnly=true  (public)
  getAll: async (activeOnly = false): Promise<Language[]> => {
    const response = await apiClient.get("/languages", {
      params: activeOnly ? { activeOnly: "true" } : {},
    });
    return unwrap<Language[]>(response.data);
  },

  // GET /languages/default  (public)
  getDefault: async (): Promise<Language> => {
    const response = await apiClient.get("/languages/default");
    return unwrap<Language>(response.data);
  },

  // GET /languages/:code  (public)
  getByCode: async (code: string): Promise<Language> => {
    const response = await apiClient.get(`/languages/${code}`);
    return unwrap<Language>(response.data);
  },

  // POST /languages  (admin)
  create: async (data: CreateLanguageDto): Promise<Language> => {
    const response = await apiClient.post("/languages", data);
    return unwrap<Language>(response.data);
  },

  // PUT /languages/:code  (admin)
  update: async (code: string, data: UpdateLanguageDto): Promise<Language> => {
    const response = await apiClient.put(`/languages/${code}`, data);
    return unwrap<Language>(response.data);
  },

  // DELETE /languages/:code  (admin)
  delete: async (code: string): Promise<void> => {
    const response = await apiClient.delete(`/languages/${code}`);
    unwrap<null>(response.data);
  },
};
