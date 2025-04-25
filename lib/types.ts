// src/lib/types.ts

/**
 * Operation types for L-system
 */
export enum OperationType {
  ROTATE_RIGHT = "ROTATE_RIGHT",
  ROTATE_LEFT = "ROTATE_LEFT",
  ROTATE_RIGHT_DOUBLE = "ROTATE_RIGHT_DOUBLE",
  ROTATE_RIGHT_HALF = "ROTATE_RIGHT_HALF",
  ROTATE_SQUARED = "ROTATE_SQUARED",
  ROTATE_CUBED = "ROTATE_CUBED",
  DRAW_FORWARD = "DRAW_FORWARD",
  PUSH_STATE = "PUSH_STATE",
  POP_STATE = "POP_STATE",
  REPEAT = "REPEAT",
}

/**
 * Variable types for L-system
 */
export enum VariableType {
  RULE_W = "RULE_W",
  RULE_X = "RULE_X",
  RULE_Y = "RULE_Y",
  RULE_Z = "RULE_Z",
}

/**
 * Operation in L-system
 */
export interface Operation {
  type: OperationType | VariableType;
  value?: number;
}

/**
 * Shape types for rendering
 */
export enum ShapeType {
  LINE = "line",
  SQUARE = "square",
  CIRCLE = "circle",
  TRIANGLE = "triangle",
  HEXAGON = "hexagon",
  CUBE = "cube",
}

/**
 * Color parameters
 */
export interface ColorParams {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  b: number; // Brightness (0-100)
  a: number; // Alpha (0-100)
}

/**
 * Toggle states for shapes and options
 */
export interface ToggleParams {
  line: boolean;
  square: boolean;
  circle: boolean;
  triangle: boolean;
  hexagon: boolean;
  cube: boolean;
  squareFill: boolean;
  circleFill: boolean;
  triangleFill: boolean;
  hexagonFill: boolean;
  cubeFill: boolean;
  ratioLink: boolean;
  sizeLink: boolean;
}

/**
 * L-system rules
 */
export interface SystemRules {
  axiom: Operation[];
  ruleW: Operation[];
  ruleX: Operation[];
  ruleY: Operation[];
  ruleZ: Operation[];
}

/**
 * System parameters
 */
export interface SystemParams {
  alpha: number;
  complexity: number;
  stroke: number;
  gens: number;
  axiomAmount: number;
  scatter: number;
  size: number;
  lerpFrequency: number;
  maxSizeMultiplier: number;
  minSizeMultiplier: number;
  widthRatio: number;
  heightRatio: number;
  color: ColorParams;
  toggles: ToggleParams;
}

/**
 * Canvas size
 */
export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Drawing state
 */
export interface DrawingState {
  x: number;
  y: number;
  angle: number;
  randomR: number;
  randomG: number;
  randomB: number;
  opacity: number;
}
