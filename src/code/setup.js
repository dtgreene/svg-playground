import quickNoise from 'quick-perlin-noise-js';

function createSVG(children, props = {}) {
  const defaultProps = {
    viewBox: '0 0 128 128',
    width: 800,
    height: 800,
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  Object.entries(defaultProps).forEach(([key, value]) => {
    if (props[key]) {
      svg.setAttribute(key, props[key]);
    } else {
      svg.setAttribute(key, value);
    }
  });

  children.forEach((child) => {
    svg.appendChild(child);
  });

  return svg;
}

function createPath(data, props = {}) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', data);

  Object.entries(props).forEach(([key, value]) => {
    path.setAttribute(key, value);
  });

  return path;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function setup(context) {
  context.noise = quickNoise.noise;

  context.TWO_PI = Math.PI * 2;
  context.HALF_PI = Math.PI * 0.5;
  context.QUARTER_PI = Math.PI * 0.25;

  context.createSVG = createSVG;
  context.createPath = createPath;
  context.randomBetween = randomBetween;
}
