import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { clamp } from "@/utils/math3d";

export default function Dust({ bursts }) {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    g.current?.children.forEach((grp) => {
      const age = t - grp.userData.t0, k = clamp(age / 0.7, 0, 1);
      grp.children.forEach((p, i) => {
        const ang = (i / grp.children.length) * Math.PI * 2;
        const spread = 0.26 + 0.36 * k, y = 0.02 + 0.05 * (1 - k);
        p.position.set(Math.cos(ang) * spread, y, Math.sin(ang) * spread);
        p.scale.setScalar(0.22 + 0.5 * (1 - k));
        p.material.opacity = 0.45 * (1 - k);
      });
      if (age > 0.7) grp.visible = false;
    });
  });
  return (
    <group ref={g}>
      {bursts.map((b) => (
        <group key={b.id} position={b.pos.toArray()} userData={{ t0: b.t0 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i}><circleGeometry args={[0.03, 12]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.4} /></mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
