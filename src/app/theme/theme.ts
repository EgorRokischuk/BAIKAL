import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f4f93',
      dark: '#163a6b',
      light: '#3f6eb4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4f6a85',
      dark: '#35485e',
      light: '#70839a',
    },
    background: {
      default: '#eef3f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d2b3a',
      secondary: '#546274',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Manrope, "Segoe UI", sans-serif',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.3rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.1rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #d8e1eb',
          boxShadow: '0 8px 26px rgba(19, 42, 76, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
});
