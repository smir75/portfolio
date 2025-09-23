import React from "react";
import * as THREE from "three";
import { orientQuatFromUp } from "@/utils/math3d";
import useFacingIntensity from "@/scenes/ui/useFacingIntensity";
import HUDPanel from "@/scenes/ui/HUDPanel";

export default function StationDome({ s, qWorldRef, onOpen, highContrast }) {
  const q = orientQuatFromUp(s.pos);
  const kRef = useFacingIntensity(s.pos, qWorldRef);
  return (
    <group position={s.pos} quaternion={q}>
      <mesh position={[0, -0.15, 0]}><torusGeometry args={[0.6, 0.06, 12, 48]} /><meshStandardMaterial color="#0b1220" /></mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.62, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={highContrast ? "#cfe6ff" : "#b6d7ff"} transmission={0.85} transparent roughness={0.15} thickness={0.15} metalness={0.05} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i/6)*Math.PI*2)*0.9, 0.02, Math.sin((i/6)*Math.PI*2)*0.9]}>
          <sphereGeometry args={[0.03, 12, 12]} /><meshBasicMaterial color={s.color} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <group position={[0, 0.9, 0]}>
        <HUDPanel type="round" color={s.color} title={s.label} lines={s.lines} kRef={kRef} onClick={() => onOpen(s.id)} highContrast={highContrast} />
      </group>
    </group>
  );
}
