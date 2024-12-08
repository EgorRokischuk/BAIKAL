import { Configuration } from 'webpack';
import { IBuildOptions } from './types';

export function buildResolvers({ paths }: IBuildOptions): Configuration['resolve'] {
	return {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@': paths.src,
		},
	};
}
