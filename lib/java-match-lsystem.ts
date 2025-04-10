// src/lib/java-match-lsystem.ts
import { RandomString, generateRules } from './random-string';

/**
 * Directly ported version of the CSystem class from Java
 */
export class CSystem {
  private axiom: string = "";
  private ruleW: string = "";
  private ruleX: string = "";
  private ruleY: string = "";
  private ruleZ: string = "";
  private drawLength: number = 460.0;
  private theta: number = (36 * Math.PI) / 180; // radians(36)
  private production: string = "";
  private generations: number = 0;

  constructor(axiomAmount: number) {
    const rules = generateRules(axiomAmount);
    this.axiom = rules.axiom;
    this.ruleW = rules.ruleW;
    this.ruleX = rules.ruleX;
    this.ruleY = rules.ruleY;
    this.ruleZ = rules.ruleZ;
    this.reset();
  }

  /**
   * Reset the system state
   */
  reset(): void {
    this.production = this.axiom;
    this.drawLength = 460.0;
    this.generations = 0;
  }

  /**
   * Get the current age (generation count)
   */
  getAge(): number {
    return this.generations;
  }

  /**
   * Perform a single iteration of the L-system
   * Directly ported from Java CSystem.iterate
   */
  iterate(): string {
    let newProduction = "";
    
    // Process each character in the production
    for (let i = 0; i < this.production.length; i++) {
      const step = this.production.charAt(i);
      
      // Apply the appropriate rule for each variable
      if (step === 'W') {
        newProduction += this.ruleW;
      } else if (step === 'X') {
        newProduction += this.ruleX;
      } else if (step === 'Y') {
        newProduction += this.ruleY;
      } else if (step === 'Z') {
        newProduction += this.ruleZ;
      } else {
        // Keep non-variable characters except 'F'
        if (step !== 'F') {
          newProduction += step;
        }
      }
    }
    
    this.generations++;
    return newProduction;
  }

  /**
   * Simulate the L-system for the specified number of generations
   * Direct port of Java CSystem.simulate
   */
  simulate(generations: number): string {
    while (this.getAge() < generations) {
      this.production = this.iterate();
    }
    
    return this.production;
  }

  /**
   * Get the final production
   */
  getProduction(): string {
    return this.production;
  }
}

/**
 * Generate an L-system production exactly matching the Java version
 */
export function generateExactJavaMatch(axiomAmount: number, generations: number): string {
  const system = new CSystem(axiomAmount);
  system.simulate(generations);
  return system.getProduction();
}