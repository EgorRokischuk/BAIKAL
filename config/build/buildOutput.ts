import { Configuration } from 'webpack';
import { IBuildOptions } from './types';

export const buildOutput = ({ paths }: IBuildOptions): Configuration['output'] => ({
	path: paths.output,
	filename: 'bundle.[contenthash].js',
	clean: true,
	publicPath: '/',
});
