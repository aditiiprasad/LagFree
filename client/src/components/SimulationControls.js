import React from 'react';

const Slider = ({ label, min, max, step, value, onChange, unit, isEnabled }) => (
  <div className="flex flex-col">
    <label htmlFor={label} className="flex justify-between text-sm font-medium text-gray-300">
      <span>{label}</span>
      <span className="font-bold text-cyan-400">{value} {unit}</span>
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
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className={`p-4 bg-gray-800 rounded-lg shadow-md ${!isEnabled ? 'opacity-60' : ''}`}>
      <h3 className="text-lg font-semibold text-white mb-3">Manual Simulation Controls</h3>
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
      {!isEnabled && (
        <div className="text-xs text-center text-gray-400 mt-3 italic">
          Enable "Manual Sim" mode to use these controls.
        </div>
      )}
    </div>
  );
};

export default SimulationControls;