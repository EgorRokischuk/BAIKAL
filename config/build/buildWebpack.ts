import webpack from 'webpack';

import { buildOutput } from './buildOutput';
import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildResolvers } from './buildResolvers';
import { buildPlugins } from './buildPlugins';
import { IBuildOptions } from './types';

export function buildWebpack(options: IBuildOptions): webpack.Configuration {
	const { mode, paths, isDev } = options;

	return {
		mode: mode || 'development',
		entry: paths.entry,
		output: buildOutput(options),
		plugins: buildPlugins(options),
		module: {
			rules: buildLoaders(options),
		},
		resolve: buildResolvers(options),
		devtool: isDev && 'inline-source-map',
		devServer: buildDevServer(options),
		performance: {
			hints: false,
        	maxEntrypointSize: 512000,
        	maxAssetSize: 512000
		}
	};
}
