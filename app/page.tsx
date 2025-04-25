// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Params } from "../types/types";
import Controls from "../components/Controls";
import StructuredCanvas from "../components/StructuredCanvas";
import { decodeFromSeed } from "../utils/seedSystem";

export default function Page() {
  const [params, setParams] = useState<Params>({
    gens: 4,
    complexity: 200,
    opacity: 100,
    alpha: 255,
    strokeWeight: 1,
    axiomAmount: 3,
    lerpFrequency: 5,
    scatter: 0,
    startHue: 200,
    startSat: 50,
    startBri: 50,
    minSizeMultiplier: 0.1,
    maxSizeMultiplier: 1,
    widthRatio: 1,
    heightRatio: 1,
    thetaDeg: 36,
    startLength: 460,
    toggleFlags: {
      line: true,
      square: false,
      circle: true,
      triangle: true,
      hex: false,
      cube: false,
      squareFill: false,
      circleFill: true,
      triangleFill: false,
      hexFill: false,
      cubeFill: false,
    },
  });

  // Add state for random seed
  const [randomSeed, setRandomSeed] = useState<string | undefined>(undefined);
  
  // trigger state for "Generate"
  const [trigger, setTrigger] = useState(0);
  
  // Update onGenerate to set a new random seed
  const onGenerate = useCallback(() => {
    setRandomSeed(Math.random().toString(36).substring(2, 15));
    setTrigger((t) => t + 1);
  }, []);

  // Function to load a seed
  const loadSeed = useCallback((seedString: string) => {
    try {
      const seedData = decodeFromSeed(seedString);
      if (seedData) {
        setParams(seedData.params);
        setRandomSeed(seedData.randomSeed);
        setTrigger((t) => t + 1); // Trigger a re-render
      }
    } catch (error) {
      console.error("Failed to decode seed:", error);
    }
  }, []);

  // hit Enter to regenerate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Enter" && onGenerate();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onGenerate]);

  return (
    <main className="flex h-screen">
      <Controls 
        params={params} 
        setParams={setParams} 
        onGenerate={onGenerate} 
        loadSeed={loadSeed}
        randomSeed={randomSeed}
      />
      <StructuredCanvas 
        params={params} 
        trigger={trigger}
        randomSeed={randomSeed}
      />
    </main>
  );
}