// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import StructuredCanvas from '../components/StructuredCanvas';
import ControlPanel from '../components/ControlPanel';
import { SystemParams } from '../lib/types';
import { generateExactJavaMatch } from '../lib/java-match-lsystem';

// Default parameters
const DEFAULT_PARAMS: SystemParams = {
  alpha: 120,
  complexity: 255,
  stroke: 2,
  gens: 5,
  axiomAmount: 5,
  scatter: 50,
  size: 0.7,
  lerpFrequency: 30,
  maxSizeMultiplier: 0.15,
  minSizeMultiplier: 0.15,
  widthRatio: 0.55,
  heightRatio: 0.55,
  color: {
    h: 180,
    s: 100,
    b: 100,
    a: 100
  },
  toggles: {
    line: true,
    square: true,
    circle: true,
    triangle: true,
    hexagon: true,
    cube: false,
    squareFill: true,
    circleFill: true,
    triangleFill: true,
    hexagonFill: true,
    cubeFill: false,
    ratioLink: true,
    sizeLink: true
  }
};

export default function Home() {
  // Canvas size state
  const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({ width: 800, height: 600 });
  
  // State for L-system production
  const [production, setProduction] = useState<string>("");
  
  // State for all the parameters
  const [params, setParams] = useState<SystemParams>(DEFAULT_PARAMS);
  
  // Update parameter helper - memoized for better performance
  const updateParam = useCallback((key: string, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  // Update toggle helper - memoized for better performance
  const updateToggle = useCallback((key: string, value: boolean) => {
    setParams(prev => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [key]: value
      }
    }));
  }, []);
  
  // Update color helper - memoized for better performance
  const updateColor = useCallback((key: string, value: number) => {
    setParams(prev => ({
      ...prev,
      color: {
        ...prev.color,
        [key]: value
      }
    }));
  }, []);
  
  // Generate artwork handler - Exact match to Java version
  const handleGenerate = useCallback(() => {
    // Generate production using our Java-matching algorithm
    const newProduction = generateExactJavaMatch(params.axiomAmount, params.gens);
    setProduction(newProduction);
    
    // Save settings to localStorage
    localStorage.setItem('structuredSettings', JSON.stringify(params));
  }, [params]);
  
  // Save artwork handler
  const handleSave = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Create a download link
      const link = document.createElement('a');
      link.download = `structured-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, []);
  
  // Handle window resize
  const handleResize = useCallback(() => {
    setCanvasSize({
      width: Math.min(window.innerWidth - 40, 1200),
      height: Math.min(window.innerHeight - 300, 800)
    });
  }, []);
  
  // Load saved settings on first render
  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('structuredSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setParams(parsedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
    
    // Initialize canvas size based on window
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Initial artwork generation is deferred to avoid blocking the UI
    setTimeout(() => {
      const initialProduction = generateExactJavaMatch(params.axiomAmount, params.gens);
      setProduction(initialProduction);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  
  return (
    <main className="flex flex-col items-center w-full p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Structured</h1>
      
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="md:w-2/3">
          <StructuredCanvas
            production={production}
            params={params}
            width={canvasSize.width}
            height={canvasSize.height}
            useJavaMatch={true}
          />
        </div>
        
        <div className="md:w-1/3">
          <ControlPanel
            params={params}
            updateParam={updateParam}
            updateToggle={updateToggle}
            updateColor={updateColor}
            onGenerate={handleGenerate}
            onSave={handleSave}
          />
        </div>
      </div>
    </main>
  );
}