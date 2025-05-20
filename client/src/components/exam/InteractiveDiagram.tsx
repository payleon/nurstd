import React, { useState } from 'react';

export interface InteractiveDiagramProps {
  imageSrc: string;
  imageAlt: string;
  hotspots: {
    id: string;
    x: number;
    y: number;
    label: string;
    description?: string;
    isCorrect?: boolean;
  }[];
  onHotspotClick?: (id: string) => void;
  showFeedback?: boolean;
  selectedHotspots?: string[];
}

export function InteractiveDiagram({
  imageSrc,
  imageAlt,
  hotspots,
  onHotspotClick,
  showFeedback = false,
  selectedHotspots = []
}: InteractiveDiagramProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  const handleHotspotClick = (id: string) => {
    if (onHotspotClick) {
      onHotspotClick(id);
    }
    setActiveHotspot(activeHotspot === id ? null : id);
  };
  
  const getHotspotStyle = (hotspot: { id: string; isCorrect?: boolean }) => {
    if (!showFeedback) {
      return selectedHotspots.includes(hotspot.id) 
        ? 'bg-blue-500 ring-4 ring-blue-300' 
        : 'bg-gray-400 hover:bg-blue-400';
    }
    
    // Show feedback
    if (selectedHotspots.includes(hotspot.id)) {
      // User selected this hotspot
      return hotspot.isCorrect 
        ? 'bg-green-500 ring-4 ring-green-300' // Correct selection
        : 'bg-red-500 ring-4 ring-red-300';    // Incorrect selection
    } else {
      // User didn't select this hotspot
      return hotspot.isCorrect 
        ? 'bg-yellow-500 ring-4 ring-yellow-300' // Should have selected
        : 'bg-gray-400';                         // Correctly not selected
    }
  };
  
  return (
    <div className="relative border border-gray-300 rounded-md bg-white">
      <div className="relative max-w-full overflow-hidden">
        <img src={imageSrc} alt={imageAlt} className="max-w-full h-auto" />
        
        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
              getHotspotStyle(hotspot)
            }`}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={() => handleHotspotClick(hotspot.id)}
            aria-label={hotspot.label}
          />
        ))}
        
        {/* Hotspot tooltips */}
        {activeHotspot && (
          <div className="absolute left-0 right-0 bottom-0 bg-black bg-opacity-70 text-white p-2 text-sm">
            {hotspots.find(h => h.id === activeHotspot)?.label || ''}
          </div>
        )}
      </div>
      
      {/* Legend when showing feedback */}
      {showFeedback && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Correct selection</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Incorrect selection</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Missed correct answer</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
            <span>Unselected (correct)</span>
          </div>
        </div>
      )}
    </div>
  );
}