import React, { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Rivers({ RADIUS, count = 3, color = "#6cc7ff" }) {
  const group = useRef();
  const curves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const pts = [];
      const turns = 7 + Math.floor(Math.random() * 6);
      const phase = Math.random() * Math.PI * 2;
      for (let k = 0; k < turns; k++) {
        const u = (k / (turns - 1)) * Math.PI * 2 + phase;
        const lat = Math.sin(u * 0.5) * THREE.MathUtils.degToRad(22 + Math.random() * 14);
        const lon = u;
        const r = RADIUS + 0.05;
        pts.push(new THREE.Vector3(
          r * Math.cos(lat) * Math.cos(lon),
          r * Math.sin(lat),
          r * Math.cos(lat) * Math.sin(lon)
        ));
      }
      arr.push(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.12));
    }
    return arr;
  }, [RADIUS, count]);

  return (
    <group ref={group}>
      {curves.map((cv, i) => (
        <mesh key={i}>
          <tubeGeometry args={[cv, 180, 0.03, 8, false]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.35} metalness={0.05} transparent opacity={0.75} depthWrite={false}/>
        </mesh>
      ))}
    </group>
  );
}
