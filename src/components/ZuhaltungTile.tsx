import React from 'react';
import type { Zuhaltung } from '../types';

interface ZuhaltungTileProps {
  zuhaltung: Zuhaltung;
  maxPosition: number;
  onSliderChange: (position: number) => void;
  onNotesChange: (notes: string) => void;
  onToggleTesting: () => void;
  onConfirm: () => void;
}

const ZuhaltungTile: React.FC<ZuhaltungTileProps> = ({
  zuhaltung,
  maxPosition,
  onSliderChange,
  onNotesChange,
  onToggleTesting,
  onConfirm,
}) => {
  const getStatusColor = () => {
    switch (zuhaltung.status) {
      case 'unknown':
        return 'status-unknown';
      case 'suspected':
        return 'status-suspected';
      case 'confirmed':
        return 'status-confirmed';
      default:
        return 'bg-gray-600';
    }
  };

  const getBorderStyle = () => {
    if (zuhaltung.isTesting) {
      return 'testing-mode scale-105';
    }
    return '';
  };

  const sliderPercent = ((zuhaltung.position - 1) / (maxPosition - 1)) * 100;

  return (
    <div 
      className={`
        zuhaltung-tile ${getStatusColor()} ${getBorderStyle()}
      `}
      onClick={onToggleTesting}
      style={{ '--slider-percent': `${sliderPercent}%` } as React.CSSProperties}
    >
      {/* Top section: Zuhaltung number with decorative background */}
      <div className="absolute top-3 left-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-sm"></div>
          <div className="relative w-8 h-8 rounded-full bg-gray-900/50 flex items-center justify-center">
            <span className="text-lg font-bold">{zuhaltung.id}</span>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {zuhaltung.isTesting && (
          <div className="text-xs px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Test
          </div>
        )}
        {zuhaltung.status === 'confirmed' && (
          <div className="text-xs px-2 py-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full text-white font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            Bestätigt
          </div>
        )}
      </div>

      {/* Main slider with improved styling */}
      <div className="mb-4 mt-12">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-300 font-medium">POSITION</div>
          <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {zuhaltung.position}/{maxPosition}
          </div>
        </div>
        <input
          type="range"
          min="1"
          max={maxPosition}
          value={zuhaltung.position}
          onChange={(e) => onSliderChange(parseInt(e.target.value))}
          className="slider-track touch-target"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Min</span>
          <span>Max</span>
        </div>
      </div>

      {/* Notes section - only shown in testing mode */}
      {zuhaltung.isTesting && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-300">Notizen</span>
          </div>
          <textarea
            value={zuhaltung.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="z.B. 'fest', 'Klick bei 4', ..."
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-white resize-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-colors"
            rows={2}
            autoFocus
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={zuhaltung.status === 'confirmed'}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            Bestätigen
          </span>
        </button>
        
        {zuhaltung.isTesting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleTesting();
            }}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Fertig
            </span>
          </button>
        )}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-3 right-3">
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-900/50 rounded-full">
          <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('bg-', 'bg-')}`}></div>
          <span className="text-xs text-gray-300">
            {zuhaltung.status === 'unknown' ? 'Unbekannt' : 
             zuhaltung.status === 'suspected' ? 'Vermutung' : 'Bestätigt'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ZuhaltungTile;