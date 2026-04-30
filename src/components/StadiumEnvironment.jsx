import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles, Environment, SpotLight, useDepthBuffer } from '@react-three/drei'
import * as THREE from 'three'

export function StadiumEnvironment({ introActive = true }) {
  const group = useRef()
  const depthBuffer = useDepthBuffer({ frames: 1 })

  return (
    <group ref={group} name="stadium">
      {/* Background and Fog removed to allow full transparency for broadcast feed */}
      
      {/* Essential for realistic PBR reflections on the ball and logos */}
      <Environment preset="city" />

      <ambientLight intensity={0.1} />

      {/* Main Stadium Volumetric Lights */}
      <SpotLight
        name="spotLeft"
        position={[-15, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={200}
        color="#00d2ff"
        castShadow
        depthBuffer={depthBuffer}
        distance={60}
      />
      <SpotLight
        name="spotRight"
        position={[15, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={200}
        color="#ff003c"
        castShadow
        depthBuffer={depthBuffer}
        distance={60}
      />
      
      <SpotLight
        name="spotCenter"
        position={[0, 25, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={150}
        color="#ffffff"
        castShadow
        depthBuffer={depthBuffer}
      />

      {/* Atmospheric Particles */}
      <Sparkles count={500} scale={30} size={2} speed={0.4} opacity={0.3} color="#ffffff" />
      <Sparkles count={200} scale={20} size={4} speed={0.6} opacity={0.5} color="#00d2ff" />

      {/* Floor / Pitch Representation - Shadow Catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.4} />
      </mesh>

      {/* Pitch Lines */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.95, 0]}>
        {/* Center Line */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[100, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
        {/* Outer Bounds */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[29.9, 30, 4]} rotation={[0, 0, Math.PI / 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      </group>

      {/* Background Stadium Mockup removed for broadcast feed transparency */}
    </group>
  )
}
