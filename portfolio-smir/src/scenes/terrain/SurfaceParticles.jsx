// src/scenes/terrain/SurfaceParticles.jsx
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SURF_PARTICLES } from "@/constants/space";

export default function SurfaceParticles({ RADIUS, count = SURF_PARTICLES, reduceMotion }) {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.028, transparent: true, opacity: 0.45 }),
    []
  );

  // positions de base (une seule fois)
  const basePos = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const th = 2 * Math.PI * u;
      const ph = Math.acos(2 * v - 1) - Math.PI / 2;
      const r = RADIUS + 0.04 + Math.random() * 0.05;
      const x = r * Math.cos(ph) * Math.cos(th);
      const y = r * Math.sin(ph);
      const z = r * Math.cos(ph) * Math.sin(th);
      const ix = i * 3;
      arr[ix] = x; arr[ix + 1] = y; arr[ix + 2] = z;
    }
    return arr;
  }, [RADIUS, count]);

  // phase par point (une seule fois)
  const phase = useMemo(
    () => Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );

  const pts = useRef(null);

  useEffect(() => {
    geom.setAttribute("position", new THREE.BufferAttribute(basePos, 3));
  }, [geom, basePos]);

  // vecteurs temporaires réutilisés (pas recréés à chaque frame)
  const v = useRef(new THREE.Vector3());
  const n = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    if (!pts.current || reduceMotion) return;
    const a = pts.current.geometry && pts.current.geometry.attributes && pts.current.geometry.attributes.position;
    if (!a) return;

    const t = clock.getElapsedTime();
    const arr = a.array; // JS pur (pas de cast TS)

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      v.current.set(arr[ix], arr[ix + 1], arr[ix + 2]);     // position courante
      n.current.copy(v.current).normalize();                // normale
      const m = 0.016 * Math.sin(t * 1.7 + phase[i]);      // oscillation
      v.current.addScaledVector(n.current, m);             // offset radial léger
      arr[ix] = v.current.x;
      arr[ix + 1] = v.current.y;
      arr[ix + 2] = v.current.z;
    }
    a.needsUpdate = true;
  });

  return <points ref={pts} geometry={geom} material={mat} />;
}
