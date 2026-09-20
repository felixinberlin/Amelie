import React, { useState } from 'react';

// 1. Define the types for the props App.tsx is trying to pass
export interface InteractiveTinSandboxesProps {
  lang: any; // Replace 'any' with your actual Language type if imported (e.g., 'en' | 'de' | 'es')
  initialSandbox?: "altbau" | "glasanflug" | "streiflicht" | "wetink" | "balkon" | "regenwasser" | "klarlokal" | "crackflora";
}

const R_SI_CORNER = 0.25;

// 2. Apply the interface to the component and destructure the props
export const InteractiveTinSandboxes: React.FC<InteractiveTinSandboxesProps> = ({ 
  lang, 
  initialSandbox = "altbau" 
}) => {
  // State for the previously missing variables
  const [wallArea, setWallArea] = useState<number>(100);
  const [windowArea, setWindowArea] = useState<number>(20);
  const [deltaT, setDeltaT] = useState<number>(20);

  // State for the other variables used in the formulas
  const [wallU, setWallU] = useState<number>(1.2);
  const [windowU, setWindowU] = useState<number>(2.8);
  const [roomVolume, setRoomVolume] = useState<number>(150);
  const [airChangeRate, setAirChangeRate] = useState<number>(0.5);
  const [roomTemp, setRoomTemp] = useState<number>(20);
  const [uScale, setUScale] = useState<number>(1.0);
  const [nScale, setNScale] = useState<number>(1.0);

  // The formulas
  const transmissionHeatLoss =
    (wallU * wallArea + windowU * windowArea) * uScale * deltaT;

  const ventilationHeatLoss =
    0.34 * roomVolume * airChangeRate * nScale * deltaT;

  const cornerTempAt = (scale: number) =>
    roomTemp - wallU * scale * R_SI_CORNER * deltaT;

  const totalHeatLoss = transmissionHeatLoss + ventilationHeatLoss;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex justify-between items-end border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Interactive Thermal Sandbox</h2>
        <div className="text-sm text-gray-500">
          Sandbox: <span className="font-mono">{initialSandbox}</span> | Lang: <span className="font-mono">{String(lang)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg border-b pb-2">Parameters</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delta T (Temperature Difference): {deltaT} K
            </label>
            <input 
              type="range" min="0" max="40" value={deltaT}
              onChange={(e) => setDeltaT(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wall Area: {wallArea} m²
            </label>
            <input 
              type="range" min="10" max="300" value={wallArea}
              onChange={(e) => setWallArea(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Window Area: {windowArea} m²
            </label>
            <input 
              type="range" min="2" max="100" value={windowArea}
              onChange={(e) => setWindowArea(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              U-Scale Multiplier: {uScale.toFixed(2)}
            </label>
            <input 
              type="range" min="0.1" max="2" step="0.1" value={uScale}
              onChange={(e) => setUScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-lg text-blue-900 border-b border-blue-200 pb-2">
            Calculations
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Transmission Loss:</span>
              <span className="font-mono">{transmissionHeatLoss.toFixed(1)} W</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Ventilation Loss:</span>
              <span className="font-mono">{ventilationHeatLoss.toFixed(1)} W</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="font-semibold text-gray-800">Total Heat Loss:</span>
              <span className="font-mono font-bold text-red-600">
                {totalHeatLoss.toFixed(1)} W
              </span>
            </div>

            <div className="flex justify-between pt-4">
              <span className="text-gray-600">Corner Surface Temp:</span>
              <span className={`font-mono font-bold ${cornerTempAt(uScale) < 12.6 ? 'text-red-600' : 'text-green-600'}`}>
                {cornerTempAt(uScale).toFixed(1)} °C
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTinSandboxes;