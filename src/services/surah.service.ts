import apiClient from "@/lib/axios";
import { Surah, UpdateSurahDto } from "@/types/surahs.types";

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

export const surahService = {
  // GET /surahs — public, returns all 114 surahs ordered by id asc
  getAll: async (): Promise<Surah[]> => {
    const response = await apiClient.get("/surahs");
    return unwrap<Surah[]>(response.data);
  },

  // GET /surahs/:id — public
  getById: async (id: number): Promise<Surah> => {
    const response = await apiClient.get(`/surahs/${id}`);
    return unwrap<Surah>(response.data);
  },

  // PUT /surahs/:id — Admin only
  update: async (id: number, data: UpdateSurahDto): Promise<Surah> => {
    const response = await apiClient.put(`/surahs/${id}`, data);
    return unwrap<Surah>(response.data);
  },
};
