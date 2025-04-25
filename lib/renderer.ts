// src/lib/renderer.ts
import {
  Operation,
  OperationType,
  VariableType,
  ShapeType,
  SystemParams,
  DrawingState,
} from "./types";
import { stringToOperations } from "./lsystem";

// Constants for color handling
const COLOR = {
  MAX_HUE: 360,
  MAX_SATURATION: 100,
  MAX_BRIGHTNESS: 100,
  MAX_RGB: 255,
};

// Constants for angle calculations
const ANGLE = {
  DEGREES_TO_RADIANS: Math.PI / 180,
  DEFAULT_THETA_DEGREES: 36,
  HEXAGON_ANGLE_DEGREES: 60,
};

// Shape drawing constants
const SHAPE = {
  HALF: 1 / 2,
  COS_60: Math.cos(ANGLE.HEXAGON_ANGLE_DEGREES * ANGLE.DEGREES_TO_RADIANS),
};

/**
 * Convert HSB color to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} b - Brightness (0-100)
 * @returns {[number, number, number]} - RGB values as [r, g, b]
 */
export const hsbToRgb = (
  h: number,
  s: number,
  b: number,
): [number, number, number] => {
  // Normalize values to 0-1 range
  const hNorm = h / COLOR.MAX_HUE;
  const sNorm = s / COLOR.MAX_SATURATION;
  const bNorm = b / COLOR.MAX_BRIGHTNESS;

  // For grayscale colors (saturation = 0)
  if (sNorm === 0) {
    const gray = Math.round(bNorm * COLOR.MAX_RGB);
    return [gray, gray, gray];
  }

  // Helper function for RGB calculation
  const hueToRgbComponent = (p: number, q: number, t: number): number => {
    // Normalize t to 0-1 range
    if (t < 0) t += 1;
    if (t > 1) t -= 1;

    // Calculate RGB component based on which section of the color wheel we're in
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  // Calculate q and p values based on HSL algorithm
  const q = bNorm < 0.5 ? bNorm * (1 + sNorm) : bNorm + sNorm - bNorm * sNorm;
  const p = 2 * bNorm - q;

  // Calculate RGB components
  const r = hueToRgbComponent(p, q, hNorm + 1 / 3);
  const g = hueToRgbComponent(p, q, hNorm);
  const b1 = hueToRgbComponent(p, q, hNorm - 1 / 3);

  // Convert to 0-255 range and round to integers
  return [
    Math.round(r * COLOR.MAX_RGB),
    Math.round(g * COLOR.MAX_RGB),
    Math.round(b1 * COLOR.MAX_RGB),
  ];
};

/**
 * Draw a triangle on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} w - Width
 * @param {number} h - Height
 */
const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  ctx.beginPath();
  // Define the three points of the triangle
  const topMiddle = { x: x + w * SHAPE.HALF, y: y + h };
  const topRight = { x: x + w, y: y };
  const topLeft = { x: x, y: y };

  // Draw the triangle path
  ctx.moveTo(topMiddle.x, topMiddle.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
};

/**
 * Draw a hexagon on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} w - Width
 * @param {number} h - Height
 */
const drawHexagon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  // Calculate vertical offset for top and bottom points
  const verticalOffset = (h / 2) * SHAPE.COS_60;

  // Define the six points of the hexagon
  const points = [
    { x: x + w * SHAPE.HALF, y: y }, // top
    { x: x + w, y: y + verticalOffset }, // top right
    { x: x + w, y: y + h - verticalOffset }, // bottom right
    { x: x + w * SHAPE.HALF, y: y + h }, // bottom
    { x: x, y: y + h - verticalOffset }, // bottom left
    { x: x, y: y + verticalOffset }, // top left
  ];

  // Draw the hexagon path
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
};

/**
 * Draw a cube on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} w - Width
 * @param {number} h - Height
 */
const drawCube = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  // Calculate vertical offset for angled points
  const verticalOffset = (h / 2) * SHAPE.COS_60;
  const center = { x: x + w * SHAPE.HALF, y: y + h * SHAPE.HALF };

  // Define the cube faces using point arrays
  const faces: Array<Array<{ x: number; y: number }>> = [
    // Top face
    [
      { x: center.x, y: y }, // top
      { x: x + w, y: y + verticalOffset }, // top right
      { x: center.x, y: center.y }, // center
      { x: x, y: y + verticalOffset }, // top left
    ],
    // Right face
    [
      { x: x + w, y: y + verticalOffset }, // top right
      { x: x + w, y: y + h - verticalOffset }, // bottom right
      { x: center.x, y: y + h }, // bottom
      { x: center.x, y: center.y }, // center
    ],
    // Left face
    [
      { x: center.x, y: y + h }, // bottom
      { x: x, y: y + h - verticalOffset }, // bottom left
      { x: x, y: y + verticalOffset }, // top left
      { x: center.x, y: center.y }, // center
    ],
  ];

  // Draw each face
  faces.forEach((face) => {
    ctx.beginPath();
    ctx.moveTo(face[0].x, face[0].y);
    for (let i = 1; i < face.length; i++) {
      ctx.lineTo(face[i].x, face[i].y);
    }
    ctx.closePath();
    // The fill and stroke will be applied by the calling function
  });
};

