// src/components/ColorPicker.tsx
import React, { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { ColorParams } from '../lib/types';

interface ColorPickerProps {
  color: ColorParams;
  onChange: (key: string, value: number) => void;
}

// Helper function to convert hex to HSBA
const hexToHSB = (hex: string): { h: number; s: number; b: number } => {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  // Calculate brightness
  const brightness = max * 100;
  
  // Calculate saturation
  const saturation = max === 0 ? 0 : (delta / max) * 100;
  
  // Calculate hue
  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  
  return { h: hue, s: saturation, b: brightness };
};

// Helper function to convert HSBA to hex
const hsbToHex = (h: number, s: number, b: number): string => {
  s /= 100;
  b /= 100;
  
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  
  const r = Math.round(255 * f(5));
  const g = Math.round(255 * f(3));
  const blue = Math.round(255 * f(1));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentHex, setCurrentHex] = useState(hsbToHex(color.h, color.s, color.b));
  
  const handleHexChange = (newHex: string) => {
    setCurrentHex(newHex);
    const hsb = hexToHSB(newHex);
    
    onChange('h', hsb.h);
    onChange('s', hsb.s);
    onChange('b', hsb.b);
  };
  
  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('a', parseInt(e.target.value));
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Color</label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-md border border-gray-600 cursor-pointer"
          style={{
            backgroundColor: `hsla(${color.h}, ${color.s}%, ${color.b}%, ${color.a/100})`
          }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <span className="text-sm">
          H: {Math.round(color.h)}° S: {Math.round(color.s)}% B: {Math.round(color.b)}% A: {Math.round(color.a)}%
        </span>
      </div>
      
      {showPicker && (
        <div className="mt-2 p-3 bg-gray-800 rounded-md border border-gray-700">
          <div className="mb-4">
            <HexColorPicker color={currentHex} onChange={handleHexChange} />
          </div>
          
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs">Hex:</span>
            <HexColorInput 
              color={currentHex} 
              onChange={handleHexChange}
              className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm w-24"
              prefixed 
            />
          </div>
          
          <div className="mb-2">
            <label className="text-xs mb-1 block">Alpha: {color.a}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={color.a}
              onChange={handleAlphaChange}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPicker(false)}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;