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
  },
});

