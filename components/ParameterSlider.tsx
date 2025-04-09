// src/components/ParameterSlider.tsx
import React from 'react';

interface ParameterSliderProps {
  label: string; 
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  disabled?: boolean;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange,
  format = (val) => Math.round(val).toString(),
  disabled = false
}) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-gray-300">{format(value)}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={disabled}
      />
    </div>
  );
};

export default ParameterSlider;