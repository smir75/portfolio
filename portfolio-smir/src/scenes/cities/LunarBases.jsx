// src/scenes/cities/LunarBases.jsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// tiny seeded RNG (mulberry32)
function makeRng(seed = 1) {
  let t = (seed >>> 0) || 1;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function orientQuatFromNormal(normal) {
  const up = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion();
  q.setFromUnitVectors(up, normal.clone().normalize());
  return q;
}

function randomPointsOnSphere(radius, count, seed = 1337) {
  const rand = makeRng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const x = r * Math.cos(phi);
    const y = u;
    const z = r * Math.sin(phi);
    const normal = new THREE.Vector3(x, y, z);
    const pos = normal.clone().multiplyScalar(radius);
    out.push({ pos, normal });
  }
  return out;
}

export default function LunarBases({ RADIUS, count = 6, seed = 1234, highContrast }) {
  const items = useMemo(() => randomPointsOnSphere(RADIUS + 0.005, count, seed), [RADIUS, count, seed]);
  const tRef = useRef(0);
  useFrame((_, dt) => { tRef.current += dt; });

  return (
    <group>
      {items.map(({ pos, normal }, i) => {
        const q = orientQuatFromNormal(normal);
        const pulse = 0.95 + 0.05 * Math.sin(tRef.current * 1.4 + i * 0.7);
        return (
          <group key={i} position={pos} quaternion={q}>
            <mesh position={[0, 0.12, 0]} scale={[1, pulse, 1]}>
              <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={highContrast ? "#cfe9ff" : "#9fc7ff"} roughness={0.2} metalness={0.1} transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
              <meshStandardMaterial color="#7b8796" roughness={0.9} />
            </mesh>
            <mesh position={[0.28, 0.05, 0]} rotation={[0, Math.PI / 5, 0]}>
              <boxGeometry args={[0.18, 0.1, 0.12]} />
              <meshStandardMaterial color="#98a6b8" roughness={0.8} />
            </mesh>
            <mesh position={[-0.26, 0.05, -0.06]} rotation={[0, -Math.PI / 8, 0]}>
              <boxGeometry args={[0.14, 0.1, 0.16]} />
              <meshStandardMaterial color="#8ea0b2" roughness={0.85} />
            </mesh>
            <mesh position={[0.14, 0.06, 0]} rotation={[0, Math.PI / 10, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.28, 12]} />
              <meshStandardMaterial color="#6f7c8a" roughness={0.7} />
            </mesh>
            <group position={[0, 0.2, 0]}>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.24, 8]} />
                <meshStandardMaterial color="#697381" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.27, 0]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshBasicMaterial color={highContrast ? "#86f3ff" : "#35d8ff"} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
