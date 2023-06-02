import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: teal,
  },
  typography: {
    fontFamily: 'Poppins',
    fontSize: 12,
  },
});

export const Layout = () => (
  <ThemeProvider theme={theme}>
    <Box p={4}>
      <Outlet />
    </Box>
    <CssBaseline />
  </ThemeProvider>
);
