import { Renderer } from '../render';
import { importMatrix, makeMatrix, pasteOnMatrix, traverse } from '../utils';
import patterns from './patterns';

const gameOfLife: Renderer = (p5, frame, matrix) => {
  if (frame.t === 0) {
    p5.frameRate(10);
    matrix = makeMatrix(frame.grid);
    const drawing = importMatrix(patterns.gliderGun);
    let x = frame.grid.w / 3;
    let y = frame.grid.h / 4;
    x -= drawing[0].length / 2;
    y -= drawing.length / 2;
    pasteOnMatrix(matrix, drawing, x, y);
    return matrix;
  }

  const next = makeMatrix(frame.grid);

  for (let y = 1; y < frame.grid.h - 1; y++) {
    for (let x = 1; x < frame.grid.w - 1 - frame.pad; x++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += matrix[y + i][x + j];
        }
      }

      neighbors -= matrix[y][x];
      if (matrix[y][x] === 1 && neighbors < 2) next[y][x] = 0;
      else if (matrix[y][x] === 1 && neighbors > 3) next[y][x] = 0;
      else if (matrix[y][x] === 0 && neighbors === 3) next[y][x] = 1;
      else next[y][x] = matrix[y][x];
    }
  }

  matrix = next;
  return matrix;
};

export default gameOfLife;
