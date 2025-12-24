"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TorusKnot, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Scene({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Complex rotation for a dynamic feel
    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;

    // React to state with scale and wobble
    if (isSpeaking) {
        // Intense pulsing and glitching
        meshRef.current.scale.setScalar(1.8 + Math.sin(time * 15) * 0.1);
    } else if (isListening) {
        // Calm breathing
        meshRef.current.scale.setScalar(1.8 + Math.sin(time * 2) * 0.05);
    } else {
        // Idle state
        meshRef.current.scale.setScalar(1.5);
    }
  });

  // Color Palette
  const coreColor = isListening ? "#00ff00" : isSpeaking ? "#bc13fe" : "#00f3ff";
  const emissiveColor = isSpeaking ? "#ff00ff" : coreColor;

  return (
    <TorusKnot args={[1, 0.3, 128, 32]} ref={meshRef}>
      <MeshWobbleMaterial
        color={coreColor}
        emissive={emissiveColor}
        emissiveIntensity={isSpeaking ? 0.8 : 0.4}
        roughness={0.1}
        metalness={0.9}
        factor={isSpeaking ? 0.3 : 0.05} // How much it wobbles
        speed={isSpeaking ? 10 : 2}     // Speed of the wobble
        wireframe={true}
      />
    </TorusKnot>
  );
}