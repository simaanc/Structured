// types/types.ts
export interface Params {
  gens: number;                 // number of L-System iterations
  complexity: number;           // max primitives to draw
  opacity: number;              // fill alpha 0–255
  alpha: number;                // stroke alpha 0–255
  strokeWeight: number;         // outline thickness
  axiomAmount: number;          // how many initial branches (“[X]++”)
  lerpFrequency: number;        // per-step color jitter
  scatter: number;              // translate each step
  startHue: number;             // base hue 0–360
  startSat: number;             // base saturation 0–100
  startBri: number;             // base brightness 0–100
  minSizeMultiplier: number;    // random size factor min
  maxSizeMultiplier: number;    // random size factor max
  widthRatio: number;           // shape width/height ratio (>=0)
  heightRatio: number;          // shape height/width ratio
  thetaDeg: number;             // turn angle in degrees
  startLength: number;          // initial segment length
  toggleFlags: {
    line: boolean;
    square: boolean;
    circle: boolean;
    triangle: boolean;
    hex: boolean;
    cube: boolean;
    squareFill: boolean;
    circleFill: boolean;
    triangleFill: boolean;
    hexFill: boolean;
    cubeFill: boolean;
  };
}
