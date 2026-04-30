import React, { useState, useEffect, useRef } from 'react'
import { Play, Save, RefreshCw } from 'lucide-react'
import { matchConfig as defaultConfig } from '../config'

export function AdminPanel() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('matchConfig')
    return saved ? JSON.parse(saved) : defaultConfig
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

  const handleChange = (section, field, value) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      if (section) {
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

  const handleFileUpload = (section, field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(section, field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-inter overflow-auto">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-brand-blue tracking-wider">GRAPHICS CONTROL PANEL</h1>
            <p className="text-gray-400 mt-2 text-sm">Real-time settings sync for 3D Broadcast Graphics</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-brand-blue hover:bg-blue-400 text-black rounded-md text-sm font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all"
            >
              <Save className="w-4 h-4" /> Push Updates to Live
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Team A Settings */}
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-4 text-white border-l-4 border-brand-blue pl-3">HOME TEAM (LEFT)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={config.teamA.name} 
                  onChange={(e) => handleChange('teamA', 'name', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Abbreviation (3 Letters)</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={config.teamA.shortName} 
                    onChange={(e) => handleChange('teamA', 'shortName', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none font-orbitron uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={config.teamA.color} 
                      onChange={(e) => handleChange('teamA', 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-black/50 border border-white/10 p-1"
                    />
                    <input 
                      type="text" 
                      value={config.teamA.color} 
                      onChange={(e) => handleChange('teamA', 'color', e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Logo URL (Or Upload Image)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={config.teamA.logo} 
                    onChange={(e) => handleChange('teamA', 'logo', e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none text-xs"
                    placeholder="URL or data..."
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('teamA', 'logo', e.target.files[0])}
                    className="w-24 text-xs bg-black/50 border border-white/10 rounded px-2 py-2 text-white cursor-pointer file:hidden"
                    title="Upload image"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team B Settings */}
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-4 text-white border-l-4 border-brand-red pl-3">AWAY TEAM (RIGHT)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={config.teamB.name} 
                  onChange={(e) => handleChange('teamB', 'name', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Abbreviation (3 Letters)</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={config.teamB.shortName} 
                    onChange={(e) => handleChange('teamB', 'shortName', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none font-orbitron uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary Color (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={config.teamB.color} 
                      onChange={(e) => handleChange('teamB', 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-black/50 border border-white/10 p-1"
                    />
                    <input 
                      type="text" 
                      value={config.teamB.color} 
                      onChange={(e) => handleChange('teamB', 'color', e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Logo URL (Or Upload Image)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={config.teamB.logo} 
                    onChange={(e) => handleChange('teamB', 'logo', e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none text-xs"
                    placeholder="URL or data..."
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('teamB', 'logo', e.target.files[0])}
                    className="w-24 text-xs bg-black/50 border border-white/10 rounded px-2 py-2 text-white cursor-pointer file:hidden"
                    title="Upload image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Settings & Trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-orbitron font-bold mb-4 text-white border-l-4 border-yellow-500 pl-3">MATCH INFO</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tournament Name</label>
                <input 
                  type="text" 
                  value={config.tournament} 
                  onChange={(e) => handleChange(null, 'tournament', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Event Center Logo URL</label>
                <input 
                  type="text" 
                  value={config.eventLogo} 
                  onChange={(e) => handleChange(null, 'eventLogo', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date String</label>
                <input 
                  type="text" 
                  value={config.date} 
                  onChange={(e) => handleChange(null, 'date', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Stadium / Location</label>
                <input 
                  type="text" 
                  value={config.location} 
                  onChange={(e) => handleChange(null, 'location', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-blue focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg text-gray-400 mb-4 font-bold tracking-widest">LIVE BROADCAST CONTROLS</h2>
            <button 
              onClick={handlePlay}
              className="w-full py-6 bg-gradient-to-r from-brand-red to-[#b3002a] hover:from-[#ff3366] hover:to-[#e60036] text-white rounded-xl shadow-[0_0_30px_rgba(255,0,60,0.4)] hover:shadow-[0_0_40px_rgba(255,0,60,0.6)] flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 group"
            >
              <Play className="w-10 h-10 fill-current" />
              <span className="font-orbitron font-bold text-xl tracking-widest">PLAY SEQUENCE</span>
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Ensure graphics overlay is active in OBS before playing. This will save settings and trigger the 3D animation instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
