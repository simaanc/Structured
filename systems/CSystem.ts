// systems/CSystem.ts

import LSystem from './LSystem';
import RandomString from './RandomString';
import { Params } from '../types/types';

/**
 * Convert HSB/HSV (h:0–360, s:0–100, v:0–100) → RGB [0–255].
 */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hh = (h % 360) / 60;
  const sat = s / 100;
  const val = v / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if      (hh < 1) [r1, g1, b1] = [c, x, 0];
  else if (hh < 2) [r1, g1, b1] = [x, c, 0];
  else if (hh < 3) [r1, g1, b1] = [0, c, x];
  else if (hh < 4) [r1, g1, b1] = [0, x, c];
  else if (hh < 5) [r1, g1, b1] = [x, 0, c];
  else              [r1, g1, b1] = [c, 0, x];
  const m = val - c;
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

export default class CSystem extends LSystem {
  private params: Params;
  private ruleW!: string;
  private ruleX!: string;
  private ruleY!: string;
  private ruleZ!: string;

  constructor(params: Params) {
    super({
      axiom: Array(params.axiomAmount).fill('[X]++').join(''),
      startLength: params.startLength,
      thetaDeg: params.thetaDeg,
    });
    this.params = params;
    this.generateRules();
    this.simulate(params.gens);
  }

  private generateRules() {
    const S = RandomString.structure;
    const r2 = new RandomString(2, S);
    const r3 = new RandomString(3, S);
    const r4 = new RandomString(4, S);

    this.ruleW = `${r2.nextString()}++${r3.nextString()}${r2.nextString()}[${r3.nextString()}${r2.nextString()}]++`;
    this.ruleX = `+YF${r4.nextString()}[${r2.nextString()}${r2.nextString()}${r4.nextString()}]+`;
    this.ruleY = `-WF${r4.nextString()}[${r4.nextString()}${r4.nextString()}]-`;
    this.ruleZ = `--YF+^+WF[+ZF++++XF]--XF`;
  }

  simulate(gen: number) {
    while (this.generations < gen) {
      let nextProd = '';
      for (const c of this.production) {
        switch (c) {
          case 'W': nextProd += this.ruleW; break;
          case 'X': nextProd += this.ruleX; break;
          case 'Y': nextProd += this.ruleY; break;
          case 'Z': nextProd += this.ruleZ; break;
          default:  nextProd += c;        break;
        }
      }
      this.production = nextProd;
      this.generations++;
    }
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const p = this.params;
    ctx.clearRect(0, 0, width, height);

    // Auto-fit: scale to fit 2×startLength in the smaller dimension
    const fit = Math.min(width, height) / (this.startLength * 2);
    ctx.save();
    ctx.scale(fit, fit);
    ctx.translate(width / (2 * fit), height / (2 * fit));

    ctx.lineWidth = p.strokeWeight;

    let pushes = 0;
    let curHue = p.startHue, curSat = p.startSat, curBri = p.startBri;
    const base = this.startLength;

    for (let i = 0; i < Math.min(this.production.length, p.complexity); i++) {
      const step = this.production[i];

      // jitter H/S/B
      if (p.lerpFrequency > 0) {
        const d = p.lerpFrequency;
        curHue = (curHue + (Math.random() * 2 - 1) * d + 360) % 360;
        curSat = Math.max(0, Math.min(100, curSat + (Math.random() * 2 - 1) * d));
        curBri = Math.max(0, Math.min(100, curBri + (Math.random() * 2 - 1) * d));
      }

      // set colors
      const [r, g, b] = hsvToRgb(curHue, curSat, curBri);
      ctx.strokeStyle = `rgba(${r},${g},${b},${p.alpha / 255})`;
      ctx.fillStyle   = `rgba(${r},${g},${b},${p.opacity / 255})`;

      // compute random w/h
      const factor = Math.random() * (p.maxSizeMultiplier - p.minSizeMultiplier) + p.minSizeMultiplier;
      const w = base * factor;
      const h = p.heightRatio >= 0
        ? w * (p.heightRatio / p.widthRatio)
        : base * factor;

      if (step === 'F') {
        // line
        if (p.toggleFlags.line) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -base);
          ctx.stroke();
        }

        // square
        if (p.toggleFlags.square) {
          p.toggleFlags.squareFill
            ? ctx.fillRect(0, 0, w, h)
            : ctx.strokeRect(0, 0, w, h);
        }

        // circle/ellipse via scaled arc (works for Canvas2SVG)
        if (p.toggleFlags.circle) {
          ctx.save();
          // scale X so a unit circle becomes ellipse w×h
          ctx.scale(w / h, 1);
          ctx.beginPath();
          ctx.arc(0, 0, h / 2, 0, Math.PI * 2);
          p.toggleFlags.circleFill ? ctx.fill() : ctx.stroke();
          ctx.restore();
        }

        // triangle
        if (p.toggleFlags.triangle) {
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          p.toggleFlags.triangleFill ? ctx.fill() : ctx.stroke();
        }

        // hexagon
        if (p.toggleFlags.hex) {
          const ang = Math.PI / 3;
          ctx.beginPath();
          for (let v = 0; v < 6; v++) {
            const x = (w / 2) * Math.cos(ang * v);
            const y = (h / 2) * Math.sin(ang * v);
            v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          p.toggleFlags.hexFill ? ctx.fill() : ctx.stroke();
        }

        // cube (3 faces)
        if (p.toggleFlags.cube) {
          const c60 = Math.cos(Math.PI / 3);
          // top
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w, (h / 2) * c60);
          ctx.lineTo(w / 2, h / 2);
          ctx.lineTo(0, (h / 2) * c60);
          ctx.closePath();
          p.toggleFlags.cubeFill ? ctx.fill() : ctx.stroke();
          // right
          ctx.beginPath();
          ctx.moveTo(w, (h / 2) * c60);
          ctx.lineTo(w, h - (h / 2) * c60);
          ctx.lineTo(w / 2, h);
          ctx.lineTo(w / 2, h / 2);
          ctx.closePath();
          p.toggleFlags.cubeFill ? ctx.fill() : ctx.stroke();
          // left
          ctx.beginPath();
          ctx.moveTo(w / 2, h);
          ctx.lineTo(0, h - (h / 2) * c60);
          ctx.lineTo(0, (h / 2) * c60);
          ctx.lineTo(w / 2, h / 2);
          ctx.closePath();
          p.toggleFlags.cubeFill ? ctx.fill() : ctx.stroke();
        }

        // scatter translation
        ctx.translate(p.scatter, p.scatter);
      }
      else if (step === '+')      ctx.rotate(this.theta);
      else if (step === '-')      ctx.rotate(-this.theta);
      else if (step === '[')      { ctx.save(); pushes++; }
      else if (step === ']')      { ctx.restore(); pushes--; }
      // ignore digits and other chars
    }

    // restore any unmatched saves
    while (pushes > 0) {
      ctx.restore();
      pushes--;
    }
    ctx.restore();
  }
}
