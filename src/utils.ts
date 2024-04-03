import { Matrix, Renderer } from './render';
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

export const fragment = (
  shader: (p5: P5, f: FragmentData) => number
): Renderer => {
  return (p5: P5, frame: FrameData, matrix: Matrix) => {
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
  value: number,
  j: number,
  frame: FrameData,
  pad: number,
  smooth: number
) => {
  const padStart = frame.grid.w - pad;
  const smoothStart = padStart - smooth;
  if (j < padStart) {
    const jRelative = j - smoothStart;
    const smoothAmount = 1 - jRelative / smooth;
    value *= smoothAmount;
  } else if (j < frame.grid.w) {
    value = 0;
  }
  return value;
};

export const makeMatrix = (w: number, h: number): Matrix => {
  return new Array(h).fill([]).map(() => new Array(w).fill(0));
};

export const pasteOnMatrix = (
  canvas: Matrix,
  pastee: Matrix,
  x: number,
  y: number
): Matrix => {
  for (let i = 0; i < pastee.length; i++) {
    for (let j = 0; j < pastee[i].length; j++) {
      canvas[i + y][j + x] = pastee[i][j];
    }
  }
  return canvas;
};

export const importMatrix = (text: string): Matrix => {
  return text.split('\n').map((row: string): number[] =>
    row.split('').map((col: string): number => {
      const empty = [' ', '.'];
      const full = ['1', 'O'];
      if (empty.includes(col)) {
        return 0;
      }
      if (full.includes(col)) {
        return 1;
      }
      return 0;
    })
  );
};
