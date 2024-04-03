import { Matrix, Renderer } from '../render';
import { makeMatrix, pasteOnMatrix } from '../utils';

const n = 0.4;
const c = 0.5;
const width = 5;
enum Turn {
  N,
  C,
  Over,
  Reset,
  None,
}

const ticTacToe: Renderer = (p5, frame, matrix) => {
  if (frame.t === 0) {
    frame.data.turn = Turn.Reset;
    p5.frameRate(2);
  }

  let { board, turn, turns } = frame.data;

  if (turn === Turn.Reset) {
    board = makeMatrix({ h: width, w: width });
    frame.data.turn = Turn.N;
    frame.data.turns = 0;
  } else if (turn === Turn.Over) {
    frame.data.turn = Turn.Reset;
    const winPos: Pos[] = frame.data.winPos;
    for (let i = 0; i < winPos.length; i++) {
      const { x, y } = winPos[i];
      board[x][y] = 0.9;
    }
  } else {
    const checkWin = check(board);
    if (checkWin.t !== Turn.None) {
      frame.data.turn = Turn.Over;
      frame.data.winPos = checkWin.pos;
      return matrix;
    }

    const put = turn === Turn.C ? c : n;

    let pX = 0;
    let pY = 0;

    if (turns < width * width) {
      do {
        pX = p5.random(Array.from(Array(width).keys()));
        pY = p5.random(Array.from(Array(width).keys()));
      } while (board[pX][pY] !== 0);
      frame.data.turn = turn === Turn.C ? Turn.N : Turn.C;
      frame.data.turns += 1;
    } else {
      frame.data.turn = Turn.Over;
      frame.data.winPos = [];
      return matrix;
    }

    board[pX][pY] = put;
  }

  const bX = (frame.grid.w - frame.pad) / 2 - board[0].length;
  const bY = frame.grid.h / 2 - board.length;
  pasteOnMatrix(matrix, board, bX, bY);
  frame.data.board = board;

  return matrix;
};

type Pos = { x: number; y: number };
const check = (board: Matrix): { t: Turn; pos: Pos[] } => {
  const posToCheck: Pos[][] = [];

  const posesD1: Pos[] = [];
  const posesD2: Pos[] = [];
  for (let i = 0; i < board.length; i++) {
    const posesH: Pos[] = [];
    const posesV: Pos[] = [];
    for (let j = 0; j < board[i].length; j++) {
      posesH.push({ x: i, y: j });
      posesV.push({ x: j, y: i });
    }
    posToCheck.push(posesH);
    posToCheck.push(posesV);
    posesD1.push({ x: i, y: i });
    posesD2.push({ x: i, y: board.length - i - 1 });
  }
  posToCheck.push(posesD1);
  posToCheck.push(posesD2);

  for (let t = 0; t < posToCheck.length; t++) {
    const toCheck = posToCheck[t];
    let v = 0;
    for (let i = 0; i < toCheck.length; i++) {
      const { x, y } = toCheck[i];
      const vPrev = v;
      v = board[x][y];
      if (i > 0 && vPrev !== v) {
        break;
      }
      if (v !== 0 && i === toCheck.length - 1) {
        return { t: v === n ? Turn.N : Turn.C, pos: toCheck };
      }
    }
  }

  return { t: Turn.None, pos: [] };
};

export default ticTacToe;
