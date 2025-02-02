import featureSlicedDesign from '@conarti/eslint-plugin-feature-sliced';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import ts from 'typescript-eslint';

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	react.configs.flat.recommended,
	featureSlicedDesign(),
	{
		ignores: ['node_modules', 'config', 'build'],
	},
	{
		files: ['**/*.{js,ts,tsx}'],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
			globals: {
				__IS_DEV__: true,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'react/prop-types': 0,
			'react/react-in-jsx-scope': 0,
			'react/self-closing-comp': 1,
			'react/jsx-no-literals': 1,
			'react/jsx-boolean-value': 1,
			'react/function-component-definition': [
				2,
				{
					namedComponents: 'arrow-function',
					unnamedComponents: 'arrow-function',
				},
			],
			'@typescript-eslint/no-empty-object-type': 0,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@conarti/feature-sliced/absolute-relative': 0,
			'@conarti/feature-sliced/public-api': 2,
			'@conarti/feature-sliced/layers-slices': [
				2,
				{
					ignorePatterns: ['@/app/providers/store'],
				},
			],
			'import/order': 1,
		},
	},
];
