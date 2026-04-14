import { apiClient } from "@/api/client";
import { API_CONFIG } from "@/api/config";
import {
  Language,
  CreateLanguageDto,
  UpdateLanguageDto,
} from "@/types/languages.types";

export const languageService = {
  /**
   * Get all languages
   * Public route
   */
  async getAll(activeOnly: boolean = false): Promise<Language[]> {
    const params = activeOnly ? "?activeOnly=true" : "";
    return apiClient.get<Language[]>(
      `${API_CONFIG.ENDPOINTS.LANGUAGES}${params}`,
    );
  },

  /**
   * Get default language
   * Public route
   */
  async getDefault(): Promise<Language> {
    return apiClient.get<Language>(`${API_CONFIG.ENDPOINTS.LANGUAGES}/default`);
  },

  /**
   * Get language by code
   * Public route
   */
  async getByCode(code: string): Promise<Language> {
    return apiClient.get<Language>(`${API_CONFIG.ENDPOINTS.LANGUAGES}/${code}`);
  },

  /**
   * Create a new language (Admin only)
   */
  async create(data: CreateLanguageDto): Promise<Language> {
    return apiClient.post<Language>(API_CONFIG.ENDPOINTS.LANGUAGES, data);
  },

  /**
   * Update a language (Admin only)
   */
  async update(code: string, data: UpdateLanguageDto): Promise<Language> {
    return apiClient.put<Language>(
      `${API_CONFIG.ENDPOINTS.LANGUAGES}/${code}`,
      data,
    );
  },

  /**
   * Delete a language (Admin only)
   */
  async delete(code: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.LANGUAGES}/${code}`);
  },
};
