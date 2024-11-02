import { UserConfig } from '@commitlint/types';

const expression: RegExp = /^(fixed|new|improvement): #\d+( [a-z]+){1,7}$/;

const Configuration: UserConfig = {
	parserPreset: {
		parserOpts: {
			headerPattern: expression,
			headerCorrespondence: ['header'],
		},
	},
	rules: {
		'header-match-pattern': [2, 'always'],
	},
	plugins: [
		{
			rules: {
				'header-match-pattern': (parsed) => {
					const { header } = parsed;

					return !expression.test(header!)
						? [false, 'Error: The commit must start with {new|fixed|improvement}: #XXX ...']
						: [true, ''];
				},
			},
		},
	],
};

export default Configuration;
