// src/components/OptionsToggle.tsx
import React from 'react';
import { ToggleParams } from '../lib/types';

interface Option {
  key: string;
  label: string;
}

interface OptionsToggleProps {
  options: Option[];
  selectedOptions: ToggleParams | Record<string, boolean>;
  onChange: (key: string) => void;
  activeColor?: string;
}

const OptionsToggle: React.FC<OptionsToggleProps> = ({ 
  options, 
  selectedOptions, 
  onChange, 
  activeColor = 'bg-blue-600' 
}) => {
  return (
    <>
      {options.map(option => (
        <button
          key={option.key}
          className={`px-2 py-1 text-sm rounded-md ${selectedOptions[option.key as keyof typeof selectedOptions] ? activeColor : 'bg-gray-700'} transition-colors duration-150 hover:bg-opacity-90`}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </>
  );
};

export default OptionsToggle;