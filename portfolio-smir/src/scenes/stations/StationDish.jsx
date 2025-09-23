import React from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { orientQuatFromUp } from "@/utils/math3d";
import useFacingIntensity from "@/scenes/ui/useFacingIntensity";
import HUDPanel from "@/scenes/ui/HUDPanel";

export default function StationDish({ s, qWorldRef, onOpen, highContrast }) {
  const q = orientQuatFromUp(s.pos);
  const kRef = useFacingIntensity(s.pos, qWorldRef);
  return (
    <group position={s.pos} quaternion={q}>
      <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.24, 0.28, 0.18, 16]} /><meshStandardMaterial color="#0b1220" /></mesh>
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 6, 0, 0]}><sphereGeometry args={[0.48, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2d3750" metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 0.26, 0.1]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} /></mesh>
      <RoundedBox args={[0.8, 0.08, 0.04]} radius={0.04} smoothness={4} position={[0, 0.0, 0.5]}>
        <meshStandardMaterial color="#0b1220" emissive={s.color} emissiveIntensity={0.2} depthWrite={false} />
      </RoundedBox>
      <group position={[0, 1.1, 0]}>
        <HUDPanel type="trapeze" color={s.color} title={s.label} lines={s.lines} kRef={kRef} onClick={() => onOpen(s.id)} highContrast={highContrast} />
      </group>
    </group>
  );
}
