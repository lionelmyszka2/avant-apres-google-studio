import React, { useState, useEffect, useRef } from 'react';
import { SliderConfig } from '../types';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface SliderPreviewProps {
  beforeImage: string;
  afterImage: string;
  config: SliderConfig;
}

export const SliderPreview: React.FC<SliderPreviewProps> = ({ beforeImage, afterImage, config }) => {
  const [position, setPosition] = useState(config.initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const isVertical = config.orientation === 'vertical';

  const handleMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    let newPos;
    if (isVertical) {
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      newPos = (y / rect.height) * 100;
    } else {
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      newPos = (x / rect.width) * 100;
    }
    setPosition(newPos);
  };

  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true);
    // Optional: Update position immediately on click
    handleMove(e);
  };
  
  const stopResize = () => setIsResizing(false);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', stopResize);
      window.addEventListener('touchend', stopResize);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('touchend', stopResize);
    };
  }, [isResizing, isVertical]);

  return (
    <div 
      className="relative inline-block max-w-full select-none shadow-lg rounded-xl overflow-hidden border border-gray-200"
      ref={containerRef}
      onMouseDown={startResize}
      onTouchStart={startResize}
      style={{ 
        cursor: isVertical ? 'ns-resize' : 'ew-resize',
        // We let the image define the dimensions, no fixed height/width here
      }}
    >
      {/* Base Image (After) - Determines container size */}
      <img 
        src={afterImage} 
        alt="After" 
        className="block w-full h-auto max-h-[70vh] object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Label After */}
      {config.afterLabel && (
        <div className={`
          absolute z-10 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none
          ${isVertical ? 'bottom-3 left-3' : 'top-3 right-3'}
        `}>
          {config.afterLabel}
        </div>
      )}

      {/* Overlay Image (Before) - Clipped */}
      <img 
        src={beforeImage}
        alt="Before"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        draggable={false}
        style={{ 
          clipPath: isVertical 
            ? `inset(0 0 ${100 - position}% 0)` 
            : `inset(0 ${100 - position}% 0 0)`
        }}
      />
      
      {/* Label Before (Visible only if clipped area allows, but we usually place it top-left which is safe for 'Before' unless slider is at 0) */}
      {config.beforeLabel && (
        <div 
          className={`
            absolute z-10 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none
            ${isVertical ? 'top-3 left-3' : 'top-3 left-3'}
          `}
          // We could adjust opacity based on position to hide label if image is hidden
          style={{ opacity: position < 10 ? 0 : 1, transition: 'opacity 0.2s' }}
        >
          {config.beforeLabel}
        </div>
      )}

      {/* Slider Handle */}
      <div 
        className="absolute z-20 flex items-center justify-center pointer-events-none"
        style={{
          left: isVertical ? '0' : `${position}%`,
          top: isVertical ? `${position}%` : '0',
          width: isVertical ? '100%' : '4px',
          height: isVertical ? '4px' : '100%',
          backgroundColor: config.sliderColor,
          transform: isVertical ? 'translateY(-50%)' : 'translateX(-50%)',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        <div 
          className="flex items-center justify-center rounded-lg text-white shadow-sm"
          style={{
            width: isVertical ? '40px' : '24px',
            height: isVertical ? '24px' : '40px',
            backgroundColor: config.sliderColor
          }}
        >
          {isVertical ? (
             <div className="flex flex-col items-center">
                 <ChevronUp size={14} className="-mb-1"/>
                 <ChevronDown size={14} className="-mt-1"/>
             </div>
          ) : (
            <div className="flex flex-row items-center">
                <ChevronLeft size={14} className="-mr-1" />
                <ChevronRight size={14} className="-ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};