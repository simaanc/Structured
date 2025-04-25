// components/StructuredCanvas.tsx
import React, { useRef, useEffect } from "react";
import LSystem from "../systems/LSystem";
import { Params } from "../types/types";
import { getSeededRandom } from "../utils/seedSystem";

interface CanvasProps {
  params: Params;
  trigger: number;
  randomSeed?: string; // Add this to pass in the random seed
}

export default function StructuredCanvas({ params, trigger, randomSeed }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sidebarWidth = 320;
    canvas.width = window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;
    canvas.style.marginRight = `${sidebarWidth}px`;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create a seeded random function if a seed is provided
    const randomFunc = randomSeed ? getSeededRandom(randomSeed) : undefined;

    // Pass the seeded random function to the LSystem
    const lsystem = new LSystem({ params, randomFunc });
    lsystem.simulate(params.gens);
    lsystem.render(ctx, canvas.width, canvas.height);
  }, [trigger, randomSeed, params]); // Add randomSeed and params to dependencies

  return (
    <canvas
      ref={canvasRef}
      className="block bg-black"
      style={{ display: "block" }}
    />
  );
}