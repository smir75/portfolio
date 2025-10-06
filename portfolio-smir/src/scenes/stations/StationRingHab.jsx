// src/scenes/stations/StationRingHab.jsx
import React from "react";
import { orientQuatFromUp } from "@/utils/math3d";
import useFacingIntensity from "@/scenes/ui/useFacingIntensity";
import HUDPanel from "@/scenes/ui/HUDPanel";

export default function StationRingHab({ s, qWorldRef, spinYRef, onFocus, highContrast }) {
  const q = orientQuatFromUp(s.pos);
  const kRef = useFacingIntensity(s.pos, qWorldRef);

  return (
    <group position={s.pos} quaternion={q}>
      <mesh>
        <torusGeometry args={[0.5, 0.07, 14, 64]} />
        <meshStandardMaterial color="#1d2736" metalness={0.2} roughness={0.6} />
      </mesh>
      {[-0.52, 0.52].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color="#2b3546" />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.02, 0.02, 1.0]} />
          <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} />
        </mesh>
      ))}

      <group position={[0, 0.9, 0]}>
        <HUDPanel
          type="hex"
          color={s.color}
          title={s.label}
          lines={s.lines}
          kRef={kRef}
          onFocus={() => onFocus?.(s.id)}
          stationId={s.id}
          highContrast={highContrast}
        />
      </group>
    </group>
  );
}
