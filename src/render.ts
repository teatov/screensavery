import P5 from 'p5';
import { FrameData } from './utils';
import gameOfLife from './renderers/gameOfLife';
import perlinScrollMultiply from './renderers/perlinScrollMultiply';
import {
  identity,
  fullWhite,
  sinCosMult,
  perlin3dSlice,
  fullBlack,
} from './renderers/simple';
import brownianMotion from './renderers/brownianMotion';

export type Matrix = number[][];
export type Renderer = (p5: P5, frame: FrameData, matrix: Matrix) => Matrix;

const renderers = {
  identity,
  fullWhite,
  fullBlack,
  sinCosMult,
  perlin3dSlice,
  perlinScrollMultiply,
  gameOfLife,
  brownianMotion,
};
type RendererName = keyof typeof renderers;
let currentRenderer: Renderer =
  renderers[(localStorage.getItem('renderer') as RendererName) ?? 'identity'];

const renderersContainer = document.getElementById('renderers')!;
Object.keys(renderers).forEach((key) => {
  renderersContainer.innerHTML += `<button id="${key}">${key}</button>`;
});
Object.keys(renderers).forEach((key) => {
  document.getElementById(key)?.addEventListener('click', () => {
    localStorage.setItem('renderer', key);
    currentRenderer = renderers[key as RendererName];
  });
});

export default (p5: P5, frame: FrameData, matrix: Matrix): Matrix => {
  return currentRenderer(p5, frame, matrix);
};
