import { Renderer } from '../render';
import { fragment, correctAspectRatio } from '../utils';

const perlinScrollMultiply: Renderer = fragment((p5, f) => {
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

export default perlinScrollMultiply;
