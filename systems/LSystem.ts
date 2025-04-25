// systems/LSystem.ts
import RandomString from "./RandomString";
import { Params } from "../types/types";

// Define L-System instruction constants to replace single-letter symbols
const INSTRUCTION = {
  DRAW_FORWARD: "F",
  TURN_RIGHT: "+",
  TURN_LEFT: "-",
  SAVE_STATE: "[",
  RESTORE_STATE: "]",
  VAR_W: "W",
  VAR_X: "X",
  VAR_Y: "Y",
  VAR_Z: "Z",
  // Other special symbols that might be used
  SPECIAL_CHAR: "^",
};

export interface LSystemConfig {
  axiom?: string;
  rule?: string;
  startLength?: number;
  thetaDeg?: number;
  params?: Params;
  randomFunc?: () => number; // Add seeded random function
}

/**
 * Convert HSB/HSV (h:0–360, s:0–100, v:0–100) → RGB [0–255].
 */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hueDegreeNormalized = (h % 360) / 60;
  const saturationNormalized = s / 100;
  const valueBrightnessNormalized = v / 100;
  const chroma = valueBrightnessNormalized * saturationNormalized;
  const secondaryComponent = chroma * (1 - Math.abs((hueDegreeNormalized % 2) - 1));
  
  let red = 0, green = 0, blue = 0;
  
  if (hueDegreeNormalized < 1) [red, green, blue] = [chroma, secondaryComponent, 0];
  else if (hueDegreeNormalized < 2) [red, green, blue] = [secondaryComponent, chroma, 0];
  else if (hueDegreeNormalized < 3) [red, green, blue] = [0, chroma, secondaryComponent];
  else if (hueDegreeNormalized < 4) [red, green, blue] = [0, secondaryComponent, chroma];
  else if (hueDegreeNormalized < 5) [red, green, blue] = [secondaryComponent, 0, chroma];
  else [red, green, blue] = [chroma, 0, secondaryComponent];
  
  const brightnessMatch = valueBrightnessNormalized - chroma;
  return [
    Math.round((red + brightnessMatch) * 255),
    Math.round((green + brightnessMatch) * 255),
    Math.round((blue + brightnessMatch) * 255),
  ];
}

export default class LSystem {
  // L-System core properties
  protected axiom: string;
  protected rule: string = `${INSTRUCTION.DRAW_FORWARD}${INSTRUCTION.TURN_RIGHT}${INSTRUCTION.DRAW_FORWARD}${INSTRUCTION.TURN_LEFT}${INSTRUCTION.DRAW_FORWARD}`;
  protected production: string;
  protected drawLength: number;
  protected generations: number;
  protected theta: number;
  protected startLength: number;
  protected params?: Params;
  protected randomFunc: () => number; // Seeded random function
  
  // L-System production rules for each variable
  private ruleForW: string = "";
  private ruleForX: string = "";
  private ruleForY: string = "";
  private ruleForZ: string = "";

