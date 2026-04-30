import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Text, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { StadiumEnvironment } from './components/StadiumEnvironment'
import { Football } from './components/Football'
import { TeamLogo } from './components/TeamLogo'
import { EventLogoFloor } from './components/EventLogoFloor'
import { MatchInfoOverlay } from './components/MatchInfoOverlay'
import { createMasterTimeline } from './animations/timeline'
import { Play } from 'lucide-react'
import { matchConfig } from './config'
import { AdminPanel } from './components/AdminPanel'
import './index.css'

function Scene({ refs, config }) {
  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        ref={refs.cameraRef} 
        position={[0, 50, 80]} 
        rotation={[-Math.PI / 4, 0, 0]} 
        fov={45} 
      />
      
      <StadiumEnvironment ref={refs.stadiumLightsRef} />
      
      <group ref={refs.eventLogoRef} scale={0}>
        <EventLogoFloor url={config.eventLogo} tournamentName={config.tournament} />
      </group>

      {/* Central VS Text (Ball removed as requested) */}

      {/* Massive 3D VS behind the logos */}
      <group ref={refs.vsTextRef} scale={0} position={[0, 8, -2]}>
        {/* Drop Shadow for VS */}
        <Text
          fontSize={8}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          position={[0.1, -0.1, -0.1]}
          opacity={0.8}
        >
          VS
        </Text>
        <Text
          fontSize={8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="#000000"
          fillOpacity={1}
        >
          VS
          <meshStandardMaterial metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={1.5} />
        </Text>
      </group>
      
      <group ref={refs.teamLeftRef} position={[-20, 0, 0]}>
        <TeamLogo 
          teamName={config.teamA.shortName} 
          fullName={config.teamA.name}
          logoUrl={config.teamA.logo}
          color={config.teamA.color} 
          align="left" 
        />
      </group>
      
      <group ref={refs.teamRightRef} position={[20, 0, 0]}>
        <TeamLogo 
          teamName={config.teamB.shortName} 
          fullName={config.teamB.name}
          logoUrl={config.teamB.logo}
          color={config.teamB.color} 
          align="right" 
        />
      </group>

      {/* Realistic Contact Shadows on the floor */}
      <ContactShadows 
        position={[0, -4.9, 0]} 
        opacity={1} 
        scale={60} 
        blur={2} 
        far={15} 
        color="#000000" 
      />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  )
}

function GraphicsOverlay() {
  const cameraRef = useRef()
  const stadiumLightsRef = useRef()
  const teamLeftRef = useRef()
  const teamRightRef = useRef()
  const uiOverlayRef = useRef()
  const eventLogoRef = useRef()
  const vsTextRef = useRef()
  
  const [timeline, setTimeline] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAdminUI, setShowAdminUI] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('matchConfig')
    return saved ? JSON.parse(saved) : matchConfig
  })

  const handlePlayRef = useRef()

  useEffect(() => {
    // Check URL for admin UI
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setShowAdminUI(true)
    }

    // BroadcastChannel listener
    const channel = new BroadcastChannel('football_graphics_channel')
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_CONFIG') {
        setConfig(event.data.payload)
      } else if (event.data.type === 'PLAY') {
        console.log("Received PLAY signal via BroadcastChannel")
        if (handlePlayRef.current) handlePlayRef.current()
      }
    }

    // Poll until all refs are populated from the Canvas
    const checkRefs = setInterval(() => {
      if (cameraRef.current && teamLeftRef.current && teamRightRef.current && uiOverlayRef.current && vsTextRef.current && eventLogoRef.current) {
        clearInterval(checkRefs)
        console.log("All refs populated, creating timeline...")
        
        const tl = createMasterTimeline({
          cameraRef: cameraRef.current,
          stadiumLightsRef,
          teamLeftRef: teamLeftRef.current,
          teamRightRef: teamRightRef.current,
          uiOverlayRef: uiOverlayRef.current,
          eventLogoRef: eventLogoRef.current,
          vsTextRef: vsTextRef.current
        })
        
        tl.eventCallback("onComplete", () => {
          setIsPlaying(false)
        })
        
        setTimeline(tl)
      }
    }, 100)
    
    return () => {
      clearInterval(checkRefs)
      channel.close()
    }
  }, [])

  const handlePlay = () => {
    console.log("handlePlay called. Timeline exists:", !!timeline)
    setHasStarted(true)
    if (timeline) {
      console.log("Restarting timeline...")
      timeline.restart()
      setIsPlaying(true)
    }
  }
  handlePlayRef.current = handlePlay

  // Add keyboard listener for Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault() // prevent page scrolling
        handlePlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [timeline])

  return (
    <div className="w-screen h-screen relative bg-transparent overflow-hidden">
      {/* Container to completely hide everything until PLAY is clicked */}
      <div 
        className="absolute inset-0 transition-opacity duration-300" 
        style={{ opacity: hasStarted ? 1 : 0 }}
      >
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
            <Scene refs={{ cameraRef, stadiumLightsRef, teamLeftRef, teamRightRef, eventLogoRef, vsTextRef }} config={config} />
          </Canvas>
        </div>

        {/* HTML Overlay */}
        <MatchInfoOverlay 
          ref={uiOverlayRef}
          teamA={config.teamA}
          teamB={config.teamB}
          tournamentName={config.tournament}
          dateInfo={config.date}
          location={config.location}
        />
      </div>

      {/* Debug/Play Controls */}
      {!isPlaying && showAdminUI && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={handlePlay}
            className="flex items-center gap-2 px-6 py-3 bg-brand-dark/80 hover:bg-brand-blue/20 border border-white/20 hover:border-brand-blue rounded-full text-white font-inter backdrop-blur-md transition-all group"
          >
            <Play className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" fill="currentColor" />
            <span className="tracking-widest text-sm font-bold">PLAY SEQUENCE</span>
          </button>
        </div>
      )}
    </div>
  )
}

function App() {
  const [isAdminPath, setIsAdminPath] = useState(false)

  useEffect(() => {
    setIsAdminPath(window.location.pathname === '/admin' || window.location.search.includes('admin_panel=true'))
  }, [])

  if (isAdminPath) {
    return <AdminPanel />
  }

  return <GraphicsOverlay />
}

export default App
