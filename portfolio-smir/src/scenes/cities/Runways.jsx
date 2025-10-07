// src/scenes/cities/Runways.jsx
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

function randomPointsOnSphere(radius, count, seed = 2222) {
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

export default function Runways({ RADIUS, count = 4, seed = 2222, highContrast }) {
  const items = useMemo(() => randomPointsOnSphere(RADIUS + 0.004, count, seed), [RADIUS, count, seed]);

  return (
    <group>
      {items.map(({ pos, normal }, i) => {
        const q = orientQuatFromNormal(normal);
        const rot = i % 2 === 0 ? 0 : Math.PI / 5;
        return (
          <group key={i} position={pos} quaternion={q} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.025, 0]}>
              <boxGeometry args={[0.95, 0.05, 0.18]} />
              <meshStandardMaterial color="#5a6473" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.051, 0]}>
              <boxGeometry args={[0.96, 0.002, 0.02]} />
              <meshBasicMaterial color={highContrast ? "#d7f1ff" : "#cfe7ff"} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0.051, 0.06]}>
              <boxGeometry args={[0.18, 0.002, 0.01]} />
              <meshBasicMaterial color="#cfe7ff" />
            </mesh>
            <mesh position={[0, 0.051, -0.06]}>
              <boxGeometry args={[0.18, 0.002, 0.01]} />
              <meshBasicMaterial color="#cfe7ff" />
            </mesh>
            <mesh position={[0.6, 0.02, 0]} rotation={[0, Math.PI / 6, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.04, 6]} />
              <meshStandardMaterial color="#6a7686" roughness={0.9} />
            </mesh>
            <mesh position={[0.6, 0.045, 0]}>
              <circleGeometry args={[0.14, 32]} />
              <meshBasicMaterial color={highContrast ? "#89f2ff" : "#4fd8ff"} transparent opacity={0.6} />
            </mesh>
            {[-0.45, 0.45].map((x, k) => (
              <mesh key={k} position={[x, 0.08, 0]}>
                <sphereGeometry args={[0.015, 10, 10]} />
                <meshBasicMaterial color={highContrast ? "#8bffb6" : "#52ff9a"} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
