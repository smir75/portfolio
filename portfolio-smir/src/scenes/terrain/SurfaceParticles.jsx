import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SURF_PARTICLES } from "@/constants/space";

export default function SurfaceParticles({ RADIUS, count = SURF_PARTICLES, reduceMotion }) {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(() => new THREE.PointsMaterial({ size: 0.028, transparent: true, opacity: 0.45 }), []);
  const basePos = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1) - Math.PI / 2;
      const r = RADIUS + 0.04 + Math.random() * 0.05;
      arr.set([r * Math.cos(ph) * Math.cos(th), r * Math.sin(ph), r * Math.cos(ph) * Math.sin(th)], i * 3);
    }
    return arr;
  }, [RADIUS, count]);
  const phase = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count]);
  const pts = useRef();
  useEffect(() => { geom.setAttribute("position", new THREE.BufferAttribute(basePos, 3)); }, [geom, basePos]);
  useFrame(({ clock }) => {
    if (!pts.current || reduceMotion) return;
    const a = pts.current.geometry?.attributes?.position; if (!a) return;
    const t = clock.getElapsedTime();
    const v = new THREE.Vector3(), n = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      v.set(a.array[ix], a.array[ix + 1], a.array[ix + 2]);
      n.copy(v).normalize();
      const m = 0.016 * Math.sin(t * 1.7 + phase[i]);
      v.addScaledVector(n, m);
      a.array[ix] = v.x; a.array[ix + 1] = v.y; a.array[ix + 2] = v.z;
    }
    a.needsUpdate = true;
  });
  return <points ref={pts} geometry={geom} material={mat} />;
}
