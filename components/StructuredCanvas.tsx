// src/components/StructuredCanvas.tsx
import React, { useRef, useEffect } from 'react';
import { renderLSystem } from '../lib/renderer';
import { SystemParams, Operation, CanvasSize } from '../lib/types';

interface StructuredCanvasProps {
  production: string | Operation[];
  params: SystemParams;
  width: number;
  height: number;
}

const StructuredCanvas: React.FC<StructuredCanvasProps> = ({ 
  production, 
  params, 
  width, 
  height 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!production) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Render L-system
    renderLSystem(production, ctx, canvas.width, canvas.height, params);
  }, [production, params, width, height]);
  
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