/**
 * Calculate a new random color component with lerping
 * @param {number} current - Current color value
 * @param {number} lerpAmount - Amount to vary by
 * @param {number} max - Maximum value
 * @returns {number} - New color value
 */
const lerpColorComponent = (
  current: number,
  lerpAmount: number,
  max: number,
): number => {
  const variance = Math.random() * lerpAmount * 2 - lerpAmount;
  return Math.min(max, Math.max(0, current + variance));
};

/**
 * Update color in the drawing state using lerp
 * @param {DrawingState} state - Drawing state
 * @param {number} lerpFrequency - Amount to vary color by
 */
const updateColor = (state: DrawingState, lerpFrequency: number): void => {
  state.randomR = lerpColorComponent(
    state.randomR,
    lerpFrequency,
    COLOR.MAX_HUE,
  );
  state.randomG = lerpColorComponent(
    state.randomG,
    lerpFrequency,
    COLOR.MAX_SATURATION,
  );
  state.randomB = lerpColorComponent(
    state.randomB,
    lerpFrequency,
    COLOR.MAX_BRIGHTNESS,
  );
};

/**
 * Apply color and styles to shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {DrawingState} state - Drawing state
 * @param {SystemParams} params - Rendering parameters
 * @param {boolean} isFilled - Whether to fill the shape
 */
const applyStyles = (
  ctx: CanvasRenderingContext2D,
  state: DrawingState,
  params: SystemParams,
  isFilled: boolean,
): void => {
  const { alpha, stroke: strokeWidth } = params;

  const [r, g, b] = hsbToRgb(state.randomR, state.randomG, state.randomB);
  const alphaValue = (alpha / 255) * (state.opacity / 100);

  const colorStyle = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;

  ctx.strokeStyle = colorStyle;
  ctx.lineWidth = strokeWidth;

  if (isFilled) {
    ctx.fillStyle = colorStyle;
    ctx.fill();
  }

  ctx.stroke();
};

/**
 * Draw a specific shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {ShapeType} shapeType - Type of shape to draw
 * @param {DrawingState} state - Drawing state
 * @param {number} w - Width
 * @param {number} h - Height
 * @param {SystemParams} params - Rendering parameters
 */
const drawShape = (
  ctx: CanvasRenderingContext2D,
  shapeType: ShapeType,
  state: DrawingState,
  w: number,
  h: number,
  params: SystemParams,
): void => {
  const { toggles } = params;

  // Update color with lerp effect
  updateColor(state, params.lerpFrequency);

  // Draw the requested shape type
  switch (shapeType) {
    case ShapeType.LINE:
      if (toggles.line) {
        ctx.beginPath();
        ctx.moveTo(state.x, state.y);
        ctx.lineTo(
          state.x + w * Math.cos(state.angle),
          state.y + h * Math.sin(state.angle),
        );
        applyStyles(ctx, state, params, false);
      }
      break;

    case ShapeType.SQUARE:
      if (toggles.square) {
        ctx.beginPath();
        ctx.rect(state.x, state.y, w, h);
        applyStyles(ctx, state, params, toggles.squareFill);
      }
      break;

    case ShapeType.CIRCLE:
      if (toggles.circle) {
        ctx.beginPath();
        ctx.ellipse(
          state.x + w / 2,
          state.y + h / 2,
          w / 2,
          h / 2,
          0,
          0,
          Math.PI * 2,
        );
        applyStyles(ctx, state, params, toggles.circleFill);
      }
      break;

    case ShapeType.TRIANGLE:
      if (toggles.triangle) {
        drawTriangle(ctx, state.x, state.y, w, h);
        applyStyles(ctx, state, params, toggles.triangleFill);
      }
      break;

    case ShapeType.HEXAGON:
      if (toggles.hexagon) {
        drawHexagon(ctx, state.x, state.y, w, h);
        applyStyles(ctx, state, params, toggles.hexagonFill);
      }
      break;

    case ShapeType.CUBE:
      if (toggles.cube) {
        drawCube(ctx, state.x, state.y, w, h);
        applyStyles(ctx, state, params, toggles.cubeFill);
      }
      break;
  }
};

