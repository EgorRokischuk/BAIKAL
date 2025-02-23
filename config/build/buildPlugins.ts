import type { IBuildOptions } from './types';
import type { Configuration } from 'webpack';

import Dotenv from 'dotenv-webpack';
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export function buildPlugins({ paths, isDev, envs }: IBuildOptions): Configuration['plugins'] {
	const plugins: Configuration['plugins'] = [
		new HtmlWebpackPlugin({ template: paths.html }),
		new DefinePlugin(envs),
		new Dotenv({
			path: paths.env,
			systemvars: true,
		}),
	];

	if (isDev) {
		plugins.push(new ForkTsCheckerWebpackPlugin());
		plugins.push(new ReactRefreshWebpackPlugin());
		/*
		plugins.push(
			new CircularDependencyPlugin({
			  failOnError: true,
			}),
		);
		*/
	}

	if (!isDev) {
		plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash:8].css',
				chunkFilename: 'css/[name].[contenthash:8].css',
			}),
		);
	}

	return plugins;
}
