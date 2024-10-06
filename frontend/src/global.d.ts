declare module '*.module.scss' {
	interface IClassNames {
		[className: string]: string;
	}

	const classNames: IClassNames;
	export = classNames;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.woff2';
declare module '*.woff';
declare module '*.svg' {
	import React from 'react';
	const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
	export default SVG;
}

declare const __IS_DEV__: boolean;
declare const __API_URL__: string;
