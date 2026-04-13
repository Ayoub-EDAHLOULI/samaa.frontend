import apiClient from "@/lib/axios";
import {
  RecognitionResultResponse,
  PaginatedHistory,
  PaginatedRecognitions,
} from "@/types/recognitions.types";

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

export const recognitionService = {
  // POST /recognitions/identify — optionalAuth, multipart/form-data
  identify: async (
    audioBlob: Blob,
    options?: { audioDuration?: number; deviceOs?: string },
  ): Promise<RecognitionResultResponse> => {
    const fd = new FormData();
    const ext = audioBlob.type.includes("wav")
      ? "wav"
      : audioBlob.type.includes("ogg")
      ? "ogg"
      : "mp4";
    fd.append("audioSnippet", audioBlob, `recording.${ext}`);
    if (options?.audioDuration != null) {
      fd.append("audioDuration", String(options.audioDuration));
    }
    if (options?.deviceOs) {
      fd.append("deviceOs", options.deviceOs);
    }

    try {
      const response = await apiClient.post("/recognitions/identify", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return unwrap<RecognitionResultResponse>(response.data);
    } catch (err) {
      // Surface the backend's message instead of the generic axios string
      const backendMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      if (backendMsg) throw new Error(backendMsg);
      throw err;
    }
  },

  // GET /recognitions/history — authenticated user
  getHistory: async (page = 1, limit = 20): Promise<PaginatedHistory> => {
    const response = await apiClient.get("/recognitions/history", {
      params: { page, limit },
    });
    return unwrap<PaginatedHistory>(response.data);
  },

  // DELETE /recognitions/:id — authenticated user (own) or admin (any)
  deleteRecognition: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/recognitions/${id}`);
    unwrap<null>(response.data);
  },

  // GET /recognitions — admin only
  getAll: async (
    page = 1,
    limit = 20,
    filters?: { reciterId?: string; userId?: string },
  ): Promise<PaginatedRecognitions> => {
    const params: Record<string, string | number> = { page, limit };
    if (filters?.reciterId) params.reciterId = filters.reciterId;
    if (filters?.userId) params.userId = filters.userId;
    const response = await apiClient.get("/recognitions", { params });
    return unwrap<PaginatedRecognitions>(response.data);
  },
};
