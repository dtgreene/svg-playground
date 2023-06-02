import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Link, Typography } from '@mui/material';

export const NotFound = () => (
  <>
    <Box display="flex" alignItems="center" gap={1} mb={4}>
      <ErrorIcon sx={{ width: 64, height: 64 }} />
      <Typography variant="h3">Page not found</Typography>
    </Box>
    <Link component={RouterLink} to="/" variant="button">
      Return home
    </Link>
  </>
);
