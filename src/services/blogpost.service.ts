import apiClient from "@/lib/axios";
import { AdminBlogPost, PaginatedBlogPostsResponse } from "@/types/blog-post";
import { BlogPostFormValues } from "@/validations/blog-post.schema";

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

/**
 * Build multipart FormData for a blog post.
 * Translations are JSON-serialised because Multer only handles flat strings.
 */
function buildFormData(data: BlogPostFormValues): FormData {
  const fd = new FormData();

  fd.append("handle", data.handle);
  fd.append("categoryId", String(data.categoryId));
  fd.append("isPublished", String(data.isPublished));

  if (data.publishedAt?.trim())
    fd.append("publishedAt", data.publishedAt.trim());
  if (data.readTimeMinutes != null)
    fd.append("readTimeMinutes", String(data.readTimeMinutes));
  if (data.image instanceof File) fd.append("image", data.image);

  // Only include languages that have both title and content
  const translations = Object.entries(data.translations)
    .filter(([, t]) => t?.title?.trim() && t?.content?.trim())
    .map(([languageCode, t]) => ({
      languageCode,
      title: t.title!.trim(),
      content: t.content!.trim(),
      excerpt: t.excerpt?.trim() || undefined,
      metaTitle: t.metaTitle?.trim() || undefined,
      metaDescription: t.metaDescription?.trim() || undefined,
      tags: t.tags?.trim() || undefined,
    }));

  fd.append("translations", JSON.stringify(translations));
  return fd;
}

export const blogPostService = {
  /** GET /blog-posts — admin paginated list */
  getPaginated: async (
    page = 1,
    pageSize = 20,
    search?: string,
    lang = "en",
    isPublished?: string,
    categoryId?: number,
  ): Promise<PaginatedBlogPostsResponse> => {
    const params: Record<string, string | number> = { page, pageSize, lang };
    if (search?.trim()) params.search = search.trim();
    if (isPublished) params.isPublished = isPublished;
    if (categoryId) params.categoryId = categoryId;
    const res = await apiClient.get("/blog-posts", { params });
    return unwrap<PaginatedBlogPostsResponse>(res.data);
  },

  /** GET /blog-posts/:id — admin detail with all translations */
  getById: async (id: number): Promise<AdminBlogPost> => {
    const res = await apiClient.get(`/blog-posts/${id}`);
    return unwrap<AdminBlogPost>(res.data);
  },

  /** POST /blog-posts — create */
  create: async (data: BlogPostFormValues): Promise<AdminBlogPost> => {
    const fd = buildFormData(data);
    const res = await apiClient.post("/blog-posts", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<AdminBlogPost>(res.data);
  },

  /** PUT /blog-posts/:id — update */
  update: async (
    id: number,
    data: BlogPostFormValues,
  ): Promise<AdminBlogPost> => {
    const fd = buildFormData(data);
    const res = await apiClient.put(`/blog-posts/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<AdminBlogPost>(res.data);
  },

  /** DELETE /blog-posts/:id */
  delete: async (id: number): Promise<void> => {
    const res = await apiClient.delete(`/blog-posts/${id}`);
    unwrap<null>(res.data);
  },
};
