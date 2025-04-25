// components/StructuredCanvas.tsx
"use client";

import React, { useRef, useEffect } from "react";
import LSystem from "../systems/LSystem";
import { Params } from "../types/types";

interface CanvasProps {
  params: Params;
  trigger: number;
}

export default function StructuredCanvas({ params, trigger }: CanvasProps) {
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

    const lsystem = new LSystem({ params });
    lsystem.simulate(params.gens);
    lsystem.render(ctx, canvas.width, canvas.height);
  }, [trigger]); // only re-run when trigger changes

  return (
    <canvas
      ref={canvasRef}
      className="block bg-black"
      style={{ display: "block" }}
    />
  );
}