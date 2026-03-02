export interface ApiResponse<TData = unknown> {
  success: string;
  message: string;
  data: TData;
  meat?: PaginationMeta;
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
