export interface PaginationRequest {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  page: number;
  total: number;
  data: T[];
}

export interface ExportHeader {
  header: string;
  key: string;
  width?: number;
}