  constructor(config: LSystemConfig = {}) {
    this.params = config.params;
    this.randomFunc = config.randomFunc || Math.random; // Use provided random or default
    
    if (this.params) {
      // Initialize with parametric L-System values from UI controls
      this.axiom = this.generateInitialAxiom(this.params.axiomAmount);
      this.startLength = this.params.startLength;
      this.theta = this.degreesToRadians(this.params.thetaDeg);
      this.generateRules();
    } else {
      // Initialize with base LSystem parameters
      this.axiom = config.axiom ?? INSTRUCTION.DRAW_FORWARD;
      this.rule = config.rule ?? `${INSTRUCTION.DRAW_FORWARD}${INSTRUCTION.TURN_RIGHT}${INSTRUCTION.DRAW_FORWARD}${INSTRUCTION.TURN_LEFT}${INSTRUCTION.DRAW_FORWARD}`;
      this.startLength = config.startLength ?? 190;
      this.theta = this.degreesToRadians(config.thetaDeg ?? 120);
    }

    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private generateInitialAxiom(branchCount: number): string {
    // Creates a starting axiom with multiple branches like "[X]++[X]++[X]++"
    return Array(branchCount)
      .fill(`${INSTRUCTION.SAVE_STATE}${INSTRUCTION.VAR_X}${INSTRUCTION.RESTORE_STATE}${INSTRUCTION.TURN_RIGHT}${INSTRUCTION.TURN_RIGHT}`)
      .join("");
  }

  reset() {
    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

  simulate(generationCount: number) {
    if (this.params) {
      this.simulateComplex(generationCount);
    } else {
      this.simulateSimple(generationCount);
    }
  }

  private simulateSimple(generationCount: number) {
    while (this.generations < generationCount) {
      // Simple single-rule replacement for base LSystem
      this.production = this.production.replace(
        new RegExp(INSTRUCTION.DRAW_FORWARD, "g"), 
        this.rule
      );
      // No scaling by default
      this.generations++;
    }
  }

  private simulateComplex(generationCount: number) {
    while (this.generations < generationCount) {
      let nextProduction = "";
      
      // Apply the production rules to each character
      for (const currentSymbol of this.production) {
        switch (currentSymbol) {
          case INSTRUCTION.VAR_W:
            nextProduction += this.ruleForW;
            break;
          case INSTRUCTION.VAR_X:
            nextProduction += this.ruleForX;
            break;
          case INSTRUCTION.VAR_Y:
            nextProduction += this.ruleForY;
            break;
          case INSTRUCTION.VAR_Z:
            nextProduction += this.ruleForZ;
            break;
          default:
            // Keep non-variable symbols unchanged
            nextProduction += currentSymbol;
            break;
        }
      }
      
      this.production = nextProduction;
      this.generations++;
    }
  }

  private generateRules() {
    if (!this.params) return;
    
    const availableSymbols = RandomString.structure;
    // Pass the seeded random function to RandomString
    const shortRandomString = new RandomString(2, availableSymbols, this.randomFunc);
    const mediumRandomString = new RandomString(3, availableSymbols, this.randomFunc);
    const longRandomString = new RandomString(4, availableSymbols, this.randomFunc);

    // Generate rules using the helper method to convert string patterns to instruction constants
    
    // Raw rule templates using traditional L-system notation
    const wRuleTemplate = `${shortRandomString.nextString()}++${mediumRandomString.nextString()}${shortRandomString.nextString()}[${mediumRandomString.nextString()}${shortRandomString.nextString()}]++`;
    const xRuleTemplate = `+YF${longRandomString.nextString()}[${shortRandomString.nextString()}${shortRandomString.nextString()}${longRandomString.nextString()}]+`;
    const yRuleTemplate = `-WF${longRandomString.nextString()}[${longRandomString.nextString()}${longRandomString.nextString()}]-`;
    const zRuleTemplate = `--YF+^+WF[+ZF++++XF]--XF`;
    
    // Convert the templates to use instruction constants
    this.ruleForW = this.createRuleString(wRuleTemplate);
    this.ruleForX = this.createRuleString(xRuleTemplate);
    this.ruleForY = this.createRuleString(yRuleTemplate);
    this.ruleForZ = this.createRuleString(zRuleTemplate);
  }

  render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    if (!this.params) {
      console.error("Cannot render without params");
      return;
    }

    const params = this.params;
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Auto-fit: scale to fit 2×startLength in the smaller dimension
    const scaleFactor = Math.min(canvasWidth, canvasHeight) / (this.startLength * 2);
    context.save();
    context.scale(scaleFactor, scaleFactor);
    context.translate(canvasWidth / (2 * scaleFactor), canvasHeight / (2 * scaleFactor));

    context.lineWidth = params.strokeWeight;

    let stackDepth = 0;
    let currentHue = params.startHue;
    let currentSaturation = params.startSat;
    let currentBrightness = params.startBri;
    const baseLength = this.startLength;

    // Process each character in the production, limited by complexity parameter
    for (let i = 0; i < Math.min(this.production.length, params.complexity); i++) {
      const currentSymbol = this.production[i];

      // Apply color jittering if enabled
      if (params.lerpFrequency > 0) {
        [currentHue, currentSaturation, currentBrightness] = this.jitterColors(
          params.lerpFrequency, 
          currentHue, 
          currentSaturation, 
          currentBrightness
        );
      }

      // Set stroke and fill colors based on current HSV values
      const [red, green, blue] = hsvToRgb(currentHue, currentSaturation, currentBrightness);
      context.strokeStyle = `rgba(${red},${green},${blue},${params.alpha / 255})`;
      context.fillStyle = `rgba(${red},${green},${blue},${params.opacity / 255})`;

      // Calculate shape dimensions with random variation
      const sizeFactor = this.calculateRandomSizeFactor(
        params.minSizeMultiplier, 
        params.maxSizeMultiplier
      );
      
      const width = baseLength * sizeFactor;
      const height = this.calculateHeight(
        width, 
        params.heightRatio, 
        params.widthRatio, 
        baseLength, 
        sizeFactor
      );

      // Process the current symbol in the production
      stackDepth = this.processSymbol(
        context, 
        currentSymbol, 
        params, 
        baseLength, 
        width, 
        height,
        stackDepth
      );
    }

    // Restore any unmatched context saves
    while (stackDepth > 0) {
      context.restore();
      stackDepth--;
    }
    
    context.restore();
  }

  /**
   * Creates a randomized L-System rule string with proper
   * instruction constants replacing single characters
   */
  private createRuleString(pattern: string): string {
    // Replace all single characters with instruction constants
    return pattern
      .replace(/F/g, INSTRUCTION.DRAW_FORWARD)
      .replace(/\+/g, INSTRUCTION.TURN_RIGHT)
      .replace(/-/g, INSTRUCTION.TURN_LEFT)
      .replace(/\[/g, INSTRUCTION.SAVE_STATE)
      .replace(/\]/g, INSTRUCTION.RESTORE_STATE)
      .replace(/W/g, INSTRUCTION.VAR_W)
      .replace(/X/g, INSTRUCTION.VAR_X)
      .replace(/Y/g, INSTRUCTION.VAR_Y)
      .replace(/Z/g, INSTRUCTION.VAR_Z)
      .replace(/\^/g, INSTRUCTION.SPECIAL_CHAR);
  }

  private jitterColors(
    jitterAmount: number, 
    currentHue: number, 
    currentSaturation: number, 
    currentBrightness: number
  ): [number, number, number] {
    // Apply random variations to color values using seeded random
    const newHue = (currentHue + (this.randomFunc() * 2 - 1) * jitterAmount + 360) % 360;
    const newSaturation = Math.max(
      0,
      Math.min(100, currentSaturation + (this.randomFunc() * 2 - 1) * jitterAmount)
    );
    const newBrightness = Math.max(
      0,
      Math.min(100, currentBrightness + (this.randomFunc() * 2 - 1) * jitterAmount)
    );
    
    return [newHue, newSaturation, newBrightness];
  }

  private calculateRandomSizeFactor(minMultiplier: number, maxMultiplier: number): number {
    // Use seeded random
    return this.randomFunc() * (maxMultiplier - minMultiplier) + minMultiplier;
  }

  private calculateHeight(
    width: number, 
    heightRatio: number, 
    widthRatio: number, 
    baseLength: number, 
    sizeFactor: number
  ): number {
    return heightRatio >= 0 
      ? width * (heightRatio / widthRatio) 
      : baseLength * sizeFactor;
  }

  private processSymbol(
    context: CanvasRenderingContext2D,
    symbol: string,
    params: Params,
    baseLength: number,
    width: number,
    height: number,
    stackDepth: number
  ): number {
    switch (symbol) {
      case INSTRUCTION.DRAW_FORWARD:
        this.drawShapes(context, params, baseLength, width, height);
        // Apply position scatter - use seeded random
        const scatterX = params.scatter * (this.randomFunc() * 2 - 1);
        const scatterY = params.scatter * (this.randomFunc() * 2 - 1);
        context.translate(scatterX, scatterY);
        break;
      case INSTRUCTION.TURN_RIGHT:
        context.rotate(this.theta);
        break;
      case INSTRUCTION.TURN_LEFT:
        context.rotate(-this.theta);
        break;
      case INSTRUCTION.SAVE_STATE:
        context.save();
        stackDepth++;
        break;
      case INSTRUCTION.RESTORE_STATE:
        context.restore();
        stackDepth--;
        break;
      // Ignore other symbols (digits, etc.)
    }
    
    return stackDepth;
  }

  private drawShapes(
    context: CanvasRenderingContext2D,
    params: Params,
    baseLength: number,
    width: number,
    height: number
  ) {
    // Draw line if enabled
    if (params.toggleFlags.line) {
      this.drawLine(context, baseLength);
    }

    // Draw square if enabled
    if (params.toggleFlags.square) {
      this.drawSquare(context, width, height, params.toggleFlags.squareFill);
    }

    // Draw circle/ellipse if enabled
    if (params.toggleFlags.circle) {
      this.drawCircle(context, width, height, params.toggleFlags.circleFill);
    }

    // Draw triangle if enabled
    if (params.toggleFlags.triangle) {
      this.drawTriangle(context, width, height, params.toggleFlags.triangleFill);
    }

    // Draw hexagon if enabled
    if (params.toggleFlags.hex) {
      this.drawHexagon(context, width, height, params.toggleFlags.hexFill);
    }

    // Draw cube if enabled
    if (params.toggleFlags.cube) {
      this.drawCube(context, width, height, params.toggleFlags.cubeFill);
    }
  }

  private drawLine(context: CanvasRenderingContext2D, length: number) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -length);
    context.stroke();
  }

  private drawSquare(
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fill: boolean
  ) {
    fill 
      ? context.fillRect(0, 0, width, height) 
      : context.strokeRect(0, 0, width, height);
  }

  private drawCircle(
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fill: boolean
  ) {
    context.save();
    // Scale X so a unit circle becomes ellipse w×h
    context.scale(width / height, 1);
    context.beginPath();
    context.arc(0, 0, height / 2, 0, Math.PI * 2);
    fill ? context.fill() : context.stroke();
    context.restore();
  }

  private drawTriangle(
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fill: boolean
  ) {
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();
    fill ? context.fill() : context.stroke();
  }

  private drawHexagon(
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fill: boolean
  ) {
    const angleIncrement = Math.PI / 3; // 60 degrees in radians
    context.beginPath();
    
    for (let vertex = 0; vertex < 6; vertex++) {
      const x = (width / 2) * Math.cos(angleIncrement * vertex);
      const y = (height / 2) * Math.sin(angleIncrement * vertex);
      vertex === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
    }
    
    context.closePath();
    fill ? context.fill() : context.stroke();
  }

  private drawCube(
    context: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    fill: boolean
  ) {
    const cosine60 = Math.cos(Math.PI / 3);
    
    // Draw top face
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width, (height / 2) * cosine60);
    context.lineTo(width / 2, height / 2);
    context.lineTo(0, (height / 2) * cosine60);
    context.closePath();
    fill ? context.fill() : context.stroke();
    
    // Draw right face
    context.beginPath();
    context.moveTo(width, (height / 2) * cosine60);
    context.lineTo(width, height - (height / 2) * cosine60);
    context.lineTo(width / 2, height);
    context.lineTo(width / 2, height / 2);
    context.closePath();
    fill ? context.fill() : context.stroke();
    
    // Draw left face
    context.beginPath();
    context.moveTo(width / 2, height);
    context.lineTo(0, height - (height / 2) * cosine60);
    context.lineTo(0, (height / 2) * cosine60);
    context.lineTo(width / 2, height / 2);
    context.closePath();
    fill ? context.fill() : context.stroke();
  }
}