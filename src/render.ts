import P5 from 'p5';
import {
  FrameData,
  correctAspectRatio,
  fragment,
  rightPadding,
} from './utils';

export type Matrix = number[][];

export default (p5: P5, frame: FrameData): Matrix => {
  const functions = {
    fullWhite,
    sinCosMult,
    perlin3dSlice,
    perlinScrollMultiply,
  };

  let matrix = functions.perlinScrollMultiply(p5, frame);

  // if (f.x > f.frame.grid.w - 30) {
  //   value = 0;
  // }

  // return value;
  rightPadding(frame, matrix, 30, 10);
  return matrix;
};

const fullWhite = fragment(() => {
  return 1;
});

const sinCosMult = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);
  const newT = f.frame.t / 20;
  const sin = p5.sin(x / 5 + newT) / 2 + 0.5;
  const cos = p5.sin(y / 5 + newT) / 2 + 0.5;
  const v = sin * cos;
  return v;
});

const perlin3dSlice = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);
  const noiseScale = 0.05;
  const noise = p5.noise(x * noiseScale, y * noiseScale, f.frame.t / 100);
  let v = noise;

  if (noise < 0.5) {
    v = 0;
  } else if (noise < 0.6) {
    v = p5.map(noise, 0.5, 0.6, 0.25, 0.75);
    // } else if (noise < 0.625) {
    //   v = 1;
  } else {
    v = 1;
  }

  return v;
});

const perlinScrollMultiply = fragment((p5, f) => {
  const { x, y } = correctAspectRatio(f);

  const x1 = x + f.frame.t * 0.1;
  const y1 = y + f.frame.t * 0.2;
  const noiseScale1 = 0.05;
  const noise1 = p5.noise(x1 * noiseScale1, y1 * noiseScale1);

  const x2 = x + f.frame.t * -0.01;
  const y2 = y + f.frame.t * -0.025;
  const noiseScale2 = 0.1;
  const noise2 = p5.noise(x2 * noiseScale2, y2 * noiseScale2);

  let v = noise1 * noise2;

  if (v < 0.1) {
    v = 0;
  } else if (v < 0.35) {
    v = p5.map(v, 0.35, 0.5, 0.3, 0.9);
  } else {
    v = 1;
  }

  return v;
});
