import React from 'react';
import { Box, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

import { Layout } from '../Layout';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const message =
    error?.message ||
    'An error without a message occurred.  Check the console for more info.';

  return (
    <Layout>
      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <ErrorIcon sx={{ width: 64, height: 64 }} />
        <Typography variant="h3">Dang</Typography>
      </Box>
      <Box color="text.secondary">{message}</Box>
    </Layout>
  );
};
