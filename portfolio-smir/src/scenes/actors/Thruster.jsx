import React, { useRef } from "react";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { clamp } from "@/utils/math3d";

export default function Thruster({ power = 0 }) {
  const flame = useRef(), sparks = useRef();
  useFrame(({ clock }) => {
    const p = clamp(power, 0, 1);
    const t = clock.getElapsedTime();
    const s = 0.6 + 0.6 * p + 0.1 * Math.sin(t * 20);
    if (flame.current) {
      flame.current.scale.set(0.3 + 0.25 * p, s, 0.3 + 0.25 * p);
      flame.current.material.opacity = 0.35 + 0.45 * p;
    }
    if (sparks.current) {
      sparks.current.scale.setScalar(0.6 + 0.8 * p);
      sparks.current.material.opacity = 0.25 + 0.55 * p;
    }
  });
  return (
    <group position={[0, 0.06, 0.18]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, -0.06]}><cylinderGeometry args={[0.06, 0.1, 0.14, 12]} /><meshStandardMaterial color="#2a3140" metalness={0.6} roughness={0.4} /></mesh>
      <mesh ref={flame} position={[0, 0, -0.16]}><coneGeometry args={[0.14, 0.34, 16, 1, true]} /><meshBasicMaterial color="#7cc6ff" transparent opacity={0.6} /></mesh>
      <Sparkles ref={sparks} count={15} scale={0.8} speed={1.5} size={1.5} color="#9ad8ff" />
    </group>
  );
}
