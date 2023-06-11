import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

import { ModalProvider, ModalPlaceholder, SnackProvider } from '../../contexts';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: teal,
    background: {
      default: '#0b0c13',
      paper: '#1c1c24',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    fontSize: 12,
  },
});

export const Layout = () => (
  <ThemeProvider theme={theme}>
    <SnackProvider>
      <ModalProvider>
        <Box p={4}>
          <Outlet />
        </Box>
        <ModalPlaceholder />
      </ModalProvider>
    </SnackProvider>
    <CssBaseline />
  </ThemeProvider>
);
