import P5 from 'p5';

const sketch = (p5: P5) => {
  // ' _.,-=+:;cba!?0123456789$W#@'
  // ' .'`^",:;Il!i><~+_-?][}{1)(|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
  // ' .:-=+*#%@'
  const density = ' .:-=+*#%@';
  let t = 0;

  p5.setup = () => {
    p5.createCanvas(1920, 1080);
    p5.textFont('Ubuntu Mono');
  };

  p5.draw = () => {
    p5.background('#212529');
    p5.frameRate(30);

    const gridWidth = 90;
    const gridHeight = 30;

    let w = p5.width / gridWidth;
    let h = p5.height / gridHeight;

    p5.fill('#adb5bd');
    p5.noStroke();
    p5.textSize(h * 1.2);
    p5.textAlign(p5.CENTER, p5.CENTER);

    for (let j = 0; j < gridHeight; j++) {
      for (let i = 0; i < gridWidth; i++) {
        const value = fragment(i, j, t);
        const valueClamped = p5.min(p5.max(value, 0), 1);

        const charIndex = p5.round(
          p5.map(valueClamped, 0, 1, 0, density.length - 1)
        );
        p5.text(density[charIndex], i * w + w * 0.5, j * h + h * 0.5);
      }
    }

    t++;
  };

  const fragment = (x: number, y: number, t: number): number => {
    const newT = t / 20;
    const sin = p5.sin(x / 5 + newT) / 2 + 0.5;
    const cos = p5.sin(y / 5 + newT) / 2 + 0.5;
    const v = sin * cos;
    return v;
  };
};

new P5(sketch);
