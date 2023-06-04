function main() {
  const { TWO_PI } = window.constants;
  const { createSVG, createPath, randomBetween } = window.utils;

  const cellSize = 8;
  const cellDiagonal = Math.hypot(cellSize, cellSize);

  const colCount = 128 / cellSize - 1;
  const rowCount = 128 / cellSize - 1;

  const angles = [
    Math.PI * 0.75,
    Math.PI * 0.25,
    Math.PI * 1.75,
    Math.PI * 1.25,
  ];

  let data = '';

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const influence = row / rowCount;

      const centerX = col * cellSize + cellSize * 0.5 + cellSize * 0.5;
      const centerY = row * cellSize + cellSize * 0.5 + cellSize * 0.5;
      const rotation = randomBetween(-TWO_PI, TWO_PI) * (influence * 0.05);

      for (let i = 0; i < angles.length; i++) {
        if (i === 0) {
          data += 'M';
        } else {
          data += 'L';
        }

        // This is extra squirrelly because we're drawing the square from the
        // center so that rotation works as expected.
        const x =
          centerX + Math.cos(-angles[i] + rotation) * (cellDiagonal * 0.5);
        const y =
          centerY + Math.sin(-angles[i] + rotation) * (cellDiagonal * 0.5);

        data += `${x},${y} `;
      }

      data += 'z ';
    }
  }

  return createSVG([
    createPath(data, { stroke: '#fff', fill: 'none', 'stroke-width': '0.2' }),
  ]);
}
