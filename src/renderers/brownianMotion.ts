import { Renderer } from '../render';
import { makeMatrix, traverse } from '../utils';

const brownianMotion: Renderer = (p5, frame, matrix) => {
  if (frame.t === 0) {
    matrix = makeMatrix(frame.grid);
    frame.data.ax = Math.floor(frame.grid.w / 2);
    frame.data.ay = Math.floor(frame.grid.h / 2);
    frame.data.dirX = 0;
    frame.data.dirY = 0;
    frame.data.at = 0;
  }

  matrix = traverse(matrix, (v, _x, _y) => v * 0.99);

  let { ax, ay, at, dirX, dirY } = frame.data;

  if (at === 0) {
    do {
      dirX = p5.round(p5.random([-1, 0, 1]));
      dirY = p5.round(p5.random([-1, 0, 1]));
    } while (dirX === 0 && dirY === 0);
  }

  ax += dirX;
  ay += dirY;
  ax = p5.constrain(ax, 0, frame.grid.w - 1 - frame.pad);
  ay = p5.constrain(ay, 0, frame.grid.h - 1);

  matrix[ay][ax] += 1;

  at += 1;

  if (at === 4) {
    at = 0;
  }

  frame.data.ax = ax;
  frame.data.ay = ay;
  frame.data.dirX = dirX;
  frame.data.dirY = dirY;
  frame.data.at = at;

  return matrix;
};

export default brownianMotion;
