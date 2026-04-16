// types/blog-post.ts

// --------------------
// Translations
// --------------------

export interface BlogPostTranslation {
  id: string;
  blogPostId: number;
  languageCode: string;
  title: string;
  content: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
}

// --------------------
// Paginated list item — translation fields flattened for requested language
// --------------------

export interface BlogPost {
  id: number;
  handle: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  readTimeMinutes: number | null;
  viewCount: number;
  authorId: string;
  /** Display name of the author (flattened from User relation) */
  author: string;
  /** Flattened from the requested language translation */
  title: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string | null;
  category: {
    id: number;
    handle: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

// --------------------
// Admin detail — all translations included (GET /:id)
// --------------------

export interface AdminBlogPost {
  id: number;
  handle: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  readTimeMinutes: number | null;
  viewCount: number;
  authorId: string;
  categoryId: number;
  category?: {
    id: number;
    handle: string;
    translations?: Array<{ languageCode: string; title: string }>;
  };
  translations: BlogPostTranslation[];
  createdAt: string;
  updatedAt: string;
}

// --------------------
// API query / pagination
// --------------------

export interface BlogPostQueryParams {
  page?: number;
  pageSize?: number;
  lang?: string;
  search?: string;
  categoryId?: number;
  isPublished?: string; // "true" | "false"
  sortBy?: "createdAt" | "publishedAt" | "title";
}

export interface PaginatedBlogPostsResponse {
  data: BlogPost[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// --------------------
// Public article detail — single post by handle, includes full content
// author is the full object { id, displayName } instead of the flattened string
// --------------------

export interface PublicBlogPostDetail extends Omit<BlogPost, "author"> {
  content: string;
  author: { id: string; displayName: string };
}
