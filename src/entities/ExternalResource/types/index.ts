export interface IExternalResourceResponse {
	id: string;
	title: string;
	link: string;
	imageUrl: string;
}

export interface IExternalResourceRequest extends IExternalResourceResponse {
	title: string;
	link: string;
	image: File;
}
