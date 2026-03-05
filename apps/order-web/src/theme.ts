import { createTheme } from '@mui/material'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1020',
      paper: '#141b2f',
    },
    primary: {
      main: '#60a5fa',
    },
    success: {
      main: '#34d399',
    },
    error: {
      main: '#fb7185',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage:
            'linear-gradient(180deg, rgba(22,30,56,0.95) 0%, rgba(20,27,47,0.95) 100%)',
          border: '1px solid rgba(148,163,184,0.15)',
        },
      },
    },
  },
})
