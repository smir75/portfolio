// src/hooks/useWorldSpin.js
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Gère la rotation visuelle du groupe "spin" et expose l'angle courant.
 * - spinGroupRef : à mettre sur le <group> qui tourne
 * - spinYRef     : ref vers l'angle Y courant (utilisé pour stations, facing, etc.)
 */
export default function useWorldSpin(spinSpeed = 0.02) {
  const spinGroupRef = useRef();
  const spinYRef = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1 / 30);
    if (!spinGroupRef.current) return;
    spinGroupRef.current.rotation.y += spinSpeed * dt;
    spinYRef.current = spinGroupRef.current.rotation.y;
  });

  return { spinGroupRef, spinYRef };
}
