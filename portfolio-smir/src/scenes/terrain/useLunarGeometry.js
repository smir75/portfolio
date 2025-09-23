import { useMemo } from "react";
import * as THREE from "three";
import { clamp } from "@/utils/math3d";

/**
 * Géométrie "lunaire" douce :
 * - faible bruit radial multi-harmoniques (sans pics)
 * - cratères à profil doux (bord faible)
 * - coloration en nuances de gris (léger bleu froid)
 */
export default function useLunarGeometry(RADIUS, segs = 168) {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(RADIUS, segs, segs);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();

    // harmoniques directionnelles (petite amplitude)
    const dirs = Array.from({ length: 5 }, () => new THREE.Vector3().randomDirection());
    const freq = [1.3, 2.1, 3.7, 6.0, 9.5];
    const amp  = [0.06, 0.04, 0.03, 0.02, 0.015];
    const phase= [0.0, 0.8, 1.7, 2.6, 3.9];

    // cratères modérés
    const craterCount = 90;
    const craters = Array.from({ length: craterCount }, () => {
      const c = new THREE.Vector3().randomDirection();
      const r = THREE.MathUtils.lerp(0.04, 0.12, Math.random());
      const d = THREE.MathUtils.lerp(0.03, 0.10, Math.random());
      return { c, r, d };
    });

    const noiseOnNormal = (n) => {
      let h = 0;
      for (let i = 0; i < dirs.length; i++) {
        const dot = n.dot(dirs[i]);
        h += amp[i] * Math.sin(freq[i] * (dot * Math.PI + phase[i]));
      }
      return h * 0.45; // amplitude globale (faible)
    };

    // bol + anneau très discret
    const craterProfile = (theta, r, depth) => {
      if (theta > r) return 0;
      const x = theta / r;
      const bowl = -depth * Math.pow(1 - x * x, 2.2);
      const rim  = depth * 0.18 * Math.max(0, Math.pow(1 - Math.abs(x - 0.85) * 8.0, 2));
      return bowl + rim;
    };

    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();

      let h = noiseOnNormal(n);
      for (let j = 0; j < craters.length; j++) {
        const { c, r, d } = craters[j];
        const theta = Math.acos(clamp(n.dot(c), -1, 1));
        if (theta < r * 1.08) h += craterProfile(theta, r, d * 0.9);
      }

      const newR = RADIUS + h;
      n.multiplyScalar(newR);
      pos.setXYZ(i, n.x, n.y, n.z);

      // palette gris froide
      const t = clamp((h + 0.10) / 0.22, 0, 1);
      const col = new THREE.Color().setHSL(0.60, 0.05 + 0.04 * (1 - t), 0.70 - 0.20 * t);
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [RADIUS, segs]);
}
