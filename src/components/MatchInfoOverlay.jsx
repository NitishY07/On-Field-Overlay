import React, { forwardRef } from 'react'

export const MatchInfoOverlay = forwardRef(({ teamA, teamB, tournamentName, dateInfo, location }, ref) => {
  return (
    <div 
      ref={ref} 
      className="absolute inset-0 flex flex-col items-center justify-start pt-16 opacity-0 pointer-events-none z-10 w-full"
    >
      <div className="glass-panel w-full max-w-6xl px-8 py-10 rounded-2xl flex flex-col items-center relative overflow-hidden">
        {/* Decorative highlights */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-70"></div>
        
        <h2 className="text-brand-gold font-orbitron tracking-widest text-lg font-bold mb-4 uppercase text-center">
          {tournamentName}
        </h2>
        
        <div className="flex items-center gap-4 text-white/80 font-inter text-lg tracking-wider">
          <span>{dateInfo}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  )
})
