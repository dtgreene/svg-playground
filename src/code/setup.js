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

function remap(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function distanceTo(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function roundTo(x, y, precision = 4) {
  const p = 10 ** precision;
  return [Math.round(x * p) / p, Math.round(y * p) / p];
}

export function setup(context) {
  context.constants = {
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI * 0.5,
    QUARTER_PI: Math.PI * 0.25,
  };
  context.utils = {
    noise: quickNoise.noise,
    createSVG,
    createPath,
    randomBetween,
    remap,
    distanceTo,
    roundTo,
  };
}
