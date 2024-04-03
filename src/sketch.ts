import P5 from 'p5';
import render, { Matrix } from './render';
import { FrameData, makeMatrix, rightPadding, traverse } from './utils';

const sketch = (p5: P5) => {
  const densityMaps = {
    full: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    medium: ' _.,-=+:;cba!?0123456789$W#@',
    min: ' .:-=+*#%@',
  };
  const density = densityMaps.min;

  const bgColors = {
    black: '#000',
    slate: '#020617',
    gray: '#030712',
    zinc: '#09090b',
    neutral: '#0a0a0a',
    stone: '#0c0a09',
  };
  const bgColor = p5.color(bgColors.gray);

  const fgColors = {
    slate: '#94a3b8',
    gray: '#9ca3af',
    zinc: '#a1a1aa',
    neutral: '#a3a3a3',
    stone: '#a8a29e',
  };
  const fgColor = p5.color(fgColors.gray);

  const gridW = 110;
  const gridH = 40;

  const screenW = 1920;
  const screenH = 1080;

  const charW = screenW / gridW;
  const charH = screenH / gridH;

  let matrix: Matrix = makeMatrix({ w: gridW, h: gridH });
  let t = 0;
  let persistentData: Record<string, any> = {};
  const padSmooth = 10;
  const pad = p5.round(gridW / 3) - padSmooth;

  const init = () => {
    p5.frameRate(30);
    t = 0;
  };

  document.getElementById('reset')?.addEventListener('click', () => {
    init();
  });

  p5.setup = () => {
    p5.createCanvas(screenW, screenH);
    p5.textFont('Ubuntu Mono');
    init();
  };

  p5.draw = () => {
    p5.background(bgColor);
    p5.fill(fgColor);

    p5.noStroke();
    p5.textSize(charH * 1.2);
    p5.textAlign(p5.CENTER, p5.CENTER);

    const frame: FrameData = {
      t,
      grid: {
        w: gridW,
        h: gridH,
      },
      char: {
        w: charW,
        h: charH,
      },
      data: persistentData,
      pad: pad + padSmooth,
    };

    matrix = render(p5, frame, matrix);

    traverse(matrix, (v, j, i) => {
      const y = i * charH;
      const x = j * charW;

      let char = '';

      if (typeof v === 'string') {
        char = v;
      } else {
        const valuePadded = rightPadding(v, j, frame, pad, padSmooth);
        const value = p5.constrain(valuePadded, 0, 1);

        const drawDebug = false;
        if (drawDebug) {
          p5.fill(p5.lerpColor(bgColor, fgColor, value));
          p5.rect(x, y, charW + 1, charH);
        }

        const charIndex = p5.round(p5.map(value, 0, 1, 0, density.length - 1));
        char = density[charIndex];
      }
      p5.text(char, x + charW * 0.5, y + charH * 0.5);
    });

    t++;
  };
};

new P5(sketch);
