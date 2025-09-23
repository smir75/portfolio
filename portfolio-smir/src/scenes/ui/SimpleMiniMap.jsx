import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Mini-map circulaire des directions "face caméra".
 * - taille fixe en px (indépendante du zoom 3D)
 * - clic = calcule un vecteur local (avant application de qWorld) et appelle onAimLocal(dirLocal)
 */
export default function SimpleMiniMap({ quatRef, stations, size = 150, onAimLocal }) {
  const canvasRef = useRef(null);

  // dessin
  useFrame(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;

    const w = (c.width = size);
    const h = (c.height = size);
    const r = (Math.min(w, h) / 2) - 6;

    ctx.clearRect(0, 0, w, h);

    // fond + contour
    ctx.fillStyle = "#0f172acc";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(w/2, h/2, r, 0, Math.PI*2); ctx.fill(); ctx.stroke();

    // marque avant (petit triangle en haut)
    ctx.fillStyle = "#93c5fd";
    ctx.beginPath();
    ctx.moveTo(w/2, h/2 - r + 8);
    ctx.lineTo(w/2 - 6, h/2 - r + 22);
    ctx.lineTo(w/2 + 6, h/2 - r + 22);
    ctx.closePath(); ctx.fill();

    // stations
    stations.forEach(s => {
      // vLocal -> appliquer qWorld pour se retrouver dans le repère "face caméra"
      const v = s.pos.clone().normalize().applyQuaternion(quatRef.current);
      const x = v.x, y = v.y;
      const mag = Math.sqrt(x*x + y*y) || 1;
      // projeter dans le disque, pondérer par la "profondeur" (z)
      const k = Math.min(1, Math.abs(v.z) + 0.4);
      const px = w/2 + (x / mag) * (r - 10) * k;
      const py = h/2 - (y / mag) * (r - 10) * k;

      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
    });

    // cercle intérieur discret
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(w/2, h/2, r-10, 0, Math.PI*2); ctx.stroke();
  });

  // clic => dir locale
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const onClick = (e) => {
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const r = Math.min(cx, cy) - 6;

      // coords normalisées dans le disque [-1,1]
      const nx = (x - cx) / r;
      const ny = (cy - y) / r;
      const d2 = nx*nx + ny*ny;
      if (d2 > 1.0001) return; // hors disque

      const nz = Math.sqrt(Math.max(0, 1 - d2)); // hemisphere avant
      // vFront = direction dans le repère "après" qWorld (face caméra)
      const vFront = new THREE.Vector3(nx, ny, nz);
      // on veut la direction locale (avant qWorld) => appliquer l'inverse
      const qInv = quatRef.current.clone().invert();
      const vLocal = vFront.clone().applyQuaternion(qInv).normalize();

      onAimLocal?.(vLocal);
    };
    c.addEventListener("click", onClick);
    return () => c.removeEventListener("click", onClick);
  }, [onAimLocal, quatRef]);

  return (
    <div className="p-2 border shadow-xl rounded-xl border-slate-700 bg-slate-900/80">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}
