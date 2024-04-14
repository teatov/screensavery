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
  data: Record<string, any>;
  pad: number;
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
    matrix = makeMatrix(frame.grid);
    traverse(matrix, (_v, x, y) => {
      const data: FragmentData = { y, x, frame };
      matrix[y][x] = shader(p5, data);
    });

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
  if (j > padStart) {
    value = 0;
  } else if (j > smoothStart) {
    const jRelative = j - smoothStart;
    const smoothAmount = 1 - jRelative / smooth;
    value *= smoothAmount;
  }
  return value;
};

export const makeMatrix = (dimensions: { h: number; w: number }): Matrix => {
  return new Array(dimensions.h)
    .fill([])
    .map(() => new Array(dimensions.w).fill(0));
};

export const pasteOnMatrix = (
  canvas: Matrix,
  pastee: Matrix,
  x: number,
  y: number
): Matrix => {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0) {
    x = canvas[0].length + x;
  }
  if (y < 0) {
    y = canvas.length + y;
  }
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

export const traverse = (
  matrix: Matrix,
  func: (v: number | string, x: number, y: number) => number | string | void,
  pad?: number
): Matrix => {
  for (let y = 0; y < matrix.length - (pad ?? 0); y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      matrix[y][x] = func(matrix[y][x], x, y) ?? matrix[y][x];
    }
  }
  return matrix;
};
