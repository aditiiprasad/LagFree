import React from 'react';
import Card from './ui/Card'; 

const Slider = ({ label, min, max, step, value, onChange, unit, isEnabled }) => (
  <div className="flex flex-col">
    <label htmlFor={label} className="flex justify-between text-sm font-medium text-gray-300">
      <span>{label}</span>
      <span className="font-bold text-neon-green">{value} {unit}</span>
    </label>
    <input
      id={label}
      type="range"
      name={label.toLowerCase()}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      disabled={!isEnabled}
      
      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-neon-green
                 disabled:opacity-50 disabled:cursor-not-allowed
                 bg-gray-700"
    />
  </div>
);

const SimulationControls = ({ manualInputs, setManualInputs, isEnabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setManualInputs(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
   
    <Card className={`w-full ${!isEnabled ? 'opacity-60 grayscale' : ''}`}>
      <h3 className="text-lg font-semibold text-white mb-3">Manual Simulation</h3>
      <div className="space-y-4">
        <Slider
          label="Bandwidth"
          min={1} max={10} step={0.5}
          value={manualInputs.bandwidth}
          onChange={handleChange}
          unit="Mbps"
          isEnabled={isEnabled}
        />
        <Slider
          label="Buffer"
          min={0} max={10} step={0.5}
          value={manualInputs.buffer}
          onChange={handleChange}
          unit="sec"
          isEnabled={isEnabled}
        />
        <Slider
          label="Delay"
          min={10} max={400} step={10}
          value={manualInputs.delay}
          onChange={handleChange}
          unit="ms"
          isEnabled={isEnabled}
        />
      </div>
    </Card>
  );
};

export default SimulationControls;