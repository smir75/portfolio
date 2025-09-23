import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function FlybyShips({ count = 6, radius = 220 }) {
  const groups = useRef([]);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      a0: Math.random() * Math.PI * 2, a1: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.8, speed: 0.05 + Math.random() * 0.08,
      offset: Math.random() * 100,
    })), [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const k = (t * s.speed + s.offset) % 1;
      const p0 = new THREE.Vector3(Math.cos(s.a0) * radius, Math.sin(s.tilt) * radius * 0.3, Math.sin(s.a0) * radius);
      const p1 = new THREE.Vector3(Math.cos(s.a1) * -radius, -Math.sin(s.tilt) * radius * 0.3, Math.sin(s.a1) * -radius);
      const p = p0.clone().lerp(p1, k);
      p.y += Math.sin(k * Math.PI * 4) * 3.5;
      const g = groups.current[i]; if (g) { g.position.copy(p); g.lookAt(0, 0, 0); }
    });
  });

  return (
    <group>
      {seeds.map((s, i) => (
        <group key={i} ref={(el) => (groups.current[i] = el)}>
          <mesh><boxGeometry args={[1.2, 0.22, 0.22]} /><meshStandardMaterial color="#bcd0ff" emissive="#7aa2ff" emissiveIntensity={0.6} roughness={0.2} metalness={0.4} /></mesh>
          <mesh position={[0.7, 0, 0]}><boxGeometry args={[0.4, 0.18, 0.18]} /><meshStandardMaterial color="#e2ecff" emissive="#a7c4ff" emissiveIntensity={0.5} roughness={0.2} metalness={0.3} /></mesh>
          <Sparkles count={10} scale={0.8} size={1.2} speed={1.2} color="#89b8ff" position={[-0.9, 0, 0]} />
        </group>
      ))}
    </group>
  );
}
