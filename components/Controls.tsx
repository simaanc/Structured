// components/Controls.tsx
"use client";

import React from "react";
import { HsvColorPicker, HexColorInput } from "react-colorful";
import CSystem from "../systems/CSystem";
import C2S from "canvas2svg";
import { Params } from "../types/types";

/** HSB → RGB */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hh = (h % 360) / 60,
    sat = s / 100,
    val = v / 100;
  const c = val * sat,
    x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hh < 1) [r1, g1, b1] = [c, x, 0];
  else if (hh < 2) [r1, g1, b1] = [x, c, 0];
  else if (hh < 3) [r1, g1, b1] = [0, c, x];
  else if (hh < 4) [r1, g1, b1] = [0, x, c];
  else if (hh < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = val - c;
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

/** RGB → HEX */
function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
}

/** HEX → RGB */
function hexToRgb(hex: string): [number, number, number] | null {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (hex.length !== 6) return null;
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** RGB → HSB */
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const mx = Math.max(rr, gg, bb),
    mn = Math.min(rr, gg, bb),
    d = mx - mn;
  let h = 0;
  if (d !== 0) {
    if (mx === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
    else if (mx === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
  }
  const s = mx ? d / mx : 0;
  return [h, s * 100, mx * 100];
}

type NumericKey =
  | "gens"
  | "axiomAmount"
  | "startLength"
  | "complexity"
  | "lerpFrequency"
  | "minSizeMultiplier"
  | "maxSizeMultiplier"
  | "widthRatio"
  | "heightRatio"
  | "scatter"
  | "thetaDeg"
  | "opacity"
  | "alpha"
  | "strokeWeight";

const sliderConfigs: Array<{
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: "gens", label: "Iterations", min: 1, max: 10, step: 1 },
  { key: "axiomAmount", label: "Initial Branches", min: 1, max: 10, step: 1 },
  {
    key: "startLength",
    label: "Base Segment Length",
    min: 10,
    max: 1000,
    step: 10,
  },
  { key: "complexity", label: "Max Primitives", min: 1, max: 2000, step: 1 },
  { key: "lerpFrequency", label: "Color Drift", min: 0, max: 20, step: 0.5 },
  {
    key: "minSizeMultiplier",
    label: "Min Size Factor",
    min: 0.01,
    max: 5,
    step: 0.01,
  },
  {
    key: "maxSizeMultiplier",
    label: "Max Size Factor",
    min: 0.01,
    max: 5,
    step: 0.01,
  },
  { key: "widthRatio", label: "Width/Height Ratio", min: 0, max: 5, step: 0.1 },
  {
    key: "heightRatio",
    label: "Height/Width Ratio",
    min: 0,
    max: 5,
    step: 0.1,
  },
  { key: "scatter", label: "Position Scatter", min: 0, max: 100, step: 1 },
  { key: "thetaDeg", label: "Turn Angle (°)", min: 0, max: 360, step: 1 },
  { key: "opacity", label: "Fill Opacity", min: 0, max: 255, step: 1 },
  { key: "alpha", label: "Stroke Opacity", min: 0, max: 255, step: 1 },
  {
    key: "strokeWeight",
    label: "Stroke Thickness",
    min: 1,
    max: 10,
    step: 0.5,
  },
];

const shapes: Array<keyof Params["toggleFlags"]> = [
  "line",
  "square",
  "circle",
  "triangle",
  "hex",
  "cube",
];
const fills: Array<keyof Params["toggleFlags"]> = [
  "squareFill",
  "circleFill",
  "triangleFill",
  "hexFill",
  "cubeFill",
];

interface ControlsProps {
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  onGenerate: () => void;
}

export default function Controls({
  params,
  setParams,
  onGenerate,
}: ControlsProps) {
  const hex = React.useMemo(() => {
    const rgb = hsvToRgb(params.startHue, params.startSat, params.startBri);
    return rgbToHex(rgb);
  }, [params.startHue, params.startSat, params.startBri]);

  return (
    <aside className="fixed right-0 top-0 h-full w-80 p-6 bg-gray-900 text-white flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Controls</h2>

      <button
        onClick={onGenerate}
        className="mb-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold">
        Generate New
      </button>

      {sliderConfigs.map(({ key, label, min, max, step }) => (
        <div key={key} className="mb-4">
          <label className="block text-sm mb-1">
            {label}: {params[key]}
          </label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={params[key] as number}
            className="w-full h-2 bg-gray-700 rounded-lg"
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                [key]: Number(e.target.value),
              }))
            }
          />
        </div>
      ))}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Enable Shapes</h3>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((shape) => (
            <label key={shape} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={params.toggleFlags[shape]}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    toggleFlags: {
                      ...prev.toggleFlags,
                      [shape]: e.target.checked,
                    },
                  }))
                }
                className="w-5 h-5 text-blue-400 bg-gray-700 rounded border-gray-600"
              />
              <span className="capitalize">{shape}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Enable Fills</h3>
        <div className="grid grid-cols-2 gap-2">
          {fills.map((fill) => (
            <label key={fill} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={params.toggleFlags[fill]}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    toggleFlags: {
                      ...prev.toggleFlags,
                      [fill]: e.target.checked,
                    },
                  }))
                }
                className="w-5 h-5 text-green-400 bg-gray-700 rounded border-gray-600"
              />
              <span className="capitalize">
                {fill.replace("Fill", " Fill")}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Base Color</h3>
        <HsvColorPicker
          className="w-full h-32 mb-2"
          color={{ h: params.startHue, s: params.startSat, v: params.startBri }}
          onChange={(c) =>
            setParams((prev) => ({
              ...prev,
              startHue: c.h,
              startSat: c.s,
              startBri: c.v,
            }))
          }
        />
        <HexColorInput
          className="w-full mb-2 px-2 py-1 bg-gray-700 rounded text-white"
          color={hex}
          onChange={(newHex) => {
            const rgb = hexToRgb(newHex);
            if (!rgb) return;
            const [h, s, v] = rgbToHsv(...rgb);
            setParams((prev) => ({
              ...prev,
              startHue: Math.round(h),
              startSat: Math.round(s),
              startBri: Math.round(v),
            }));
          }}
        />
        <div className="flex space-x-2">
          <div>
            <label className="text-sm block">Hue</label>
            <input
              type="number"
              min={0}
              max={360}
              value={params.startHue}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  startHue: Math.min(360, Math.max(0, Number(e.target.value))),
                }))
              }
              className="w-20 px-1 py-0.5 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="text-sm block">Sat%</label>
            <input
              type="number"
              min={0}
              max={100}
              value={params.startSat}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  startSat: Math.min(100, Math.max(0, Number(e.target.value))),
                }))
              }
              className="w-20 px-1 py-0.5 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="text-sm block">Bri%</label>
            <input
              type="number"
              min={0}
              max={100}
              value={params.startBri}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  startBri: Math.min(100, Math.max(0, Number(e.target.value))),
                }))
              }
              className="w-20 px-1 py-0.5 bg-gray-700 rounded text-white"
            />
          </div>
        </div>
      </div>

      <button
        className="mt-auto py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
        onClick={() => {
          const sidebar = 320;
          const w = window.innerWidth - sidebar;
          const h = window.innerHeight;
          const svgCtx = new C2S(w, h);
          new CSystem(params).render(svgCtx, w, h);
          const svg = svgCtx.getSerializedSvg();
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "structure.svg";
          a.click();
          URL.revokeObjectURL(url);
        }}>
        Save as SVG
      </button>
    </aside>
  );
}
