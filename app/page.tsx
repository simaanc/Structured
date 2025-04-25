// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Params } from '../types/types';
import Controls from '../components/Controls';
import StructuredCanvas from '../components/StructuredCanvas';

export default function Page() {
  const [params, setParams] = useState<Params>({
    gens: 4,
    complexity: 200,
    opacity: 255,
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
      circle: false,
      triangle: false,
      hex: false,
      cube: false,
      squareFill: false,
      circleFill: false,
      triangleFill: false,
      hexFill: false,
      cubeFill: false,
    },
  });

  // trigger state for “Generate”
  const [trigger, setTrigger] = useState(0);
  const onGenerate = useCallback(() => setTrigger(t => t + 1), []);

  // hit Enter to regenerate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Enter' && onGenerate();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onGenerate]);

  return (
    <main className="flex h-screen">
      <Controls params={params} setParams={setParams} onGenerate={onGenerate} />
      <StructuredCanvas params={params} trigger={trigger} />
    </main>
  );
}
