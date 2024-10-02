export interface IAxiosResponse {
	readonly result: boolean;
	data?: object;
	readonly errors?: string;
	readonly traceId?: string;
}

export interface IGetDataResponse {
	// `data` is the response from the server
	data: object;
	// `status` is the HTTP status code from the server response
	status: number;
	// `statusText` is the HTTP status message from the server response
	statusText: string;
	// `headers` the HTTP headers that the server responded with
	// All header names are lowercase and can be accessed using the bracket notation.
	// Example: `response.headers['content-type']`
	headers?: object;
	// `config` is the config that was provided to `axios` for the request
	config?: object;
	// `request` is the request that generated this response
	request?: object;
}
