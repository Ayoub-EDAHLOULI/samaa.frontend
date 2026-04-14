import apiClient from "@/lib/axios";
import { AdminReciter, PaginatedReciters } from "@/types/reciters.types";
import {
  ReciterFormValues,
  TranslationFormValues,
} from "@/validations/reciters.schema";

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

/** Build FormData for core (non-translation) reciter fields */
function buildCoreFormData(data: ReciterFormValues): FormData {
  const fd = new FormData();
  fd.append("slug", data.slug);
  if (data.countryCode?.trim())
    fd.append("countryCode", data.countryCode.toUpperCase().trim());
  if (data.style?.trim()) fd.append("style", data.style.trim());
  if (data.spotifyUrl?.trim()) fd.append("spotifyUrl", data.spotifyUrl.trim());
  if (data.youtubeUrl?.trim()) fd.append("youtubeUrl", data.youtubeUrl.trim());
  if (data.image instanceof File) fd.append("image", data.image);
  return fd;
}

/** Append a translation's fields to an existing FormData */
function appendTranslation(
  fd: FormData,
  lang: string,
  t: TranslationFormValues,
): void {
  fd.append("language", lang);
  if (t.name?.trim()) fd.append("name", t.name.trim());
  if (t.nationality?.trim()) fd.append("nationality", t.nationality.trim());
  if (t.shortBio?.trim()) fd.append("shortBio", t.shortBio.trim());
  if (t.biography?.trim()) fd.append("biography", t.biography.trim());
  if (t.seoTitle?.trim()) fd.append("seoTitle", t.seoTitle.trim());
  if (t.tags?.trim()) fd.append("tags", t.tags.trim());
}

/**
 * PUT each translation individually (skip the one already sent with core data).
 * Only sends translations that have a non-empty name.
 */
async function pushTranslations(
  id: string,
  translations: Record<string, TranslationFormValues>,
  skipLang: string,
): Promise<void> {
  for (const [lang, t] of Object.entries(translations)) {
    if (lang === skipLang || !t.name?.trim()) continue;
    const fd = new FormData();
    appendTranslation(fd, lang, t);
    await apiClient.put(`/reciters/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

export const reciterService = {
  // GET /reciters?lang=en — admin list with English names for display
  getPaginated: async (
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedReciters> => {
    const params: Record<string, string | number> = { page, limit, lang: "en" };
    if (search?.trim()) params.search = search.trim();
    const response = await apiClient.get("/reciters", { params });
    return unwrap<PaginatedReciters>(response.data);
  },

  // GET /reciters/id/:id — admin detail with all translations
  getById: async (id: string): Promise<AdminReciter> => {
    const response = await apiClient.get(`/reciters/id/${id}`);
    return unwrap<AdminReciter>(response.data);
  },

  // POST /reciters — create with primary translation, then upsert the rest
  create: async (data: ReciterFormValues): Promise<AdminReciter> => {
    const entries = Object.entries(data.translations);
    // Prefer "en" as primary; fall back to first language with a name
    const primaryLang =
      entries.find(([lang, t]) => lang === "en" && t.name?.trim())?.[0] ??
      entries.find(([, t]) => t.name?.trim())?.[0] ??
      "en";
    const primaryT = data.translations[primaryLang] ?? {};

    const fd = buildCoreFormData(data);
    appendTranslation(fd, primaryLang, primaryT);

    const res = await apiClient.post("/reciters", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const created = unwrap<AdminReciter>(res.data);

    // Push each remaining non-empty translation
    await pushTranslations(created.id, data.translations, primaryLang);

    // Return fresh admin detail with all translations
    const detail = await apiClient.get(`/reciters/id/${created.id}`);
    return unwrap<AdminReciter>(detail.data);
  },

  // PUT /reciters/:id — update core + en translation, then upsert the rest
  update: async (id: string, data: ReciterFormValues): Promise<AdminReciter> => {
    const entries = Object.entries(data.translations);
    const primaryLang =
      entries.find(([lang, t]) => lang === "en" && t.name?.trim())?.[0] ??
      entries.find(([, t]) => t.name?.trim())?.[0] ??
      "en";
    const primaryT = data.translations[primaryLang] ?? {};

    const fd = buildCoreFormData(data);
    if (primaryT.name?.trim()) {
      appendTranslation(fd, primaryLang, primaryT);
    }

    await apiClient.put(`/reciters/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Upsert all other non-empty translations
    await pushTranslations(id, data.translations, primaryLang);

    // Return fresh admin detail
    const detail = await apiClient.get(`/reciters/id/${id}`);
    return unwrap<AdminReciter>(detail.data);
  },

  // DELETE /reciters/:id — blocked by backend if reciter has recognitions
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/reciters/${id}`);
    unwrap<null>(response.data);
  },
};
