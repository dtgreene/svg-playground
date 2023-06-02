import React from 'react';
import { Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const commonSVGProps = {
  style: { maxHeight: 800, borderRadius: 4, border: '1px solid #333' },
};

export const SketchLayout = ({ name, renderSVG, controls }) => (
  <>
    <Link
      component={RouterLink}
      to="/"
      variant="button"
      display="inline-flex"
      gap={0.5}
      alignItems="center"
    >
      <ArrowBackIcon />
      <span>Back</span>
    </Link>
    <Typography variant="h3" mb={4} textAlign="center">
      {name}
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={8}>
        {renderSVG(commonSVGProps)}
      </Grid>
      <Grid item xs={4}>
        {controls}
      </Grid>
    </Grid>
  </>
);
