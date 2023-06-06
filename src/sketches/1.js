function main() {
  const { US_LETTER_RATIO } = window.constants;
  const { createSVG, createGroup, createRect, roundTo, distanceTo } =
    window.utils;

  const viewBoxSize = {
    width: 128,
    height: Math.round(128 / US_LETTER_RATIO),
  };
  const viewBoxRatio = viewBoxSize.width / viewBoxSize.height;

  const cellSize = 16;
  const colCount = Math.floor(viewBoxSize.width / cellSize) - 1;
  const rowCount = Math.floor(viewBoxSize.height / cellSize) - 1;
  const stackSize = 6;
  const distanceMultiplier = 0.08;
  const squareSize = 12;
  const squareSizeHalf = squareSize * 0.5;

  const xFocus = viewBoxSize.width * 0.5;
  const yFocus = viewBoxSize.height * 0.5;

  let shapes = [];

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const xCenter = col * cellSize + cellSize;
      const yCenter = row * cellSize + cellSize;

      const distanceToFocus = distanceTo(xCenter, yCenter, xFocus, yFocus);
      const angleToFocus = Math.atan2(yCenter - yFocus, xCenter - xFocus);
      const angleCos = Math.cos(angleToFocus);
      const angleSin = Math.sin(angleToFocus);

      for (let i = 0; i < stackSize; i++) {
        if (i > 0 && distanceToFocus < 10) continue;

        const influence =
          (i / stackSize) * (distanceToFocus * distanceMultiplier);
        const xOffset = angleCos * influence;
        const yOffset = angleSin * influence;

        shapes.push(
          createRect(
            roundTo(xCenter + xOffset - squareSizeHalf, 2),
            roundTo(yCenter + yOffset - squareSizeHalf, 2),
            squareSize,
            squareSize,
            { rx: 2 }
          )
        );
      }
    }
  }

  const svgOptions = {
    viewBox: `0 0 ${viewBoxSize.width} ${viewBoxSize.height}`,
    width: 800,
    height: Math.round(800 / viewBoxRatio),
  };

  const groupOptions = {
    stroke: '#fff',
    fill: 'none',
    'stroke-width': 0.2,
  };

  return createSVG(createGroup(shapes, groupOptions), svgOptions);
}
