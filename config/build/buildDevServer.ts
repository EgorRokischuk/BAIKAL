import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { IBuildOptions } from './types';

export function buildDevServer({ paths, port }: IBuildOptions): DevServerConfiguration {
	return {
		hot: true,
		historyApiFallback: true,
		port: port || 8080,
		open: true,
	};
}
