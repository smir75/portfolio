import React, { useMemo } from "react";
import * as THREE from "three";
import { Billboard } from "@react-three/drei";

export default function Nebulae({ count = 7, dist = 320 }) {
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      pos: new THREE.Vector3().randomDirection().multiplyScalar(dist + Math.random() * 60),
      scale: 40 + Math.random() * 40,
      color: ["#7aa2ff", "#ff7ab6", "#9cff8a", "#ffb86b"][Math.floor(Math.random() * 4)],
      rot: Math.random() * Math.PI * 2,
    })), [count, dist]
  );
  return (
    <group>
      {seeds.map((s, i) => (
        <Billboard key={i} position={s.pos.toArray()}>
          <mesh rotation={[0, 0, s.rot]}>
            <planeGeometry args={[s.scale, s.scale]} />
            <meshBasicMaterial color={s.color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}
