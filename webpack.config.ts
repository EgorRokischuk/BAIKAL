import path from 'path';
import dotenv from 'dotenv';
import webpack from 'webpack';
import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, IBuildPaths } from './config/build/types';

interface IEnvVariables {
	mode: BuildMode;
	port: number;
}

const modes = {
	development: '.env.development',
	production: '.env.production',
};

export default (env: IEnvVariables) => {
	const paths: IBuildPaths = {
		entry: path.resolve(__dirname, 'src', 'index.tsx'),
		html: path.resolve(__dirname, 'public', 'index.html'),
		output: path.resolve(__dirname, 'build'),
		src: path.resolve(__dirname, 'src'),
		public: path.resolve(__dirname, 'public'),
		env: path.resolve(__dirname, modes[env.mode]),
	};

	dotenv.config({ path: paths.env });

	const isDev = env.mode === 'development';
	const port = process.env.PORT ?? 8080;

	const envVars = {
		__IS_DEV__: JSON.stringify(isDev),
		'process.env.NODE_ENV': JSON.stringify(env.mode),
		'process.env.PORT': JSON.stringify(process.env.PORT || port),
		'process.env.API_URL': JSON.stringify(process.env.API_URL),
		'process.env.TILE_API_URL': JSON.stringify(process.env.TILE_API_URL),
		'process.env.ORGANIZATION_URL': JSON.stringify(process.env.ORGANIZATION_URL ?? ''),
	};

	const config: webpack.Configuration = buildWebpack({
		port: +port,
		mode: env.mode ?? 'development',
		paths,
		isDev,
		envs: envVars,
	});

	return config;
};
