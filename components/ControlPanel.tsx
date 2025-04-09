// src/components/ControlPanel.tsx
import React from 'react';
import ParameterSlider from './ParameterSlider';
import OptionsToggle from './OptionsToggle';
import ColorPicker from './ColorPicker';
import { SystemParams } from '../lib/types';

interface ControlPanelProps {
  params: SystemParams;
  updateParam: (key: string, value: number) => void;
  updateToggle: (key: string, value: boolean) => void;
  updateColor: (key: string, value: number) => void;
  onGenerate: () => void;
  onSave: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  params, 
  updateParam, 
  updateToggle, 
  updateColor, 
  onGenerate, 
  onSave 
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Controls</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Color Picker */}
        <ColorPicker
          color={params.color}
          onChange={updateColor}
        />
        
        {/* Sliders */}
        <ParameterSlider
          label="Alpha"
          value={params.alpha}
          min={0}
          max={255}
          onChange={(value: number) => updateParam('alpha', value)}
        />
        
        <ParameterSlider
          label="Complexity"
          value={params.complexity}
          min={0}
          max={500}
          onChange={(value: number) => updateParam('complexity', value)}
        />
        
        <ParameterSlider
          label="Stroke"
          value={params.stroke}
          min={1}
          max={10}
          onChange={(value: number) => updateParam('stroke', value)}
        />
        
        <ParameterSlider
          label="Generations"
          value={params.gens}
          min={1}
          max={8}
          onChange={(value: number) => updateParam('gens', value)}
        />
        
        <ParameterSlider
          label="Axiom Amount"
          value={params.axiomAmount}
          min={1}
          max={10}
          onChange={(value: number) => updateParam('axiomAmount', value)}
        />
        
        <ParameterSlider
          label="Scatter"
          value={params.scatter}
          min={0}
          max={100}
          onChange={(value: number) => updateParam('scatter', value)}
        />
        
        <ParameterSlider
          label="Size"
          value={params.size}
          min={0.1}
          max={2}
          step={0.01}
          onChange={(value: number) => updateParam('size', value)}
          format={(value: number) => value.toFixed(2)}
        />
        
        <ParameterSlider
          label="Min Size Multiplier"
          value={params.minSizeMultiplier}
          min={0.05}
          max={0.5}
          step={0.01}
          onChange={(value: number) => {
            updateParam('minSizeMultiplier', value);
            if (params.toggles.sizeLink) {
              updateParam('maxSizeMultiplier', value);
            }
          }}
          format={(value: number) => value.toFixed(2)}
        />
        
        <ParameterSlider
          label="Max Size Multiplier"
          value={params.maxSizeMultiplier}
          min={0.05}
          max={0.5}
          step={0.01}
          onChange={(value: number) => updateParam('maxSizeMultiplier', value)}
          format={(value: number) => value.toFixed(2)}
          disabled={params.toggles.sizeLink}
        />
        
        <ParameterSlider
          label="Width Ratio"
          value={params.widthRatio}
          min={0.1}
          max={2}
          step={0.01}
          onChange={(value: number) => {
            updateParam('widthRatio', value);
            if (params.toggles.ratioLink) {
              updateParam('heightRatio', value);
            }
          }}
          format={(value: number) => value.toFixed(2)}
        />
        
        <ParameterSlider
          label="Height Ratio"
          value={params.heightRatio}
          min={0.1}
          max={2}
          step={0.01}
          onChange={(value: number) => updateParam('heightRatio', value)}
          format={(value: number) => value.toFixed(2)}
          disabled={params.toggles.ratioLink}
        />
        
        <ParameterSlider
          label="Lerp Frequency"
          value={params.lerpFrequency}
          min={0}
          max={100}
          onChange={(value: number) => updateParam('lerpFrequency', value)}
        />
        
        {/* Toggle Options */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Shape Options</h3>
          <div className="grid grid-cols-3 gap-2">
            <OptionsToggle
              options={[
                { key: 'line', label: 'Line' },
                { key: 'square', label: 'Square' },
                { key: 'circle', label: 'Circle' },
                { key: 'triangle', label: 'Triangle' },
                { key: 'hexagon', label: 'Hexagon' },
                { key: 'cube', label: 'Cube' }
              ]}
              selectedOptions={params.toggles}
              onChange={(key: string) => updateToggle(key, !params.toggles[key as keyof typeof params.toggles])}
              activeColor="bg-blue-600"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Fill Options</h3>
          <div className="grid grid-cols-3 gap-2">
            <OptionsToggle
              options={[
                { key: 'squareFill', label: 'Square' },
                { key: 'circleFill', label: 'Circle' },
                { key: 'triangleFill', label: 'Triangle' },
                { key: 'hexagonFill', label: 'Hexagon' },
                { key: 'cubeFill', label: 'Cube' }
              ]}
              selectedOptions={params.toggles}
              onChange={(key: string) => updateToggle(key, !params.toggles[key as keyof typeof params.toggles])}
              activeColor="bg-green-600"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Linking Options</h3>
          <div className="grid grid-cols-2 gap-2">
            <OptionsToggle
              options={[
                { key: 'ratioLink', label: 'Link Ratio' },
                { key: 'sizeLink', label: 'Link Size' }
              ]}
              selectedOptions={params.toggles}
              onChange={(key: string) => updateToggle(key, !params.toggles[key as keyof typeof params.toggles])}
              activeColor="bg-purple-600"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
            onClick={onGenerate}
          >
            Generate
          </button>
          
          <button 
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;