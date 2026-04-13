import apiClient from "@/lib/axios";
import { Reciter, PaginatedReciters } from "@/types/reciters.types";
import { ReciterFormValues } from "@/validations/reciters.schema";

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

// Build FormData from validated form values.
// Browser/axios sets the correct Content-Type + boundary automatically.
function toFormData(data: ReciterFormValues): FormData {
  const fd = new FormData();
  fd.append("name", data.name);
  fd.append("slug", data.slug);
  if (data.biography) fd.append("biography", data.biography);
  if (data.nationality) fd.append("nationality", data.nationality);
  if (data.spotifyUrl) fd.append("spotifyUrl", data.spotifyUrl);
  if (data.youtubeUrl) fd.append("youtubeUrl", data.youtubeUrl);
  if (data.image instanceof FileList && data.image.length > 0) {
    fd.append("image", data.image[0]);
  }
  return fd;
}

export const reciterService = {
  // GET /reciters?page=&limit=&search= (public)
  getPaginated: async (
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedReciters> => {
    const params: Record<string, string | number> = { page, limit };
    if (search?.trim()) params.search = search.trim();
    const response = await apiClient.get("/reciters", { params });
    return unwrap<PaginatedReciters>(response.data);
  },

  // GET /reciters/id/:id — Admin only
  getById: async (id: string): Promise<Reciter> => {
    const response = await apiClient.get(`/reciters/id/${id}`);
    return unwrap<Reciter>(response.data);
  },

  // POST /reciters — Admin, multipart/form-data
  create: async (data: ReciterFormValues): Promise<Reciter> => {
    const response = await apiClient.post("/reciters", toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<Reciter>(response.data);
  },

  // PUT /reciters/:id — Admin, multipart/form-data
  update: async (id: string, data: ReciterFormValues): Promise<Reciter> => {
    const response = await apiClient.put(`/reciters/${id}`, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<Reciter>(response.data);
  },

  // DELETE /reciters/:id — Admin
  // Backend blocks delete if reciter has recognitions (returns 409 with explanation)
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/reciters/${id}`);
    unwrap<null>(response.data);
  },
};
