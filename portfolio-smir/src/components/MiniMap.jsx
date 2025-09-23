// src/components/MiniMap.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MiniMap({ quatRef, stations = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");

    function draw() {
      const w = cvs.width, h = cvs.height;
      ctx.clearRect(0, 0, w, h);

      // fond
      ctx.fillStyle = "rgba(2,8,23,0.9)";
      ctx.strokeStyle = "rgba(51,65,85,0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, w - 1, h - 1, 12);
      ctx.fill();
      ctx.stroke();

      // planète (vue du dessus)
      ctx.strokeStyle = "rgba(148,163,184,0.8)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.34, 0, Math.PI * 2);
      ctx.stroke();

      // orientation (avant = +Z)
      const q = quatRef?.current || new THREE.Quaternion();
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      const angle = Math.atan2(forward.x, forward.z);
      const r = Math.min(w, h) * 0.34;
      ctx.strokeStyle = "rgba(125,211,252,0.9)";
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(w / 2 + Math.sin(angle) * r, h / 2 + Math.cos(angle) * r);
      ctx.stroke();

      // stations (proj lat/lon simplifiée)
      stations.forEach((s) => {
        const v = s.pos.clone().normalize();
        const lon = Math.atan2(v.z, v.x);
        const px = w / 2 + Math.cos(lon) * r;
        const py = h / 2 + Math.sin(lon) * r;
        ctx.fillStyle = s.color || "#7cc6ff";
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }, [quatRef, stations]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={140}
      style={{
        width: 180,
        height: 140,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      }}
    />
  );
}
