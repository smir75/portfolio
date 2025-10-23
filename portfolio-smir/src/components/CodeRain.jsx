// src/components/CodeRain.jsx
import React, { useEffect, useRef } from "react";

export default function CodeRain({
  density = 20,          // colonnes par 1000px de largeur env.
  speed = 1.1,           // vitesse de chute
  charSize = 16,         // taille (px)
  color = "#35ff88",     // vert matrix
  glow = true,           // halo
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const colsRef = useRef([]);
  const devicePixelRatioRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let width = canvas.clientWidth || 600;
    let height = canvas.clientHeight || 400;

    // DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    devicePixelRatioRef.current = dpr;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    // colonnes
    const cols = Math.max(10, Math.floor((width / 1000) * density));
    const columnWidth = Math.max(10, Math.floor(width / cols));
    const columnCount = Math.floor(width / columnWidth);
    const drops = new Array(columnCount)
      .fill(0)
      .map(() => Math.floor(Math.random() * height));

    colsRef.current = { columnWidth, columnCount, drops, width, height };

    // style
    ctx.font = `${charSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    ctx.textBaseline = "top";

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
    } else {
      ctx.shadowBlur = 0;
    }

    const glyphs =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function step() {
      rafRef.current = requestAnimationFrame(step);

      // voile sombre pour tracer les traînées
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // couleur des glyphes
      ctx.fillStyle = color;

      for (let i = 0; i < colsRef.current.columnCount; i++) {
        const x = i * colsRef.current.columnWidth;
        const y = colsRef.current.drops[i] * (charSize + 2);

        const char = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillText(char, x, y);

        // avance
        colsRef.current.drops[i] += speed;

        // remise en haut
        if (y > height && Math.random() > 0.975) {
          colsRef.current.drops[i] = 0;
        }
      }
    }

    step();

    // resize (ResizeObserver → recalcul)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        width = Math.max(1, cr.width);
        height = Math.max(1, cr.height);
        const dpr2 = devicePixelRatioRef.current;
        canvas.width = Math.floor(width * dpr2);
        canvas.height = Math.floor(height * dpr2);
        ctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
        // recalcul des colonnes
        const newCols = Math.max(10, Math.floor((width / 1000) * density));
        const columnWidth = Math.max(10, Math.floor(width / newCols));
        const columnCount = Math.floor(width / columnWidth);
        const drops = new Array(columnCount)
          .fill(0)
          .map(() => Math.floor(Math.random() * height));
        colsRef.current = { columnWidth, columnCount, drops, width, height };
        ctx.font = `${charSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      }
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [density, speed, charSize, color, glow]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      aria-hidden="true"
      role="img"
    />
  );
}
