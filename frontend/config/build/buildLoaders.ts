import { ModuleOptions } from 'webpack';
import { IBuildOptions } from './types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';

export function buildLoaders({ mode }: IBuildOptions): ModuleOptions['rules'] {
	const isDev = mode === 'development';

	const assetLoader = {
		test: /\.(png|jpe?g|gif|woff2|woff)$/i,
		type: 'asset/resource',
	};

	const cssLoaderWithModules = {
		loader: 'css-loader',
		options: {
			modules: {
				localIdentName: isDev
					? '[path]__[name]__[local]'
					: '[hash:base64:8]',
			},
		},
	};

	const scssLoader = {
		test: /\.s[ac]ss$/i,
		use: [
			isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
			cssLoaderWithModules,
			'sass-loader',
		],
	};

	const tsLoader = {
		test: /\.tsx?$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					getCustomTransformers: () => ({
						before: [isDev && ReactRefreshTypeScript()].filter(
							Boolean
						),
					}),
				},
			},
		],
		exclude: /node_modules/,
	};

	const svgrLoader = {
		test: /\.svg$/,
		use: [
			{
				loader: '@svgr/webpack',
				options: {
					icon: true,
					svgoConfig: {
						plugins: [
							{
								name: 'converColors',
								params: {
									currentColor: true,
								},
							},
						],
					},
				},
			},
		],
	};

	return [assetLoader, scssLoader, tsLoader, svgrLoader];
}
