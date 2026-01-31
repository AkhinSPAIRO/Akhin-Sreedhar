
import React from 'react';
import { Message, Role } from '../types';

interface IntercomBarProps {
  activeTransmission: Message | null;
  isEmergency: boolean;
}

const IntercomBar: React.FC<IntercomBarProps> = ({ activeTransmission, isEmergency }) => {
  return (
    <div className={`h-12 w-full flex items-center justify-between px-4 transition-colors duration-300 border-b ${
      activeTransmission 
        ? 'bg-emerald-600 border-emerald-500' 
        : isEmergency 
          ? 'bg-red-900 border-red-800' 
          : 'bg-slate-950 border-slate-800'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${activeTransmission ? 'bg-white animate-ping' : 'bg-slate-700'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
            {activeTransmission ? 'Intercom Active' : 'Common Channel'}
          </span>
        </div>
        
        {activeTransmission && (
          <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-2">
            <span className="text-xs font-bold text-white uppercase px-1.5 py-0.5 bg-black/20 rounded">
              {activeTransmission.fromRole}: {activeTransmission.from}
            </span>
            <div className="flex gap-0.5 items-end h-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-0.5 bg-white animate-pulse" 
                  style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!activeTransmission && (
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-500 font-bold uppercase hidden md:inline">Channel 001 • All Departments</span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            CONNECTED
          </div>
        </div>
      )}
    </div>
  );
};

export default IntercomBar;
