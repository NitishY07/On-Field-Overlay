import React, { useRef } from 'react'
import { Text, Image } from '@react-three/drei'
import * as THREE from 'three'

export function TeamLogo({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  teamName = "TMA",
  logoUrl = null,
  color = "#00d2ff", 
  align = "left",
  fullName = ""
}) {
  const group = useRef()

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* 3D Circular Token / Medal */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 4, 0.4, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          metalness={0.9} 
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Team Color Outer Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[4.2, 4.2, 0.2, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      
      {/* Team Logo Image */}
      {logoUrl && (
        <Image 
          url={logoUrl} 
          position={[0, 0, 0.21]} 
          scale={7} 
          transparent
          toneMapped={false}
        />
      )}

      {/* Fallback to initials if no logo provided */}
      {!logoUrl && (
        <Text
          position={[0, 0, 0]}
          fontSize={2}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={color}
        >
          {teamName}
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive={color} emissiveIntensity={0.5} />
        </Text>
      )}

      {/* Massive 3D Text Underneath */}
      {fullName && (
        <group position={[0, -4.5, -0.2]}>
          {/* Drop Shadow Text */}
          <Text
            fontSize={1.2}
            color="#000000"
            anchorX="center"
            anchorY="top"
            position={[0.05, -0.05, -0.05]}
            opacity={0.8}
            letterSpacing={0.1}
            maxWidth={8}
            textAlign="center"
          >
            {fullName.toUpperCase()}
          </Text>
          
          <Text
            fontSize={1.2}
            color="#ffffff"
            anchorX="center"
            anchorY="top"
            outlineWidth={0.06}
            outlineColor={color}
            letterSpacing={0.1}
            maxWidth={8}
            textAlign="center"
          >
            {fullName.toUpperCase()}
            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.8} />
          </Text>
        </group>
      )}
    </group>
  )
}
