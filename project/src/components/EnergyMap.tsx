import React from 'react';
import { MapPin, Sun, Wind, Zap } from 'lucide-react';
import { Region } from '../types';

interface EnergyMapProps {
  regions: Region[];
}

const EnergyMap: React.FC<EnergyMapProps> = ({ regions }) => {
  const getRegionIcon = (region: Region) => {
    if (region.solar && region.solar > region.wind!) return <Sun className="h-4 w-4 text-yellow-600" />;
    if (region.wind && region.wind > region.solar!) return <Wind className="h-4 w-4 text-blue-600" />;
    return <Zap className="h-4 w-4 text-purple-600" />;
  };

  const getRegionColor = (region: Region) => {
    if (region.solar && region.solar > region.wind!) return 'bg-yellow-100 border-yellow-300';
    if (region.wind && region.wind > region.solar!) return 'bg-blue-100 border-blue-300';
    return 'bg-purple-100 border-purple-300';
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <MapPin className="h-5 w-5" />
        <span>Energy Regions Map</span>
      </h3>

      {/* Mock Map Container */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500 mb-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Interactive Energy Distribution Map</p>
          <p className="text-xs">Regions showing renewable energy usage</p>
        </div>

        {/* Region Markers */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`p-3 rounded-lg border-2 ${getRegionColor(region)} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {getRegionIcon(region)}
                <span className="font-medium text-gray-800 text-sm">{region.name}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Solar: {region.solar ? region.solar.toFixed(1) : 'N/A'} kWh</div>
                <div>Wind: {region.wind ? region.wind.toFixed(1) : 'N/A'} kWh</div>
                <div>Load: {region.load ? region.load.toFixed(1) : 'N/A'} kWh</div>
                <div>Points: {region.points || 0}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <Sun className="h-3 w-3 text-yellow-600" />
            <span>Solar Dominant</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3 text-blue-600" />
            <span>Wind Dominant</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-purple-600" />
            <span>Grid Dependent</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-yellow-50 p-3 rounded-lg">
          <Sun className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-yellow-600">
            {regions.filter(r => r.solar! > r.wind!).length}
          </div>
          <div className="text-xs text-gray-600">Solar Dominant</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Wind className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-600">
            {regions.filter(r => r.wind! > r.solar!).length}
          </div>
          <div className="text-xs text-gray-600">Wind Dominant</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-600">
            {regions.filter(r => r.solar === r.wind).length}
          </div>
          <div className="text-xs text-gray-600">Balanced/Grid</div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMap;
