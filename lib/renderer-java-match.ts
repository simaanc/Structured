// src/lib/renderer-java-match.ts
import { SystemParams } from "./types";

// Constants for color handling
const COLOR = {
  MAX_HUE: 360,
  MAX_SATURATION: 100,
  MAX_BRIGHTNESS: 100,
  MAX_RGB: 255,
};

/**
 * Convert HSB color to RGB
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

  // Calculate RGB using HSB/HSV to RGB conversion
  const i = Math.floor(hNorm * 6);
  const f = hNorm * 6 - i;
  const p = bNorm * (1 - sNorm);
  const q = bNorm * (1 - f * sNorm);
  const t = bNorm * (1 - (1 - f) * sNorm);

  let r, g, b1;
  switch (i % 6) {
    case 0:
      r = bNorm;
      g = t;
      b1 = p;
      break;
    case 1:
      r = q;
      g = bNorm;
      b1 = p;
      break;
    case 2:
      r = p;
      g = bNorm;
      b1 = t;
      break;
    case 3:
      r = p;
      g = q;
      b1 = bNorm;
      break;
    case 4:
      r = t;
      g = p;
      b1 = bNorm;
      break;
    case 5:
      r = bNorm;
      g = p;
      b1 = q;
      break;
    default:
      r = 0;
      g = 0;
      b1 = 0;
  }

  return [
    Math.round(r * COLOR.MAX_RGB),
    Math.round(g * COLOR.MAX_RGB),
    Math.round(b1 * COLOR.MAX_RGB),
  ];
};

/**
 * Draw a triangle exactly like Java version
 */
const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h); // bottom middle
  ctx.lineTo(x + w, y); // top right
  ctx.lineTo(x, y); // top left
  ctx.closePath();
};

/**
 * Draw a hexagon exactly like Java version
 */
const drawHexagon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  const cosAngle = Math.cos((60 * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(x + w / 2, y); // top
  ctx.lineTo(x + w, y + (h / 2) * cosAngle); // top right
  ctx.lineTo(x + w, y + h - (h / 2) * cosAngle); // bottom right
  ctx.lineTo(x + w / 2, y + h); // bottom
  ctx.lineTo(x, y + h - (h / 2) * cosAngle); // bottom left
  ctx.lineTo(x, y + (h / 2) * cosAngle); // top left
  ctx.closePath();
};

/**
 * Draw a cube exactly like Java version
 */
const drawCube = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  const cosAngle = Math.cos((60 * Math.PI) / 180);
  const center = { x: x + w / 2, y: y + h / 2 };

  // Top face
  ctx.beginPath();
  ctx.moveTo(center.x, y); // top
  ctx.lineTo(x + w, y + (h / 2) * cosAngle); // top right
  ctx.lineTo(center.x, center.y); // center
  ctx.lineTo(x, y + (h / 2) * cosAngle); // top left
  ctx.closePath();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + w, y + (h / 2) * cosAngle); // top right
  ctx.lineTo(x + w, y + h - (h / 2) * cosAngle); // bottom right
  ctx.lineTo(center.x, y + h); // bottom
  ctx.lineTo(center.x, center.y); // center
  ctx.closePath();

  // Left face
  ctx.beginPath();
  ctx.moveTo(center.x, y + h); // bottom
  ctx.lineTo(x, y + h - (h / 2) * cosAngle); // bottom left
  ctx.lineTo(x, y + (h / 2) * cosAngle); // top left
  ctx.lineTo(center.x, center.y); // center
  ctx.closePath();
};

/**
 * Render an L-system production using Java-matching rendering
 */
