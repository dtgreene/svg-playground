import { createNoise2D } from 'simplex-noise';

const nameSpace = 'http://www.w3.org/2000/svg';

function createSVG(children, props = {}) {
  const defaultProps = {
    viewBox: '0 0 128 128',
    width: 800,
    height: 800,
  };
  const svg = document.createElementNS(nameSpace, 'svg');

  Object.entries(defaultProps).forEach(([key, value]) => {
    if (props[key]) {
      svg.setAttribute(key, props[key]);
    } else {
      svg.setAttribute(key, value);
    }
  });

  if (Array.isArray(children)) {
    children.forEach((child) => {
      svg.appendChild(child);
    });
  } else {
    svg.appendChild(children);
  }

  return svg;
}

function createGroup(children, props = {}) {
  const group = document.createElementNS(nameSpace, 'g');
  applyProps(group, props);

  if (Array.isArray(children)) {
    children.forEach((child) => {
      group.appendChild(child);
    });
  } else {
    group.appendChild(children);
  }

  return group;
}

function createPath(data, props = {}) {
  const path = document.createElementNS(nameSpace, 'path');
  path.setAttribute('d', data);

  applyProps(path, props);

  return path;
}

function createCircle(cx, cy, r, props = {}) {
  const circle = document.createElementNS(nameSpace, 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);

  applyProps(circle, props);

  return circle;
}

function createRect(x, y, width, height, props = {}) {
  const rect = document.createElementNS(nameSpace, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);

  applyProps(rect, props);

  return rect;
}

function applyProps(element, props) {
  Object.entries(props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
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

function roundTo(value, precision = 4) {
  const p = 10 ** precision;
  return Math.round(value * p) / p;
}

export function setup(context) {
  context.constants = {
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI * 0.5,
    QUARTER_PI: Math.PI * 0.25,
    US_LETTER_RATIO: 8.5 / 11,
  };
  context.utils = {
    createNoise2D,
    createSVG,
    createGroup,
    createPath,
    createCircle,
    createRect,
    randomBetween,
    remap,
    distanceTo,
    roundTo,
  };
}
