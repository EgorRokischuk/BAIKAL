import { createTheme } from '@mui/material/styles';
import { blue, pink, green, red, yellow, grey } from '@mui/material/colors';

export const theme = createTheme({
	palette: {
		primary: {
			main: blue[500],
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
});
