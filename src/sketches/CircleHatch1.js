function main() {
  const cellSize = 8;
  const viewBoxSize = 128;

  const focusX = 64;
  const focusY = 64;

  function isPointInSquare(x, y) {
    const isColEven = Math.floor(x / cellSize) % 2 === 0;
    const isRowEven = Math.floor(y / cellSize) % 2 === 0;

    return (!isColEven && isRowEven) || (isColEven && !isRowEven);
  }

  const radiusIncrement = 1;
  const angleIncrement = 0.005;
  const paths = [];

  let radius = 4;

  while (radius < viewBoxSize) {
    let angle = 0;
    let isLineDown = false;
    let pathData = '';

    while (angle < TWO_PI) {
      const x = focusX + Math.cos(angle) * radius;
      const y = focusY + Math.sin(angle) * radius;
      const isPointInBounds =
        x >= 0 && x <= viewBoxSize && y >= 0 && y <= viewBoxSize;

      if (isPointInBounds && isPointInSquare(x, y)) {
        // if a line is not down, begin a new line
        if (!isLineDown) {
          isLineDown = true;

          pathData += `M${x},${y} `;
        } else {
          pathData += `L${x},${y} `;
        }
      } else {
        // if a line is down, break the line and stroke
        if (isLineDown) {
          isLineDown = false;
        }
      }

      angle += angleIncrement;
    }

    if (pathData.length > 0) {
      paths.push(pathData);
    }

    radius += radiusIncrement;
  }

  return createSVG(
    paths.map((path) =>
      createPath(path, { stroke: '#fff', fill: 'none', 'stroke-width': '0.2' })
    )
  );
}
