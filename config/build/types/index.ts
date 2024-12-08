export type BuildMode = 'production' | 'development';

export interface IBuildPaths {
	entry: string;
	html: string;
	output: string;
	src: string;
	env: string;
}

export interface IBuildOptions {
	port: number;
	paths: IBuildPaths;
	mode: BuildMode;
	isDev: boolean;
	envs: { [key: string]: string | number };
}
