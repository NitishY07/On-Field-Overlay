import React, { useRef } from 'react'
import { Image, Ring, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function EventLogoFloor({ url, tournamentName }) {
  const group = useRef()
  const ring1 = useRef()
  const ring2 = useRef()

  useFrame((state, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.2
    if (ring2.current) ring2.current.rotation.z -= delta * 0.5
  })

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.9, 0]}>
      {/* Tournament Name Center */}
      <Text
        fontSize={1.5}
        color="#ffffff"
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
        position={[0, 0, 0.2]}
      >
        {tournamentName?.toUpperCase()}
        <meshStandardMaterial metalness={0.8} roughness={0.2} emissive="#ffffff" emissiveIntensity={0.5} />
      </Text>
      
      {/* Decorative circle for the text */}
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[6, 64]} />
        <meshPhysicalMaterial color="#111111" transparent opacity={0.5} />
      </mesh>
      
      {/* Football Pitch Center Circle */}
      <Ring args={[14, 14.2, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
      
      {/* Hexagonal Pattern / Tech Grid */}
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[20, 6]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.2} wireframe />
      </mesh>
      
      <Ring args={[0.5, 0.7, 32]} position={[0, 0, 0.2]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </Ring>
    </group>
  )
}
