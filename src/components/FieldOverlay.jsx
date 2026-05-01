import React, { useState, useEffect } from 'react'
import { matchConfig as defaultConfig } from '../config'

export function FieldOverlay() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('matchConfig')
    const parsed = saved ? JSON.parse(saved) : {}
    return { ...defaultConfig, ...parsed }
  })

  useEffect(() => {
    const channel = new BroadcastChannel('football_graphics_channel')
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_CONFIG') {
        setConfig(event.data.payload)
      }
    }
    return () => channel.close()
  }, [])

  return (
    <div className="w-screen h-screen bg-transparent relative font-inter"
         style={{ perspective: '1200px' }}>
      
      {/* Version Tag (Debug) */}
      <div className="absolute top-4 right-4 text-white/10 text-[10px]">v1.5-Aligned-Giant</div>

      {/* 3D BASE OFFSET */}
      {config.showGrassLogos !== false && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
             style={{ 
               transform: `rotateX(62deg) translateY(${config.logoYOffset || -350}px)`,
               transformStyle: 'preserve-3d'
             }}>
          
          {/* LOGO ROW: Flex with massive gap to ensure perfect separation */}
          <div className="flex items-center justify-center gap-[800px] w-full">
            {/* Home Team Logo */}
            <div className="w-[500px] h-[500px] flex items-center justify-center">
              <img src={config.teamA.logo} 
                   alt={config.teamA.name} 
                   className="w-full h-full object-contain mix-blend-multiply opacity-95 filter saturate-[0.85] contrast-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Tournament Logo Center */}
            <div className="w-[700px] h-auto flex items-center justify-center">
              {config.centerLogo && (
                <img src={config.centerLogo} 
                     alt="Tournament" 
                     className="w-full h-auto object-contain mix-blend-multiply opacity-95 filter saturate-[0.85] contrast-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
              )}
            </div>

            {/* Away Team Logo */}
            <div className="w-[500px] h-[500px] flex items-center justify-center">
              <img src={config.teamB.logo} 
                   alt={config.teamB.name} 
                   className="w-full h-full object-contain mix-blend-multiply opacity-95 filter saturate-[0.85] contrast-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BRANDING SECTION: Integrated look */}
      {config.showSponsors && (
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 flex flex-col items-center w-full"
             style={{ 
               transform: `rotateX(62deg) translateY(${config.sponsorYOffset || 0}px)`,
               transformStyle: 'preserve-3d'
             }}>
          
          {/* 4 Colored Sponsor Boxes */}
          <div className="flex items-center justify-center gap-1 w-full mb-8">
            {[
              { color: '#d2111c' }, // Scotiabank Red
              { color: '#004d9c' }, // Allstate Blue
              { color: '#001a3e' }, // Modelo Dark
              { color: '#000000', border: 'border border-white/20' } // Nike Black
            ].map((style, idx) => (
              <div key={idx} 
                   className={`w-[320px] h-[90px] flex items-center justify-center overflow-hidden ${style.border || ''} shadow-2xl opacity-100`}
                   style={{ backgroundColor: style.color }}>
                {config.brandingLogos?.[idx]?.url && (
                  <img src={config.brandingLogos[idx].url} 
                       alt="Brand" 
                       className="w-full h-full object-contain" />
                )}
              </div>
            ))}
          </div>

          {/* Slogan - Integrated into the turf */}
          <div className="text-center w-full">
            <h1 className="text-white font-black italic uppercase leading-none tracking-tighter"
                style={{ 
                  fontSize: '85px',
                  transform: 'scaleX(2.0) scaleY(1.1)',
                  textShadow: '0 5px 15px rgba(0,0,0,0.5)',
                  whiteSpace: 'nowrap'
                }}>
              {config.brandingText || "TOURNAMENT SLOGAN"}
            </h1>
          </div>
        </div>
      )}

    </div>
  )
}
