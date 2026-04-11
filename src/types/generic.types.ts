export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}

export interface PaginatedResult<T> {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: T[];
}
