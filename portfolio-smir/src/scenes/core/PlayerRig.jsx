// src/scenes/core/PlayerRig.jsx
import React from "react";
import * as THREE from "three";
import Astronaut from "@/scenes/actors/Astronaut";
import PointerOrbit from "@/scenes/nav/PointerOrbit";
import CameraRig from "@/scenes/nav/CameraRig";
import { clamp } from "@/utils/math3d";

/**
 * Regroupe la "présence joueur" :
 * - lean visuel de l'astronaute selon vx/vy
 * - puissance thruster selon mouvement + altitude
 * - PointerOrbit (drag inertiel)
 * - CameraRig (zoom / cadrage)
 */
export default function PlayerRig({ RADIUS, qWorldRef, zoomRef, alt, vxRef, vyRef }) {
  // ⚠️ calc direct: les refs changent .current sans re-render,
  // donc on évite useMemo pour ne pas figer les valeurs entre frames.
  const vx = vxRef?.current || 0;
  const vy = vyRef?.current || 0;

  const leanX = THREE.MathUtils.clamp(-vx * 0.15, -0.25, 0.25);
  const leanY = THREE.MathUtils.clamp( vy * 0.12, -0.22, 0.22);
  const thrusterPower = clamp(Math.abs(vx) + Math.abs(vy) + (alt > 0 ? 0.8 : 0), 0, 1);

  return (
    <>
      <Astronaut
        RADIUS={RADIUS}
        alt={alt}
        leanX={leanX}
        leanY={leanY}
        thrusterPower={thrusterPower}
      />

      {/* Drag rotatif (diagonales OK, inertie via PointerOrbit) */}
      <PointerOrbit
        qWorldRef={qWorldRef}
        sensitivity={0.003}
        deadZone={3}
        inertia
        damping={4}
        invertPitch
      />

      <CameraRig RADIUS={RADIUS} zoomRef={zoomRef} />
    </>
  );
}
