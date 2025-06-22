export interface IPublicationRequest {
	title: string;
	description: string;
	authors: string;
	url: string;
}

export interface IPublicationResponse extends IPublicationRequest {
	id: number;
}
