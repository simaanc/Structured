// systems/LSystem.ts
export interface LSystemConfig {
  axiom?: string;
  rule?: string;
  startLength?: number;
  thetaDeg?: number;
}

export default class LSystem {
  protected axiom: string;
  protected rule: string;
  protected production: string;
  protected drawLength: number;
  protected generations: number;
  protected theta: number;
  protected startLength: number;

  constructor(config: LSystemConfig = {}) {
    this.axiom = config.axiom ?? "F";
    this.rule = config.rule ?? "F+F-F";
    this.startLength = config.startLength ?? 190;
    this.theta = ((config.thetaDeg ?? 120) * Math.PI) / 180;

    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

  reset() {
    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

  simulate(gen: number) {
    while (this.generations < gen) {
      // simple single-rule replacement for base LSystem
      this.production = this.production.replace(/F/g, this.rule);
      this.drawLength *= 1; // no scaling here by default
      this.generations++;
    }
  }
}
