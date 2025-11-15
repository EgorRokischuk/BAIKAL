export interface IPaginationResponse<T> {
	page: number;
	total: number;
	data: Array<T>;
}

export interface IPaginationRequest {
	page: number;
	limit: number;
}

export interface IExportHeaderItem {
	header: string;
	key: string;
	width?: number;
	hyperlink?: {
		value: string;
		replacement?: string;
	};
}

export enum EAppRole {
	ADMIN = 'Администратор',
	AUTHORIZED_USER = 'Авторизованный пользователь',
	UNUTHORIZED_USER = 'Неавторизованный пользователь',
}
