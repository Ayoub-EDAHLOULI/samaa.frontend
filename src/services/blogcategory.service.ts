import apiClient from "@/lib/axios";
import {
  BlogCategory,
  AdminBlogCategory,
  PaginatedBlogCategoriesResponse,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from "@/types/blog-category";

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

export const blogCategoryService = {
  /** GET /blog-categories?lang=en — all active categories (public, no auth) */
  getAll: async (lang = "en"): Promise<BlogCategory[]> => {
    const res = await apiClient.get("/blog-categories", { params: { lang } });
    return unwrap<BlogCategory[]>(res.data);
  },

  /** GET /blog-categories/paginated — admin paginated list */
  getPaginated: async (
    page = 1,
    pageSize = 20,
    search?: string,
    lang = "en",
  ): Promise<PaginatedBlogCategoriesResponse> => {
    const params: Record<string, string | number> = { page, pageSize, lang };
    if (search?.trim()) params.search = search.trim();
    const res = await apiClient.get("/blog-categories/paginated", { params });
    return unwrap<PaginatedBlogCategoriesResponse>(res.data);
  },

  /** GET /blog-categories/:id — no lang param → returns all translations */
  getById: async (id: number): Promise<AdminBlogCategory> => {
    const res = await apiClient.get(`/blog-categories/${id}`);
    return unwrap<AdminBlogCategory>(res.data);
  },

  /** POST /blog-categories — create with all translations */
  create: async (data: CreateBlogCategoryDto): Promise<AdminBlogCategory> => {
    const res = await apiClient.post("/blog-categories", data);
    return unwrap<AdminBlogCategory>(res.data);
  },

  /** PUT /blog-categories/:id — update core fields + upsert translations */
  update: async (
    id: number,
    data: UpdateBlogCategoryDto,
  ): Promise<AdminBlogCategory> => {
    const res = await apiClient.put(`/blog-categories/${id}`, data);
    return unwrap<AdminBlogCategory>(res.data);
  },

  /** DELETE /blog-categories/:id */
  delete: async (id: number): Promise<void> => {
    const res = await apiClient.delete(`/blog-categories/${id}`);
    unwrap<null>(res.data);
  },
};
