// src/scenes/terrain/Mines.jsx
import React, { useMemo } from "react";
import * as THREE from "three";

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

function randomPointsOnSphere(radius, count, seed = 3333) {
  const rand = makeRng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const n = new THREE.Vector3(r * Math.cos(phi), u, r * Math.sin(phi));
    out.push({ pos: n.clone().multiplyScalar(radius), normal: n });
  }
  return out;
}

export default function Mines({ RADIUS, count = 5, seed = 3333 }) {
  const items = useMemo(() => randomPointsOnSphere(RADIUS + 0.003, count, seed), [RADIUS, count, seed]);

  return (
    <group>
      {items.map(({ pos, normal }, i) => {
        const q = orientQuatFromNormal(normal);
        return (
          <group key={i} position={pos} quaternion={q}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.16, 0.12, 24]} />
              <meshStandardMaterial color="#4f5867" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
              <meshStandardMaterial color="#9aa6b5" roughness={0.8} />
            </mesh>
            <mesh position={[0.22, 0.07, 0]} rotation={[0, Math.PI / 12, 0]}>
              <boxGeometry args={[0.38, 0.06, 0.10]} />
              <meshStandardMaterial color="#798595" roughness={0.85} />
            </mesh>
            <mesh position={[0.40, 0.11, 0]} rotation={[0, Math.PI / 12, 0]}>
              <boxGeometry args={[0.08, 0.08, 0.12]} />
              <meshStandardMaterial color="#6e7a89" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
