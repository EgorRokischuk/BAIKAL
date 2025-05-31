import { blue, green, red, yellow, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import React from 'react';

declare module '@mui/material/styles' {
	interface TypographyVariants {
		map_menu: React.CSSProperties;
		map_menu_disabled: React.CSSProperties;
		map_menu_active: React.CSSProperties;
		map_menu_label: React.CSSProperties;
		modal_title: React.CSSProperties;
		modal_description: React.CSSProperties;

		about_record_title: React.CSSProperties;
		about_record_description: React.CSSProperties;
	}

	interface TypographyVariantsOptions {
		map_menu_disabled?: React.CSSProperties;
		map_menu?: React.CSSProperties;
		map_menu_active?: React.CSSProperties;
		map_menu_label?: React.CSSProperties;
		modal_title?: React.CSSProperties;
		modal_description?: React.CSSProperties;

		about_record_title?: React.CSSProperties;
		about_record_description?: React.CSSProperties;
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		map_menu_disabled: true;
		map_menu: true;
		map_menu_active: true;
		map_menu_label: true;
		modal_title: true;
		modal_description: true;

		about_record_title: true;
		about_record_description: true;
	}
}

// Создаем тему с добавлением кастомных стилей
export const theme = createTheme({
	palette: {
		primary: {
			main: '#1969CB',
		},
		secondary: {
			main: grey[300],
		},
		success: {
			main: green[600],
		},
		error: {
			main: red[800],
		},
		warning: {
			main: yellow[700],
		},
		info: {
			main: grey[300],
		},
	},
	typography: {
		fontFamily: 'Roboto, sans-serif', // Указываем основной шрифт
		h1: {
			fontSize: '2.5rem',
			fontWeight: 700,
			lineHeight: 1.2,
		},
		h2: {
			fontSize: '2rem',
			fontWeight: 600,
			lineHeight: 1.3,
		},
		body1: {
			fontSize: '1rem',
			fontWeight: 400,
			lineHeight: 1.5,
		},
		body2: {
			fontSize: '0.875rem',
			fontWeight: 400,
			lineHeight: 1.43,
			textTransform: 'none',
		},
		button: {
			fontSize: '0.875rem',
			fontWeight: 500,
			textTransform: 'uppercase',
		},
		caption: {
			fontSize: '8px',
			fontWeight: 300,
			lineHeight: 1.35,
		},
		map_menu: {
			fontSize: '0.85rem',
			fontWeight: 500,
			lineHeight: 1.4,
			color: grey[700],
		},
		map_menu_disabled: {
			fontSize: '0.8rem',
			fontWeight: 500,
			lineHeight: 1.4,
			color: grey[500],
		},
		map_menu_active: {
			fontSize: '0.9rem',
			fontWeight: 500,
			lineHeight: 1.4,
			color: blue[500],
		},
		map_menu_label: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '1.5rem',
			fontWeight: 600,
			lineHeight: 1.3,
			color: '#0C4493',
		},
		modal_title: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '24px',
			fontWeight: 500,
			lineHeight: '100%',
			color: '#FFF',
		},
		modal_description: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '22px',
			fontWeight: 400,
			lineHeight: '28px',
			color: '#000',
		},
		about_record_title: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '22px',
			lineHeight: '36px',
			color: '#FFF',
		},
		about_record_description: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '18px',
			lineHeight: '28px',
			color: '#000',
		},
	},
});
