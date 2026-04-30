import gsap from 'gsap'

/**
 * Creates the master timeline for the 15-second opening sequence.
 * @param {Object} refs - References to the 3D objects and UI elements
 */
export function createMasterTimeline(refs) {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.inOut" }
  })

  const {
    cameraRef,
    stadiumLightsRef,
    teamLeftRef,
    teamRightRef,
    uiOverlayRef,
    eventLogoRef,
    vsTextRef
  } = refs

  // 1. INTRO (0-2.5 sec)
  // Fix camera conflict by strictly defining rotation inside fromTo
  tl.fromTo(cameraRef.position, 
    { x: 0, y: 30, z: 80 }, 
    { x: 0, y: 15, z: 35, duration: 2.5, ease: "power3.inOut" }, 
    0
  )
  tl.fromTo(cameraRef.rotation,
    { x: -Math.PI / 4, y: 0, z: 0 },
    { x: -0.15, y: 0, z: 0, duration: 2.5, ease: "power3.inOut" },
    0
  )

  // 2. BUILD-UP (2.5-5 sec)
  // Camera slowly pushes in
  tl.to(cameraRef.position, { z: 25, duration: 2.5, ease: "power1.inOut" }, 2.5)
  
  // Floor logo expands from center
  tl.fromTo(eventLogoRef.scale, 
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
    2.5
  )
  
  // Camera shake
  tl.fromTo(cameraRef.position, 
    { y: 15 }, { y: 15.5, duration: 0.1, yoyo: true, repeat: 5 }, 4
  )

  // 3. TEAM REVEAL EXPLOSION (5-8 sec)
  // Panels explode from the exact center
  tl.to(cameraRef.position, { z: 35, duration: 3, ease: "power2.inOut" }, 5)
  
  // VS Text appears
  tl.fromTo(vsTextRef.scale,
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.5)" },
    5
  )
  tl.to(vsTextRef.position, { z: -2 }, 5)

  // Left Panel
  tl.fromTo(teamLeftRef.position,
    { x: 0, y: 8, z: -5 },
    { x: -10, y: 8, z: 0, duration: 1.8, ease: "elastic.out(1.2, 0.4)" },
    5
  )
  tl.fromTo(teamLeftRef.scale,
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.5)" },
    5
  )
  tl.fromTo(teamLeftRef.rotation,
    { x: Math.PI, y: -Math.PI * 2, z: Math.PI / 2 },
    { x: 0, y: 0.3, z: 0, duration: 2.2, ease: "power4.out" },
    5
  )

  // Right Panel
  tl.fromTo(teamRightRef.position,
    { x: 0, y: 8, z: -5 },
    { x: 10, y: 8, z: 0, duration: 1.8, ease: "elastic.out(1.2, 0.4)" },
    5.1 
  )
  tl.fromTo(teamRightRef.scale,
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.5)" },
    5.1
  )
  tl.fromTo(teamRightRef.rotation,
    { x: -Math.PI, y: Math.PI * 2, z: -Math.PI / 2 },
    { x: 0, y: -0.3, z: 0, duration: 2.2, ease: "power4.out" },
    5.1
  )
  
  // High-energy pulse
  tl.to([teamLeftRef.scale, teamRightRef.scale], {
    x: 1.1, y: 1.1, z: 1.1, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.inOut"
  }, 6.5)

  // 4. MATCH INFO UI FADE IN (8-10 sec)
  tl.to(uiOverlayRef, {
    opacity: 1, duration: 1.5, ease: "power2.out"
  }, 8)
  tl.fromTo(uiOverlayRef, 
    { scale: 0.8, filter: 'blur(15px)' }, 
    { scale: 1, filter: 'blur(0px)', duration: 1.5, ease: "back.out(1.2)" }, 
    8
  )
  
  // 5. HERO HOLD & DRIFT (10-35 sec) -> 25 SECONDS HOLD
  // Extremely slow camera orbit/drift to keep it alive
  tl.to(cameraRef.position, { x: 5, y: 15, z: 40, duration: 25, ease: "none" }, 10)
  tl.to(cameraRef.rotation, { y: 0.15, duration: 25, ease: "none" }, 10)
  
  // Slow rotation on the logos and ball to keep them dynamic
  tl.to(eventLogoRef.rotation, { y: -Math.PI, duration: 25, ease: "none" }, 10)

  // 6. OUTRO SINGULARITY COLLAPSE (35-37 sec)
  const outroStart = 35;
  tl.to(uiOverlayRef, { opacity: 0, scale: 0, duration: 0.6, ease: "power3.in" }, outroStart)
  
  tl.to([teamLeftRef.position, teamRightRef.position], 
    { x: 0, y: 6, z: 0, duration: 1, ease: "back.in(2)" }, outroStart
  )
  tl.to([teamLeftRef.scale, teamRightRef.scale, eventLogoRef.scale, vsTextRef.scale], 
    { x: 0, y: 0, z: 0, duration: 1, ease: "power4.in" }, outroStart + 0.2
  )
  tl.to([teamLeftRef.rotation, teamRightRef.rotation], 
    { x: Math.PI * 3, y: Math.PI * 3, z: Math.PI * 3, duration: 1.2, ease: "power3.in" }, outroStart
  )
  
  // Camera dives through the void
  tl.to(cameraRef.position, { x: 0, y: 6, z: -20, duration: 1.5, ease: "power4.inOut" }, outroStart + 0.5)
  tl.to(cameraRef.rotation, { y: 0, z: Math.PI * 2, duration: 1.5, ease: "power4.inOut" }, outroStart + 0.5)

  return tl
}
