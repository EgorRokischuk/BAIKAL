import webpack from 'webpack';
import path from 'path';
import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, IBuildPaths } from './config/build/types';
import Dotenv from 'dotenv-webpack';

interface IEnvVariables {
	mode: BuildMode;
	port: number;
	analyzer: boolean;
}

export default (env: IEnvVariables) => {
	const isDev = env.mode === 'development';

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
	
	config.plugins = config.plugins || [];

	config.plugins.push(
		new Dotenv({
			path: path.resolve(__dirname, '.env'),
			systemvars: true,
		})
	);

	if (isDev) {
		config.devServer = {
			hot: true, // делаем "горячую перезагрузк"
			historyApiFallback: true, // для обработки маршрутов
			static: {
				directory: paths.output, // подача статических файлов из папки сборки
			},
			port: env.port || 8080,
		};

		config.plugins?.push(new webpack.HotModuleReplacementPlugin());
	}

	return config;
};
