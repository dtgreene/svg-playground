function main() {
  const count = 15;
  const resolution = 50;
  const spacing = 4;

  const centerX = 64;
  const centerY = 64;

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

  return createSVG([
    createPath(data, { stroke: '#fff', fill: 'none', 'stroke-width': '0.2' }),
  ]);
}
