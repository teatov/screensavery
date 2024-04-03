import P5 from 'p5';
import { FrameData, correctAspectRatio, fragment } from './utils';
import gameOfLife from './renderers/gameOfLife';
import perlinScrollMultiply from './renderers/perlinScrollMultiply';

export type Matrix = number[][];
export type Renderer = (p5: P5, frame: FrameData, matrix: Matrix) => Matrix;

export default (p5: P5, frame: FrameData, matrix: Matrix): Matrix => {
  const functions = {
    identity,
    fullWhite,
    sinCosMult,
    perlin3dSlice,
    perlinScrollMultiply,
    gameOfLife,
  };

  return functions.perlin3dSlice(p5, frame, matrix);
};

const identity: Renderer = (_p5, _frame, matrix) => {
  return matrix;
};

const fullWhite: Renderer = fragment(() => {
  return 1;
});

const sinCosMult: Renderer = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);
  const newT = f.frame.t / 20;
  const sin = p5.sin(x / 5 + newT) / 2 + 0.5;
  const cos = p5.sin(y / 5 + newT) / 2 + 0.5;
  const v = sin * cos;
  return v;
});

const perlin3dSlice: Renderer = fragment((p5, f) => {
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
