import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { orientQuatFromUp } from "@/utils/math3d";

/**
 * Dôme de ville, avec bâtiments + mini "habitants" animés
 */
export default function CityDome({ pos, color = "#7cc6ff" }) {
  const q = orientQuatFromUp(pos);
  const walkers = useRef([]);
  const base = useRef();

  // pré-génération des bâtis
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.18 + Math.random() * 0.22;
      const h = 0.08 + Math.random() * 0.22;
      arr.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, h });
    }
    return arr;
  }, []);

  // “habitants”
  const people = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.12 + Math.random() * 0.28,
        speed: 0.3 + Math.random() * 0.6,
      })),
    []
  );

  // animation des habitants
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    walkers.current.forEach((m, i) => {
      if (!m) return;
      const p = people[i];
      const a = p.a + t * 0.12 * p.speed;
      const y = 0.02 + Math.sin(t * 1.2 + i) * 0.01;
      m.position.set(Math.cos(a) * p.r, y, Math.sin(a) * p.r);
    });
  });

  return (
    <group position={pos} quaternion={q}>
      {/* base */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.06, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.25} roughness={0.7} />
      </mesh>

      {/* dôme en verre */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.62, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#b6d7ff"
          transmission={0.85}
          thickness={0.2}
          roughness={0.2}
          metalness={0.05}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* décor interne */}
      <group position={[0, 0.04, 0]} ref={base}>
        {/* “parc” */}
        <mesh>
          <circleGeometry args={[0.5, 36]} />
          <meshStandardMaterial color="#163453" roughness={0.8} />
        </mesh>

        {/* bâtiments */}
        {buildings.map((b, i) => (
          <mesh key={i} position={[b.x, b.h / 2, b.z]}>
            <boxGeometry args={[0.08, b.h, 0.08]} />
            <meshStandardMaterial
              color="#2a3b57"
              emissive={color}
              emissiveIntensity={0.08 + Math.random() * 0.12}
              roughness={0.6}
            />
          </mesh>
        ))}

        {/* habitants (petites sphères) */}
        {people.map((_, i) => (
          <mesh key={i} ref={(el) => (walkers.current[i] = el)} position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshStandardMaterial color="#e6f2ff" emissive="#6aa5ff" emissiveIntensity={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