export function renderJavaMatch(
  production: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: SystemParams,
): void {
  // Clear canvas
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Initialize state
  const state = {
    x: width / 2,
    y: height - height / 2,
    angle: 0,
    randomR: params.color.h,
    randomG: params.color.s,
    randomB: params.color.b,
  };

  // Stack for saving/restoring state
  const stack: Array<{ x: number; y: number; angle: number }> = [];

  // Theta (angle increment)
  const theta = (36 * Math.PI) / 180;

  // Number of steps to process
  const steps = Math.min(params.complexity, production.length);

  // Current repeat count
  let repeats = 1;

  // Process each character
  for (let i = 0; i < steps; i++) {
    // Calculate current shape dimensions exactly as in Java
    const currentW =
      Math.random() *
        (height * params.maxSizeMultiplier -
          height * params.minSizeMultiplier) +
      height * params.minSizeMultiplier;

    const currentH =
      params.heightRatio >= 0 && params.widthRatio >= 0
        ? (currentW * params.heightRatio) / params.widthRatio
        : Math.random() *
            (height * params.maxSizeMultiplier -
              height * params.minSizeMultiplier) +
          height * params.minSizeMultiplier;

    // Apply size multiplier
    const finalW = currentW * params.size;
    const finalH = currentH * params.size;

    // Update color with exactly the same logic as Java
    let randomROld = state.randomR;
    while (
      state.randomR === randomROld ||
      state.randomR * state.randomR === (randomROld + 1) * (randomROld + 1)
    ) {
      state.randomR =
        Math.random() *
          (state.randomR +
            params.lerpFrequency -
            (state.randomR - params.lerpFrequency)) +
        (state.randomR - params.lerpFrequency);
    }

    let randomGOld = state.randomG;
    while (
      state.randomG === randomGOld ||
      state.randomG * state.randomG === (randomGOld + 1) * (randomGOld + 1)
    ) {
      state.randomG =
        Math.random() *
          (state.randomG +
            params.lerpFrequency -
            (state.randomG - params.lerpFrequency)) +
        (state.randomG - params.lerpFrequency);
    }

    let randomBOld = state.randomB;
    while (
      state.randomB === randomBOld ||
      state.randomB * state.randomB === (randomBOld + 1) * (randomBOld + 1)
    ) {
      state.randomB =
        Math.random() *
          (state.randomB +
            params.lerpFrequency -
            (state.randomB - params.lerpFrequency)) +
        (state.randomB - params.lerpFrequency);
    }

    // Create color style
    const [r, g, b] = hsbToRgb(state.randomR, state.randomG, state.randomB);
    const alphaValue = (params.alpha / 255) * (params.color.a / 100);
    const colorStyle = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;

    // Process current character
    const step = production.charAt(i);

    switch (step) {
      case "F":
        // Set stroke and fill styles
        ctx.strokeStyle = colorStyle;
        ctx.lineWidth = params.stroke;

        if (params.alpha > 0) {
          ctx.fillStyle = colorStyle;
        } else {
          ctx.fillStyle = "transparent";
        }

        // Draw shapes
        for (let j = 0; j < repeats; j++) {
          if (params.toggles.line) {
            ctx.beginPath();
            ctx.moveTo(state.x, state.y);
            ctx.lineTo(
              state.x + finalW * Math.cos(state.angle),
              state.y + finalH * Math.sin(state.angle),
            );
            ctx.stroke();
          }

          if (params.toggles.square) {
            ctx.beginPath();
            ctx.rect(state.x, state.y, finalW, finalH);
            if (params.toggles.squareFill) {
              ctx.fill();
            }
            ctx.stroke();
          }

          if (params.toggles.circle) {
            ctx.beginPath();
            ctx.ellipse(
              state.x + finalW / 2,
              state.y + finalH / 2,
              finalW / 2,
              finalH / 2,
              0,
              0,
              Math.PI * 2,
            );
            if (params.toggles.circleFill) {
              ctx.fill();
            }
            ctx.stroke();
          }

          if (params.toggles.triangle) {
            drawTriangle(ctx, state.x, state.y, finalW, finalH);
            if (params.toggles.triangleFill) {
              ctx.fill();
            }
            ctx.stroke();
          }

          if (params.toggles.hexagon) {
            drawHexagon(ctx, state.x, state.y, finalW, finalH);
            if (params.toggles.hexagonFill) {
              ctx.fill();
            }
            ctx.stroke();
          }

          if (params.toggles.cube) {
            drawCube(ctx, state.x, state.y, finalW, finalH);
            if (params.toggles.cubeFill) {
              ctx.fill();
            }
            ctx.stroke();
          }
        }

        // Move exactly as in Java
        state.x += params.scatter;
        state.y += params.scatter;
        repeats = 1;
        break;

      case "+":
        for (let j = 0; j < repeats; j++) {
          state.angle += theta;
        }
        repeats = 1;
        break;

      case "-":
        for (let j = 0; j < repeats; j++) {
          state.angle -= theta;
        }
        repeats = 1;
        break;

      case "*":
        for (let j = 0; j < repeats; j++) {
          state.angle += theta * 2;
        }
        repeats = 1;
        break;

      case "/":
        for (let j = 0; j < repeats; j++) {
          state.angle += theta / 2;
        }
        repeats = 1;
        break;

      case "^":
        for (let j = 0; j < repeats; j++) {
          state.angle += theta * theta;
        }
        repeats = 1;
        break;

      case "$":
        for (let j = 0; j < repeats; j++) {
          state.angle += theta * theta * theta;
        }
        repeats = 1;
        break;

      case "[":
        stack.push({ ...state });
        break;

      case "]":
        if (stack.length > 0) {
          const popped = stack.pop()!;
          state.x = popped.x;
          state.y = popped.y;
          state.angle = popped.angle;
        }
        break;

      default:
        // Check if character is a digit (0-9)
        if (/^\d$/.test(step)) {
          repeats = parseInt(step, 10);
        }
        break;
    }
  }
}
