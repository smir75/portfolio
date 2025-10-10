// src/scenes/ui/CursorTrail.jsx
import React, { useEffect, useRef } from "react";

export default function CursorTrail({
  enabled = true,
  onlyOnSelector = null, // ex: ".top-nav-glass"
  maxParticles = 50,
  spawnPerMove = 3,
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const movingRef = useRef(false);
  const activeRef = useRef(true);
  const lastMoveTsRef = useRef(0);
  const spritesRef = useRef({ flame: null, smoke: null });

  useEffect(() => {
    if (!enabled) return;

    // Canvas overlay
    const c = document.createElement("canvas");
    c.id = "cursor-trail";
    Object.assign(c.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: 9999,
    });
    document.body.appendChild(c);
    canvasRef.current = c;
    const ctx = c.getContext("2d", { alpha: true });
    ctxRef.current = ctx;

    // DPR (cap à 1.5 pour la perf)
    const setSize = () => {
      const dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
      c.width = Math.floor(window.innerWidth * dpr);
      c.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Pré-render sprites (drastiquement plus rapide que drawPath+shadow)
    const makeSprite = (size, innerRGBA, outerRGBA) => {
      const off = document.createElement("canvas");
      off.width = off.height = size;
      const octx = off.getContext("2d");
      const g = octx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      g.addColorStop(0, innerRGBA);
      g.addColorStop(1, outerRGBA);
      octx.fillStyle = g;
      octx.fillRect(0, 0, size, size);
      return off;
    };
    // flame: chaud au centre → orange transparent
    const flame = makeSprite(48, "rgba(255,200,80,0.9)", "rgba(255,120,60,0.0)");
    // smoke: gris doux
    const smoke = makeSprite(64, "rgba(190,205,220,0.25)", "rgba(190,205,220,0.0)");
    spritesRef.current = { flame, smoke };

    // Activer seulement sur une zone (optionnel)
    let zoneEl = null;
    const onEnter = () => (activeRef.current = true);
    const onLeave = () => (activeRef.current = false);
    if (onlyOnSelector) {
      zoneEl = document.querySelector(onlyOnSelector);
      if (zoneEl) {
        activeRef.current = false;
        zoneEl.addEventListener("mouseenter", onEnter);
        zoneEl.addEventListener("mouseleave", onLeave);
      }
    }

    // Reduced motion → moins d’émission
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let spawnRate = spawnPerMove;
    const applyReduce = () => {
      spawnRate = media.matches ? Math.max(1, Math.floor(spawnPerMove / 2)) : spawnPerMove;
    };
    applyReduce();
    const mediaHandler = () => applyReduce();
    media.addEventListener?.("change", mediaHandler);

    // Mouvement (throttlé par rAF via movingRef)
    const onMove = (e) => {
      if (!activeRef.current) return;
      movingRef.current = true;
      lastMoveTsRef.current = performance.now();

      const x = e.clientX;
      const y = e.clientY;
      const { x: lx, y: ly } = lastPosRef.current;
      const vx = x - lx;
      const vy = y - ly;
      lastPosRef.current = { x, y };

      const len = Math.hypot(vx, vy) || 1;
      const ux = vx / len;
      const uy = vy / len;

      // Spawn très léger
      const count = Math.min(spawnRate, Math.max(1, Math.floor(len / 4)));
      const arr = particlesRef.current;
      for (let i = 0; i < count && arr.length < maxParticles; i++) {
        // Flame courte
        arr.push({
          x, y,
          vx: -ux * (1.2 + Math.random()*0.6) + (Math.random()-0.5)*0.5,
          vy: -uy * (1.2 + Math.random()*0.6) + (Math.random()-0.5)*0.5,
          life: 260 + Math.random() * 120,
          age: 0,
          kind: "flame",
          s: 0.7 + Math.random()*0.5, // scale
        });
        // Smoke moins fréquent
        if (Math.random() < 0.35 && arr.length < maxParticles) {
          arr.push({
            x, y,
            vx: -ux * 0.5 + (Math.random()-0.5)*0.4,
            vy: -uy * 0.5 + (Math.random()-0.5)*0.4,
            life: 520 + Math.random() * 420,
            age: 0,
            kind: "smoke",
            s: 0.8 + Math.random()*0.6,
          });
        }
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Visibilité → pause auto
    const onVis = () => {
      if (document.hidden) movingRef.current = false;
    };
    document.addEventListener("visibilitychange", onVis);

    // Boucle rAF lightweight
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const ctx = ctxRef.current;
      if (!ctx) return;

      const w = c.width / (ctx.getTransform().a || 1);
      const h = c.height / (ctx.getTransform().d || 1);

      // Effacement doux de la frame précédente (transparent, pas noir)
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      const arr = particlesRef.current;
      if (arr.length === 0 && !movingRef.current) return; // rien à faire

      // Stop auto du “moving” si plus de mouvement depuis 120ms
      if (performance.now() - lastMoveTsRef.current > 120) {
        movingRef.current = false;
      }

      const { flame, smoke } = spritesRef.current;
      // Dessin standard (pas de “lighter”, on laisse les sprites gérer le dégradé)
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.age += 16;
        if (p.age >= p.life) {
          arr.splice(i, 1);
          continue;
        }

        const t = p.age / p.life;
        p.x += p.vx;
        p.y += p.vy;
        if (p.kind === "smoke") p.vy += 0.008;

        // alpha & taille
        let sprite, size, alpha;
        if (p.kind === "flame") {
          sprite = flame;
          size = 28 * p.s * (1 - t * 0.3);
          alpha = 0.85 * (1 - t);
        } else {
          sprite = smoke;
          size = 34 * p.s * (0.6 + t * 0.7);
          alpha = 0.25 * (1 - t);
        }

        // draw
        const half = size / 2;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - half, p.y - half, size, size);
      }
      ctx.globalAlpha = 1;
    };
    rafRef.current = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", setSize);
      document.removeEventListener("visibilitychange", onVis);
      media.removeEventListener?.("change", mediaHandler);
      if (zoneEl) {
        zoneEl.removeEventListener("mouseenter", onEnter);
        zoneEl.removeEventListener("mouseleave", onLeave);
      }
      c.remove();
      particlesRef.current = [];
    };
  }, [enabled, onlyOnSelector, maxParticles, spawnPerMove]);

  return null;
}
