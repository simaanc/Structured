// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Params } from "../types/types";
import Controls from "../components/Controls";
import StructuredCanvas from "../components/StructuredCanvas";
import { decodeFromSeed } from "../utils/seedSystem";
import {
  saveParamsToCookies,
  loadParamsFromCookies,
  clearParamsCookie,
} from "../utils/cookieStorage";

// Default parameters configuration
const DEFAULT_PARAMS: Params = {
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
};

export default function Page() {
  // State for loading status to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  // Add state for random seed
  const [randomSeed, setRandomSeed] = useState<string | undefined>(undefined);

  // Trigger state for "Generate"
  const [trigger, setTrigger] = useState(0);

  // First, mark client-side rendering on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved parameters from cookies after client is ready
  useEffect(() => {
    if (isClient) {
      const savedParams = loadParamsFromCookies();
      if (savedParams) {
        setParams(savedParams);
      }
    }
  }, [isClient]);

  // Save parameters to cookies whenever they change (only after client is ready)
  useEffect(() => {
    if (isClient) {
      saveParamsToCookies(params);
    }
  }, [params, isClient]);

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

  // Function to reset to defaults
  const resetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    clearParamsCookie(); // Clear the cookie when resetting
    setTrigger((t) => t + 1);
  }, []);

  // Hit Enter to regenerate
  useEffect(() => {
    if (!isClient) return;

    const onKey = (e: KeyboardEvent) => e.key === "Enter" && onGenerate();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onGenerate, isClient]);

  return (
    <main className="flex h-screen">
      {/* 
        Always render the main UI, but show loading state when on client 
        and cookies haven't been loaded yet
      */}
      {isClient ? (
        <>
          <Controls
            params={params}
            setParams={setParams}
            onGenerate={onGenerate}
            loadSeed={loadSeed}
            randomSeed={randomSeed}
            resetToDefaults={resetToDefaults}
          />
          <StructuredCanvas
            params={params}
            trigger={trigger}
            randomSeed={randomSeed}
          />
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      )}
    </main>
  );
}
