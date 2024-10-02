import webpack from 'webpack';
import path from 'path';
import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, IBuildPaths } from './config/build/types';

interface IEnvVariables {
	mode: BuildMode;
	port: number;
	analyzer: boolean;
}

export default (env: IEnvVariables) => {
	const paths: IBuildPaths = {
		entry: path.resolve(__dirname, 'src', 'index.tsx'),
		html: path.resolve(__dirname, 'public', 'index.html'),
		output: path.resolve(__dirname, 'build'),
		src: path.resolve(__dirname, 'src'),
	};

	const config: webpack.Configuration = buildWebpack({
		port: env.port || 8080,
		mode: env.mode || 'development',
		paths,
		analyzer: env.analyzer || false,
	});

	return config;
};
