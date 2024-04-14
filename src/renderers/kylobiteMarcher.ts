import { Vector } from 'p5';
import { Renderer } from '../render';
import { fragment } from '../utils';

const kilobyteMarcher: Renderer = fragment((p5, f) => {
  const T = f.frame.t / 60;

  function smoothstep(edge0: number, edge1: number, x: number) {
    const t = p5.constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  function SS(a: number, b: number, c: number) {
    return smoothstep(a - b, a + b, c);
  }

  function gyr(p: Vector) {
    const xyz = p5.createVector(p5.sin(p.x), p5.sin(p.y), p5.sin(p.z));
    const zxy = p5.createVector(p5.cos(p.z), p5.cos(p.x), p5.cos(p.y));
    return Vector.dot(xyz, zxy);
  }

  function map(p: Vector) {
    const gyr1 = gyr(p5.createVector(p.x * 8, p.y * 8, p.z * 8));
    const sin1 = p5.sin(T * 0.2 + p.z * 3);
    return (
      (1 + 0.2 * p5.sin(p.y * 600)) *
        gyr(
          p5.createVector(
            p.x * 10 + 0.8 * gyr1,
            p.y * 10 + 0.8 * gyr1,
            p.z * 10 + 0.8 * gyr1
          )
        ) *
        (1 + p5.sin(T + p5.createVector(p.x, p.y).mag() * 10)) +
      0.3 *
        p5.sin(T * 0.15 + p.z * 5 + p.y) *
        (2 +
          gyr(
            p5.createVector(
              p.x * sin1 * 350 + 250,
              p.y * sin1 * 350 + 250,
              p.z * sin1 * 350 + 250
            )
          ))
    );
  }

  function norm(p: Vector) {
    const m = map(p);
    const d = p5.createVector(0.06 + 0.06 * p5.sin(p.z), 0);
    const xyy = p5.createVector(p.x - d.x, p.y - d.y, p.z - d.y);
    const yxy = p5.createVector(p.x - d.y, p.y - d.x, p.z - d.y);
    const yyx = p5.createVector(p.x - d.y, p.y - d.y, p.z - d.x);
    return p5.createVector(m - map(xyy), m - map(yxy), m - map(yyx));
  }

  const uvc = p5.createVector(
    (f.x - (f.frame.grid.w - f.frame.pad) / 2) / f.frame.grid.h,
    (f.y - f.frame.grid.h / 2) / f.frame.grid.h
  );
  let d = 0;
  let dd = 1;
  let p = p5.createVector(0, 0, T / 4);
  const rd = Vector.normalize(p5.createVector(uvc.x, uvc.y, 1));

  for (let i = 0; i < 90 && dd > 0.001 && d < 2; i++) {
    d += dd;
    p.add(p5.createVector(rd.x * d, rd.y * d, rd.z * d));
    dd = map(p) * 0.02;
  }

  const n = norm(p);
  let bw = n.x + n.y;
  bw *= SS(0.9, 0.15, 1 / d);

  return bw;
});

export default kilobyteMarcher;
