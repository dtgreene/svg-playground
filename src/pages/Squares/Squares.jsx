import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import copy from 'copy-to-clipboard';
import quickNoise from 'quick-perlin-noise-js';

import { SketchLayout } from '../../components';

const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

const viewBox = {
  width: 128,
  height: 128,
};

const defaults = {
  cellSize: 8,
};

export const Squares = () => {
  const svgRef = useRef();
  const { register, handleSubmit } = useForm();
  const onSubmit = ({ cellSize }) => {
    setPathData(getPathData(Number(cellSize)));
  };
  const [pathData, setPathData] = useState(() =>
    getPathData(defaults.cellSize)
  );

  const handleCopyClick = () => {
    copy(svgRef.current.outerHTML);
  };

  return (
    <SketchLayout
      name="Squares"
      renderSVG={(props) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
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
              min: 2,
              step: 1,
              ...register('cellSize'),
            }}
            fullWidth
            label="Cell Size"
            margin="dense"
            type="number"
            defaultValue={defaults.cellSize}
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

function getPathData(cellSize) {
  const colCount = viewBox.width / cellSize;
  const rowCount = viewBox.height / cellSize;

  const offsetMultiplier = 2;

  let data = '';

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const influence = row / rowCount;
      const xOffset = Math.random() * influence * offsetMultiplier;
      const yOffset = Math.random() * influence * offsetMultiplier;

      let x = col * cellSize + xOffset;
      let y = row * cellSize + yOffset;

      data += `M${x},${y} `;

      const rotation = Math.random() * TWO_PI * influence;

      for (let i = 0; i < 4; i++) {
        const angle = rotation + i * HALF_PI;

        x += Math.cos(angle) * cellSize;
        y += Math.sin(angle) * cellSize;

        data += `L${x},${y} `;
      }

      data += 'z ';
    }
  }

  return data;
}
