function main() {
  const { TWO_PI } = window.constants;
  const { createSVG, createPath, roundTo, distanceTo } = window.utils;

  const cellSize = 16;
  const colCount = Math.floor(128 / cellSize) - 1;
  const rowCount = Math.floor(128 / cellSize) - 1;
  const resolution = 60;
  const radiusIncrement = TWO_PI / resolution;
  const radius = 6;
  const stackSize = 6;
  const distanceMultiplier = 0.15;

  const xFocus = 64;
  const yFocus = 64;

  let data = '';

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const xCenter = col * cellSize + cellSize;
      const yCenter = row * cellSize + cellSize;

      // Create a series of points that represent the circle at this
      // position.

      let points = [];

      for (let i = 0; i < resolution; i++) {
        const angle = i * radiusIncrement;
        const x = xCenter + Math.cos(angle) * radius;
        const y = yCenter + Math.sin(angle) * radius;

        points.push(x, y);
      }

      // Now we want to stack these circles, move them closer based on
      // depth, and convert them to path data.

      const distanceToFocus = distanceTo(xCenter, yCenter, xFocus, yFocus);
      const angleToFocus = Math.atan2(yCenter - yFocus, xCenter - xFocus);
      const angleCos = Math.cos(angleToFocus);
      const angleSin = Math.sin(angleToFocus);

      for (let i = 0; i < stackSize; i++) {
        const influence =
          (i / stackSize) * (distanceToFocus * distanceMultiplier);
        const xOffset = angleCos * influence;
        const yOffset = angleSin * influence;

        if(i > 0 && distanceToFocus === 0) continue;
        
        data += `M${roundTo(points[0] + xOffset, 2)},${roundTo(
          points[1] + yOffset,
          2
        )} `;
        for (let j = 2; j < points.length; j += 2) {
          const x = roundTo(points[j] + xOffset, 2);
          const y = roundTo(points[j + 1] + yOffset, 2);

          data += `L${x},${y} `;
        }
        data += 'z ';
      }
    }
  }

  return createSVG([
    createPath(data, { stroke: '#fff', fill: 'none', 'stroke-width': '0.2' }),
  ]);
}
