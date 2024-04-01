import P5 from 'p5';
import render from './render';
import { FragmentData, FrameData } from './utils';

const sketch = (p5: P5) => {
  const densityMaps = {
    full: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    medium: ' _.,-=+:;cba!?0123456789$W#@',
    min: ' .:-=+*#%@',
  };
  const density = densityMaps.min;
  let t = 0;

  const gridWidth = 110;
  const gridHeight = 40;

  p5.setup = () => {
    p5.createCanvas(1920, 1080);
    p5.textFont('Ubuntu Mono');
  };

  p5.draw = () => {
    p5.frameRate(30);

    const bgColors = {
      black: '#000',
      slate: '#020617',
      gray: '#030712',
      zinc: '#09090b',
      neutral: '#0a0a0a',
      stone: '#0c0a09',
    };
    const bgColor = p5.color(bgColors.gray);
    p5.background(bgColor);

    const fgColors = {
      slate: '#94a3b8',
      gray: '#9ca3af',
      zinc: '#a1a1aa',
      neutral: '#a3a3a3',
      stone: '#a8a29e',
    };
    const fgColor = p5.color(fgColors.gray);
    p5.fill(fgColor);

    const charW = p5.width / gridWidth;
    const charH = p5.height / gridHeight;

    p5.noStroke();
    p5.textSize(charH * 1.2);
    p5.textAlign(p5.CENTER, p5.CENTER);

    const frame: FrameData = {
      t,
      grid: {
        w: gridWidth,
        h: gridHeight,
      },
      char: {
        w: charW,
        h: charH,
      },
    };

    const matrix = render(p5, frame);

    for (let i = 0; i < frame.grid.h; i++) {
      for (let j = 0; j < frame.grid.w; j++) {
        const y = i * charH;
        const x = j * charW;

        const valueRaw = matrix[i][j];
        const value = p5.min(p5.max(valueRaw, 0), 1);

        const drawDebug = false;
        if (drawDebug) {
          p5.fill(p5.lerpColor(bgColor, fgColor, value));
          p5.rect(x, y, charW + 1, charH);
          continue;
        }

        const charIndex = p5.round(p5.map(value, 0, 1, 0, density.length - 1));
        p5.text(density[charIndex], x + charW * 0.5, y + charH * 0.5);
      }
    }

    t++;
  };
};

new P5(sketch);
