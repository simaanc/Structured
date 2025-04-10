// src/components/StructuredCanvas.tsx
import React, { useRef, useEffect } from 'react';
import { renderLSystem } from '../lib/renderer';
import { renderJavaMatch } from '../lib/renderer-java-match';
import { SystemParams, Operation } from '../lib/types';

interface StructuredCanvasProps {
  production: string | Operation[];
  params: SystemParams;
  width: number;
  height: number;
  useJavaMatch?: boolean;
}

const StructuredCanvas: React.FC<StructuredCanvasProps> = ({ 
  production, 
  params, 
  width, 
  height,
  useJavaMatch = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!production) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render using the Java-matching renderer if specified
    if (useJavaMatch && typeof production === 'string') {
      renderJavaMatch(production, ctx, canvas.width, canvas.height, params);
    } 
    // Otherwise use the standard renderer
    else {
      renderLSystem(production, ctx, canvas.width, canvas.height, params);
    }
  }, [production, params, width, height, useJavaMatch]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="bg-black border border-gray-700 rounded-lg"
    />
  );
};

export default StructuredCanvas;