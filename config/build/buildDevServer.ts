import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { IBuildOptions } from './types';

export function buildDevServer({ port }: IBuildOptions): DevServerConfiguration {
	const apiUrl = process.env.API_URL;
	let proxy: DevServerConfiguration['proxy'];

	if (apiUrl) {
		try {
			const parsedApiUrl = new URL(apiUrl);
			proxy = [
				{
					context: [parsedApiUrl.pathname],
					target: parsedApiUrl.origin,
					changeOrigin: true,
					secure: true,
				},
			];
		} catch {
			proxy = undefined;
		}
	}

	return {
		hot: true,
		historyApiFallback: true,
		port: port || 8080,
		open: true,
		proxy,
	};
}
