import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function SolarSystemPlanets({ RADIUS, reduceMotion }) {
  const groups = useRef([]);
  const planets = useMemo(() => ([
    { name:"Mercure", r:RADIUS+85,  size:0.9, color:"#bfb9b2", speed:0.10 },
    { name:"Vénus",   r:RADIUS+100, size:1.6, color:"#d8c28f", speed:0.09 },
    { name:"Terre",   r:RADIUS+118, size:1.7, color:"#6aa5ff", speed:0.085 },
    { name:"Mars",    r:RADIUS+138, size:1.2, color:"#c75f3e", speed:0.08 },
    { name:"Jupiter", r:RADIUS+175, size:3.6, color:"#e0b07a", speed:0.06 },
    { name:"Saturne", r:RADIUS+205, size:3.0, color:"#d9c29a", speed:0.055, ring:true },
    { name:"Uranus",  r:RADIUS+235, size:2.4, color:"#9ed7f0", speed:0.05 },
    { name:"Neptune", r:RADIUS+265, size:2.3, color:"#6aa0ff", speed:0.045 },
  ].map(p => ({ ...p, phase: Math.random() * Math.PI * 2 }))), [RADIUS]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    planets.forEach((p, i) => {
      const a = p.phase + t * (reduceMotion ? p.speed * 0.3 : p.speed);
      const x = p.r * Math.cos(a), z = p.r * Math.sin(a), y = Math.sin(a * 0.6) * 8;
      const g = groups.current[i];
      if (g) { g.position.set(x, y, z); g.lookAt(0, 0, 0); }
    });
  });

  return (
    <group>
      {planets.map((p, i) => (
        <group key={p.name} ref={(el) => (groups.current[i] = el)}>
          <mesh>
            <sphereGeometry args={[p.size, 24, 24]} />
            <meshStandardMaterial color={p.color} roughness={0.6} metalness={0.05} emissive={p.color} emissiveIntensity={0.15} />
          </mesh>
          {p.ring && (
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[p.size * 1.8, p.size * 0.18, 12, 64]} />
              <meshBasicMaterial color="#f2e3c1" transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
