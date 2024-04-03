import { Renderer } from '../render';
import { fragment, correctAspectRatio, makeMatrix } from '../utils';

export const identity: Renderer = (_p5, _frame, matrix) => {
  return matrix;
};

export const fullWhite: Renderer = fragment(() => {
  return 1;
});

export const fullBlack: Renderer = fragment(() => {
  return 0;
});

export const sinCosMult: Renderer = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);
  const newT = f.frame.t / 20;
  const sin = p5.sin(x / 5 + newT) / 2 + 0.5;
  const cos = p5.sin(y / 5 + newT) / 2 + 0.5;
  const v = sin * cos;
  return v;
});

export const perlin3dSlice: Renderer = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);
  const noiseScale = 0.05;
  const noise = p5.noise(x * noiseScale, y * noiseScale, f.frame.t / 100);
  let v = noise;

  if (noise < 0.4) {
    v = 0;
  } else if (noise < 0.8) {
    v = p5.map(noise, 0.5, 0.6, 0.25, 0.75);
  } else {
    v = 1;
  }

  return v;
});

export const sineWave: Renderer = (p5, frame, matrix) => {
  matrix = makeMatrix(frame.grid);

  for (let x = 0; x < frame.grid.w; x++) {
    const amplitude = 4;
    const frequency = 0.25;
    const speed = 0.1;
    const f = p5.sin(x * frequency + frame.t * speed) * amplitude;

    const y = p5.round(f) + frame.grid.h / 2;

    matrix[y][x] = 1;
  }

  return matrix;
};
