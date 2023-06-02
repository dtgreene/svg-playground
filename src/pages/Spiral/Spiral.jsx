import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import copy from 'copy-to-clipboard';

import { SketchLayout } from '../../components';

const TWO_PI = Math.PI * 2;
const defaults = {
  count: 15,
  resolution: 50,
  spacing: 4,
};
const centerX = 64;
const centerY = 64;

export const Spiral = () => {
  const svgRef = useRef();
  const { register, handleSubmit } = useForm();
  const onSubmit = ({ count, resolution, spacing }) => {
    setPathData(
      getPathData(Number(count), Number(resolution), Number(spacing))
    );
  };
  const [pathData, setPathData] = useState(() =>
    getPathData(defaults.count, defaults.resolution, defaults.spacing)
  );

  const handleCopyClick = () => {
    copy(svgRef.current.outerHTML);
  };

  return (
    <SketchLayout
      name="Spiral"
      renderSVG={(props) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          ref={svgRef}
          {...props}
        >
          <path d={pathData} stroke="currentColor" fill="none" />
        </svg>
      )}
      controls={
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            inputProps={{
              min: 0,
              max: 100,
              step: 1,
              ...register('count'),
            }}
            fullWidth
            label="Count"
            margin="dense"
            type="number"
            defaultValue={defaults.count}
          />
          <TextField
            inputProps={{
              min: 1,
              step: 1,
              ...register('resolution'),
            }}
            fullWidth
            label="Resolution"
            margin="dense"
            type="number"
            defaultValue={defaults.resolution}
          />
          <TextField
            inputProps={{
              min: 1,
              step: 1,
              ...register('spacing'),
            }}
            fullWidth
            label="Spacing"
            margin="dense"
            type="number"
            defaultValue={defaults.spacing}
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
            Refresh
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            type="button"
            onClick={handleCopyClick}
          >
            Copy SVG
          </Button>
        </form>
      }
    />
  );
};

function getPathData(count, resolution, spacing) {
  // the length of each segment making up a circle
  const segmentLength = TWO_PI / resolution;
  // how much is added to the radius per segment
  const radiusIncrement = spacing / resolution;

  let radius = 0;
  let data = `M${centerX},${centerY} `;

  // iterate until count is reached
  for (let i = 0; i < count; i++) {
    // iterate until a full circle is created
    for (let j = 0; j < resolution; j++) {
      const angle = segmentLength * j;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      data += `L${Math.round(x * 100) / 100},${Math.round(y * 100) / 100} `;

      radius += radiusIncrement;
    }
  }

  return data;
}
