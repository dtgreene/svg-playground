import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import SpiralThumbnail from '../../icons/Spiral.svg';

const sketches = [
  {
    name: 'Spiral',
    path: '/sketches/spiral',
    thumbnail: SpiralThumbnail,
  },
  {
    name: 'Squares',
    path: '/sketches/squares',
    thumbnail: SpiralThumbnail,
  },
];

const SketchCell = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  background: '#222',
  position: 'relative',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
  display: 'flex',
  overflow: 'hidden',
  padding: theme.spacing(2),
  '&:hover': {
    opacity: 0.8,
  },
}));

const SketchName = styled(Box)(({ theme }) => ({
  background: '#000',
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1),
}));

const Thumbnail = styled('img')({
  width: '100%',
  height: '100%',
  minWidth: 100,
  maxWidth: 200,
});

export const Root = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box mb={4}>
        <Typography variant="h3" textAlign="center">
          SVG Playground
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {sketches.map((sketch) => (
          <Grid key={sketch.path} item>
            <SketchCell onClick={() => navigate(sketch.path)} xs={4}>
              <Thumbnail src={sketch.thumbnail} />
              <SketchName>{sketch.name}</SketchName>
            </SketchCell>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
