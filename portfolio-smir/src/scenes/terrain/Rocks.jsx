import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function Rocks({ RADIUS, count = 280 }) {
  const ref = useRef();
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!ref.current) return;
    const rnd = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1) - Math.PI / 2;
      const r = RADIUS + rnd(0.015, 0.05);
      const x = r * Math.cos(ph) * Math.cos(th);
      const y = r * Math.sin(ph);
      const z = r * Math.cos(ph) * Math.sin(th);
      tmp.position.set(x, y, z);
      tmp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y, z).normalize());
      const s = rnd(0.05, 0.16);
      tmp.scale.set(s, s, s);
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
      // nuances de gris/bleu très léger
      ref.current.setColorAt(i, new THREE.Color().setHSL(0.60, 0.06, 0.68 - Math.random() * 0.18));
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [RADIUS, count, tmp]);

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.95} metalness={0.03} vertexColors />
    </instancedMesh>
  );
}
