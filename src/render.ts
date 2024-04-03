import P5 from 'p5';
import { FrameData } from './utils';
import gameOfLife from './renderers/gameOfLife';
import perlinScrollMultiply from './renderers/perlinScrollMultiply';
import {
  identity,
  fullWhite,
  sinCosMult,
  perlin3dSlice,
  sineWave,
} from './renderers/simple';
import brownianMotion from './renderers/brownianMotion';
import dvd from './renderers/dvd';
import ticTacToe from './renderers/ticTacToe';

export type Matrix = (number | string)[][];
export type Renderer = (p5: P5, frame: FrameData, matrix: Matrix) => Matrix;

const renderers: Record<string, Renderer> = {
  identity,
  fullWhite,
  sinCosMult,
  perlin3dSlice,
  sineWave,
  perlinScrollMultiply,
  gameOfLife,
  brownianMotion,
  dvd,
  ticTacToe,
};

export default (p5: P5, frame: FrameData, matrix: Matrix): Matrix => {
  return renderers.brownianMotion(p5, frame, matrix);
};
