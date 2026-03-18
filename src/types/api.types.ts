export interface ApiResponse<TData = unknown> {
  success: true;
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
  success: false;
  message: string;
}

