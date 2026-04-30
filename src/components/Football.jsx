import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Trail, Sphere, SpotLight } from '@react-three/drei'
import * as THREE from 'three'

export function Football() {
  const ballRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state, delta) => {
    if (ballRef.current) {
      ballRef.current.rotation.y += delta * 0.5
      ballRef.current.rotation.x += delta * 0.2
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y -= delta * 1.5
      ring1Ref.current.rotation.z += delta * 0.5
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 1.2
      ring2Ref.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group name="football_group" position={[0, 0, 0]}>
      {/* Realistic Football Body */}
      <group ref={ballRef}>
        {/* Main white sphere */}
        <Sphere args={[2, 64, 64]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0.1} 
            roughness={0.3}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </Sphere>
        
        {/* Procedural Panel Detail (using a wireframe mesh with slightly larger scale to simulate panel lines) */}
        <Icosahedron args={[2.02, 1]}>
          <meshStandardMaterial 
            color="#111111" 
            metalness={0.8} 
            roughness={0.2} 
            wireframe 
            wireframeLinewidth={2}
          />
        </Icosahedron>
      </group>

      {/* Subtle Bottom Glow */}
      <SpotLight
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={1}
        intensity={20}
        color="#ffffff"
      />
    </group>
  )
}
