// src/scenes/stations/StationTower.jsx
import React from "react";
import { orientQuatFromUp } from "@/utils/math3d";
import useFacingIntensity from "@/scenes/ui/useFacingIntensity";
import HUDPanel from "@/scenes/ui/HUDPanel";
import RotatingRing from "./RotatingRing";

export default function StationTower({ s, qWorldRef, spinYRef, onFocus, highContrast }) {
  const q = orientQuatFromUp(s.pos);
  const kRef = useFacingIntensity(s.pos, qWorldRef);

  return (
    <group position={s.pos} quaternion={q}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.2, 20]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.36, 20]} />
        <meshStandardMaterial color="#263142" />
      </mesh>
      <RotatingRing color={s.color} />
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.08, 0.22, 16]} />
        <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.4} />
      </mesh>

      <group position={[0, 1.05, 0]}>
        <HUDPanel
          type="totem"
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
