import React, { useEffect, useRef } from "react";

export default function StarfieldBackdrop({ density = 8000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: false });

    let raf = 0;
    let W = (c.width = innerWidth);
    let H = (c.height = innerHeight);
    let t0 = performance.now();

    const COUNT = Math.floor((W * H) / density);
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.5 + 0.3,
    }));

    const draw = (now) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0b1020");
      g.addColorStop(1, "#080d18");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const rad = ctx.createRadialGradient(W * 0.25, H * 0.2, 0, W * 0.25, H * 0.2, W * 0.45);
      rad.addColorStop(0, "rgba(212,175,55,0.08)");
      rad.addColorStop(1, "transparent");
      ctx.fillStyle = rad; ctx.fillRect(0, 0, W, H);

      const rad2 = ctx.createRadialGradient(W * 0.85, H * 0.8, 0, W * 0.85, H * 0.8, W * 0.35);
      rad2.addColorStop(0, "rgba(147,51,234,0.07)");
      rad2.addColorStop(1, "transparent");
      ctx.fillStyle = rad2; ctx.fillRect(0, 0, W, H);

      ctx.save();
      for (let s of stars) {
        s.y += (25 + 55 * s.z) * dt;
        if (s.y > H) { s.y = -10; s.x = Math.random() * W; }
        ctx.globalAlpha = 0.5 + 0.5 * s.z;
        ctx.fillStyle = "#e5ecff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();

        ctx.globalAlpha = 0.08 + 0.12 * s.z;
        ctx.fillRect(s.x - 0.3, s.y - s.r * 6, 0.6, s.r * 12);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
