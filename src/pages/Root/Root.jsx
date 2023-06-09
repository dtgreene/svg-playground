import React from 'react';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';

import { sketches } from '../../sketches';
import { ThumbnailPreview } from '../../components';

const SketchCell = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
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
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1),
  fontSize: 24,
  borderRadius: theme.shape.borderRadius
}));

const Thumbnail = styled(Box)({
  minWidth: 100,
  maxWidth: 200,
});

const PopperProps = {
  keepMounted: false,
  sx: {
    '& .MuiTooltip-tooltip': {
      maxWidth: 'none',
    },
  },
};

export const Root = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box mb={4}>
        <Typography variant="h3" textAlign="center">
          Sketches
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {sketches.map((sketch, index) => (
          <Grid key={sketch.id} item>
            <SketchCell onClick={() => navigate(`/sketches/${index}`)} xs={4}>
              <Tooltip
                title={<ThumbnailPreview code={sketch.defaultCode} />}
                PopperProps={PopperProps}
              >
                <Thumbnail>
                  <ImageIcon sx={{ width: '100%', height: '100%' }} />
                </Thumbnail>
              </Tooltip>
              <SketchName>{index}</SketchName>
            </SketchCell>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