/**
 * Calculate shape size based on parameters - Modified to match Java version
 * @param {number} height - Canvas height
 * @param {SystemParams} params - Rendering parameters
 * @returns {{width: number, height: number}} - Width and height for shape
 */
const calculateShapeSize = (
  height: number,
  params: SystemParams,
): { width: number; height: number } => {
  const {
    minSizeMultiplier,
    maxSizeMultiplier,
    widthRatio,
    heightRatio,
    size,
  } = params;

  // Calculate base width with random multiplier in the specified range
  const currentW =
    Math.random() * (height * maxSizeMultiplier - height * minSizeMultiplier) +
    height * minSizeMultiplier;

  // Calculate height based on ratio settings
  const currentH =
    heightRatio >= 0 && widthRatio >= 0
      ? (currentW * heightRatio) / widthRatio
      : Math.random() *
          (height * maxSizeMultiplier - height * minSizeMultiplier) +
        height * minSizeMultiplier;

  // Apply size multiplier - matching the Java version scale factor
  return {
    width: currentW * size,
    height: currentH * size,
  };
};

/**
 * Render an L-system on a canvas - Modified to match Java clustering behavior
 * @param {string | Operation[]} production - L-system production string or operations array
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {SystemParams} params - Rendering parameters
 */
export const renderLSystem = (
  production: string | Operation[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: SystemParams,
): void => {
  const { complexity, scatter, color, axiomAmount, gens } = params;

  // Clear canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Set initial position
  const startX = width / 2;
  const startY = height - height / 2;

  // Initialize drawing state
  const state: DrawingState = {
    x: startX,
    y: startY,
    angle: 0,
    randomR: color.h,
    randomG: color.s,
    randomB: color.b,
    opacity: color.a,
  };

  // Set theta (angle increment) - Using the same value as Java version
  const theta = ANGLE.DEFAULT_THETA_DEGREES * ANGLE.DEGREES_TO_RADIANS;

  // Stack for saving/restoring state
  const stack: DrawingState[] = [];

  // Convert string to operations if needed
  const operations: Operation[] =
    typeof production === "string"
      ? stringToOperations(production)
      : production;

  // Number of steps to render
  const steps = Math.min(complexity, operations.length);

  // Current repeat count
  let repeats = 1;

  // Map of operations to their actions
  const operationActions: Record<string, (value?: number) => void> = {
    [OperationType.ROTATE_RIGHT]: () => {
      state.angle += theta * repeats;
    },
    [OperationType.ROTATE_LEFT]: () => {
      state.angle -= theta * repeats;
    },
    [OperationType.ROTATE_RIGHT_DOUBLE]: () => {
      state.angle += theta * 2 * repeats;
    },
    [OperationType.ROTATE_RIGHT_HALF]: () => {
      state.angle += (theta / 2) * repeats;
    },
    [OperationType.ROTATE_SQUARED]: () => {
      state.angle += theta * theta * repeats;
    },
    [OperationType.ROTATE_CUBED]: () => {
      state.angle += theta * theta * theta * repeats;
    },
    [OperationType.PUSH_STATE]: () => {
      stack.push({ ...state });
    },
    [OperationType.POP_STATE]: () => {
      if (stack.length > 0) Object.assign(state, stack.pop());
    },
    [OperationType.DRAW_FORWARD]: () => {
      // Calculate shape dimensions
      const { width: shapeWidth, height: shapeHeight } = calculateShapeSize(
        height,
        params,
      );

      // Draw all enabled shapes
      Object.values(ShapeType).forEach((shapeType) => {
        drawShape(ctx, shapeType, state, shapeWidth, shapeHeight, params);
      });

      // Move to next position - MODIFIED to match Java version's tight clustering
      // In Java version, scatter is applied directly rather than as a separate translation
      // Using a smaller movement factor and applying it to both x and y coordinates
      const scatterAmount = scatter / 10; // Reduced factor to match Java version's clustering
      state.x += Math.cos(state.angle) * scatterAmount;
      state.y += Math.sin(state.angle) * scatterAmount;

      repeats = 1;
    },
    [OperationType.REPEAT]: (value?: number) => {
      if (value !== undefined) repeats = value;
    },
  };

  // Process each operation in the production
  for (let i = 0; i < steps; i++) {
    const operation = operations[i];

    if (
      operation.type === OperationType.REPEAT &&
      operation.value !== undefined
    ) {
      operationActions[operation.type](operation.value);
    } else if (operationActions[operation.type]) {
      operationActions[operation.type]();
      // Reset repeats after non-repeat operations except push/pop
      if (
        operation.type !== OperationType.PUSH_STATE &&
        operation.type !== OperationType.POP_STATE
      ) {
        repeats = 1;
      }
    }
    // Skip variable operations as they should have been expanded already
  }
};
