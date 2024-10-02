import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { IBuildOptions } from './types';

export function buildDevServer(options: IBuildOptions): DevServerConfiguration {
	return {
		port: options.port || 8080,
		open: true,
		historyApiFallback: true,
		hot: true,
	};
}
