// types/blog-category.ts

// --------------------
// DTOs (Payloads for Forms)
// --------------------

export interface BlogCategoryTranslationDto {
  languageCode: string;
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateBlogCategoryDto {
  handle: string;
  isActive?: boolean;
  translations: BlogCategoryTranslationDto[];
}

export interface UpdateBlogCategoryDto {
  handle?: string;
  isActive?: boolean;
  translations?: BlogCategoryTranslationDto[];
}

// --------------------
// API RESPONSES
// --------------------

/** List / paginated response — translation fields flattened for the requested language */
export interface BlogCategory {
  id: number;
  handle: string;
  isActive: boolean;

  title: string;
  description?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;

  postsCount?: number;

  createdAt: string;
  updatedAt: string;
}

/** Admin detail response — all translations included */
export interface BlogCategoryTranslation {
  languageCode: string;
  title: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface AdminBlogCategory {
  id: number;
  handle: string;
  isActive: boolean;
  translations: BlogCategoryTranslation[];
  _count?: { posts: number };
  createdAt: string;
  updatedAt: string;
}

// --------------------
// API QUERY PARAMS
// --------------------

export interface BlogCategoryQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: string; // 'true' | 'false'
  lang?: string;
}

export interface PaginatedBlogCategoriesResponse {
  data: BlogCategory[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
