import { Matrix } from './render';
import P5 from 'p5';

export type FrameData = {
  grid: {
    h: number;
    w: number;
  };
  char: {
    h: number;
    w: number;
  };
  t: number;
};

export type FragmentData = {
  x: number;
  y: number;
  frame: FrameData;
};

export const fragment = (shader: (p5: P5, f: FragmentData) => number) => {
  return (p5: P5, frame: FrameData): Matrix => {
    const matrix: Matrix = [];

    for (let i = 0; i < frame.grid.h; i++) {
      matrix[i] = [];
      for (let j = 0; j < frame.grid.w; j++) {
        const data: FragmentData = {
          y: i,
          x: j,
          frame,
        };

        matrix[i][j] = shader(p5, data);
      }
    }

    return matrix;
  };
};

export const correctAspectRatio = (f: FragmentData) => {
  const x = f.x;
  const y = f.y * (f.frame.char.h / f.frame.char.w);
  return { x, y };
};

export const rightPadding = (
  frame: FrameData,
  matrix: Matrix,
  pad: number,
  smooth: number
) => {
  for (let i = 0; i < frame.grid.h; i++) {
    const padStart = frame.grid.w - pad;
    const smoothStart = padStart - smooth;

    for (let j = smoothStart; j < padStart; j++) {
      const jRelative = j - smoothStart;
      const smoothAmount = 1 - jRelative / smooth;
      matrix[i][j] *= smoothAmount;
    }

    for (let j = padStart; j < frame.grid.w; j++) {
      matrix[i][j] = 0;
    }
  }
};
