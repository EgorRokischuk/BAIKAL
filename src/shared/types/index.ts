export interface IPaginationResponse<T> {
	page: number;
	total: number;
	data: Array<T>;
}

export interface IPaginationRequest {
	page: number;
	limit: number;
}
