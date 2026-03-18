export interface ApiResponse<TData = unknown> {
  success: string;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}
