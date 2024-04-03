import { Renderer } from '../render';
import { traverse } from '../utils';

const dvd: Renderer = (p5, frame, matrix) => {
  if (frame.t === 0) {
    frame.data.ax = p5.round(p5.random(0, frame.grid.w - frame.pad - 1));
    frame.data.ay = p5.round(p5.random(0, frame.grid.h - 1));
    frame.data.dirX = p5.random([-1, 1]);
    frame.data.dirY = p5.random([-1, 1]);
    // frame.data.dirX = p5.random(-1, 1);
    // frame.data.dirY = p5.random(-1, 1);
    p5.frameRate(15);
  }

  let { ax, ay, dirX, dirY } = frame.data;
  const width = 6;

  let newX = ax + dirX;
  let newY = ay + dirY;

  const oobX = newX < 0 || newX > frame.grid.w - frame.pad - width;
  const oobY = newY < 0 || newY > frame.grid.h - width;

  if (oobX) {
    dirX *= -1;
    newX += dirX;
  }
  if (oobY) {
    dirY *= -1;
    newY += dirY;
  }

  ax = newX;
  ay = newY;

  matrix = traverse(matrix, (v, _x, _y) => (v as number) * 0.75);

  const roundX = p5.round(ax);
  const roundY = p5.round(ay);
  for (let y = roundY; y < roundY + width; y++) {
    for (let x = roundX; x < roundX + width; x++) {
      const v = matrix[y][x] as number;
      matrix[y][x] = v + 1;
    }
  }

  frame.data.ax = ax;
  frame.data.ay = ay;
  frame.data.dirX = dirX;
  frame.data.dirY = dirY;

  return matrix;
};

export default dvd;
