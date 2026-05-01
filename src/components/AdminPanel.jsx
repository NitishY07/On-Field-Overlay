import React, { useState, useEffect, useRef } from 'react'
import { Play, Save, RefreshCw } from 'lucide-react'
import { matchConfig as defaultConfig } from '../config'

export function AdminPanel() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('matchConfig')
    const parsed = saved ? JSON.parse(saved) : {}
    return { ...defaultConfig, ...parsed }
  })

  const channelRef = useRef(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel('football_graphics_channel')
    
    // Broadcast initial state just in case graphics load after admin panel
    channelRef.current.postMessage({ type: 'UPDATE_CONFIG', payload: config })
    
    return () => {
      channelRef.current.close()
    }
  }, [])

  const handleChange = (section, field, value, index = null) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      if (index !== null && section === 'brandingLogos') {
        newConfig.brandingLogos = [...newConfig.brandingLogos]
        newConfig.brandingLogos[index] = { ...newConfig.brandingLogos[index], [field]: value }
      } else if (section) {
        newConfig[section] = { ...newConfig[section], [field]: value }
      } else {
        newConfig[field] = value
      }
      return newConfig
    })
  }

  const handleSave = () => {
    localStorage.setItem('matchConfig', JSON.stringify(config))
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'UPDATE_CONFIG', payload: config })
    }
  }

  const handlePlay = () => {
    handleSave() // Save and push latest before playing
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'PLAY' })
    }
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    localStorage.removeItem('matchConfig')
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'UPDATE_CONFIG', payload: defaultConfig })
    }
  }

  const handleFileUpload = (section, field, file, index = null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(section, field, reader.result, index);
      };
      reader.readAsDataURL(file);
    }
  }

  const LogoInput = ({ label, value, onTextChange, onFileChange, placeholder = "URL or data..." }) => (
    <div className="w-full">
      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wider">{label}</label>
      <div className="flex flex-col gap-1.5">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none text-[11px]"
          placeholder={placeholder}
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="text-[10px] text-gray-400 cursor-pointer file:bg-white/5 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-white/10 transition-all"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-brand-blue tracking-tighter">FIELD GRAPHICS CONTROLLER</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Professional 3D Broadcast Overlay System</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleReset}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-all border border-white/5"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-brand-blue hover:bg-blue-400 text-black rounded-lg text-sm font-black shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all"
            >
              <Save className="w-4 h-4" /> PUSH LIVE
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* FIELD LOGOS SECTION */}
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-6 text-white border-l-4 border-brand-blue pl-3 uppercase">Field Logos (Team & Tournament)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LogoInput 
                label="Home Team Logo (Left)"
                value={config.teamA.logo}
                onTextChange={(val) => handleChange('teamA', 'logo', val)}
                onFileChange={(file) => handleFileUpload('teamA', 'logo', file)}
              />
              <LogoInput 
                label="Tournament Center Logo"
                value={config.centerLogo}
                onTextChange={(val) => handleChange(null, 'centerLogo', val)}
                onFileChange={(file) => handleFileUpload(null, 'centerLogo', file)}
              />
              <LogoInput 
                label="Away Team Logo (Right)"
                value={config.teamB.logo}
                onTextChange={(val) => handleChange('teamB', 'logo', val)}
                onFileChange={(file) => handleFileUpload('teamB', 'logo', file)}
              />
            </div>
          </div>

          {/* SPONSOR BRANDING SECTION */}
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-6 text-white border-l-4 border-green-500 pl-3 uppercase">Sponsor Branding & Slogan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">On-Field Slogan Text</label>
                  <input 
                    type="text" 
                    value={config.brandingText} 
                    onChange={(e) => handleChange(null, 'brandingText', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-brand-blue focus:outline-none uppercase text-lg font-bold"
                    placeholder="e.g. WHERE CHAMPIONS ARE CROWNED"
                  />
                </div>
                <div className="p-4 bg-blue-900/20 rounded border border-blue-500/30">
                  <p className="text-xs text-blue-300">
                    <strong>Note:</strong> These graphics are rendered in 3D on the field. Use the sliders below to adjust their depth.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {config.brandingLogos?.map((brand, idx) => (
                  <LogoInput 
                    key={idx}
                    label={`Brand Logo ${idx + 1}`}
                    value={brand.url}
                    onTextChange={(val) => handleChange('brandingLogos', 'url', val, idx)}
                    onFileChange={(file) => handleFileUpload('brandingLogos', 'url', file, idx)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* POSITIONING & VISIBILITY CONTROLS */}
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-6 text-white border-l-4 border-yellow-500 pl-3 uppercase">3D Depth & Visibility</h2>
            
            {/* Visibility Toggles */}
            <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/5">
              <button 
                onClick={() => handleChange(null, 'showGrassLogos', !config.showGrassLogos)}
                className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${config.showGrassLogos ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'bg-white/5 text-gray-500'}`}
              >
                {config.showGrassLogos ? 'Grass Logos: ON' : 'Grass Logos: OFF'}
              </button>
              <button 
                onClick={() => handleChange(null, 'showSponsors', !config.showSponsors)}
                className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${config.showSponsors ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'bg-white/5 text-gray-500'}`}
              >
                {config.showSponsors ? 'Sponsors: ON' : 'Sponsors: OFF'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-white/80 uppercase">Team/Center Logos Depth</label>
                  <span className="text-xs bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full font-bold">{config.logoYOffset}px</span>
                </div>
                <input 
                  type="range" 
                  min="-1200" 
                  max="500" 
                  step="5"
                  value={config.logoYOffset || -400} 
                  onChange={(e) => handleChange(null, 'logoYOffset', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <p className="text-[10px] text-gray-500 italic">Adjust horizontal line on the field where main logos appear.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-white/80 uppercase">Sponsor/Slogan Depth</label>
                  <span className="text-xs bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full font-bold">{config.sponsorYOffset}px</span>
                </div>
                <input 
                  type="range" 
                  min="-500" 
                  max="1500" 
                  step="5"
                  value={config.sponsorYOffset || 450} 
                  onChange={(e) => handleChange(null, 'sponsorYOffset', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <p className="text-[10px] text-gray-500 italic">Adjust horizontal line on the field for branding elements.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 pb-12">
          <button 
            onClick={handlePlay}
            className="flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-brand-red to-[#b3002a] hover:from-[#ff3366] hover:to-[#e60036] text-white rounded-2xl shadow-[0_0_40px_rgba(255,0,60,0.4)] hover:shadow-[0_0_60px_rgba(255,0,60,0.6)] transition-all transform hover:scale-105 active:scale-95 group"
          >
            <Play className="w-8 h-8 fill-current" />
            <span className="font-orbitron font-bold text-2xl tracking-[0.2em]">TRIGGER LIVE SEQUENCE</span>
          </button>
        </div>

      </div>
    </div>
  )
}
