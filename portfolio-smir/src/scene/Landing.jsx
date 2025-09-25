// src/scene/Landing.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Rocket({ launch }) {
  const group = useRef();
  const vel = useRef(0);
  const y = useRef(0); // base locale = 0 (ancrage HUD)
  const roll = useRef(0);
  const targetY = useRef(0);
  const baseY = useRef(0);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1 / 60);
    const t = state.clock.getElapsedTime();

    if (launch) {
      vel.current = Math.min(vel.current + 8.0 * dt, 6.5);
      y.current += vel.current * dt;
      roll.current = roll.current * 0.9 + Math.sin(t * 6) * 0.002;
    } else {
      const floatOffset = Math.sin(t * 1.1) * 0.06;
      targetY.current = baseY.current + floatOffset;
      y.current += (targetY.current - y.current) * dt * 8;
      roll.current += (Math.sin(t * 0.6) * 0.02 - roll.current) * dt * 6;
      vel.current *= Math.exp(-6.0 * dt);
    }

    if (group.current) {
      group.current.position.y = y.current;
      group.current.rotation.y = roll.current;
    }
  });

  const geometries = useMemo(
    () => ({
      body: new THREE.CylinderGeometry(0.15, 0.15, 1.0, 24),
      nose: new THREE.ConeGeometry(0.15, 0.3, 24),
      fin: new THREE.BoxGeometry(0.04, 0.28, 0.18),
      finZ: new THREE.BoxGeometry(0.18, 0.28, 0.04),
      engine: new THREE.CylinderGeometry(0.06, 0.14, 0.16, 16),
      flame: new THREE.ConeGeometry(0.18, 0.6, 16, 1, true),
    }),
    []
  );

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#e6eef6", metalness: 0.18, roughness: 0.45 }),
      nose: new THREE.MeshStandardMaterial({ color: "#b8c7db", metalness: 0.28, roughness: 0.42 }),
      fin: new THREE.MeshStandardMaterial({ color: "#7f8ea0", metalness: 0.16, roughness: 0.48 }),
      engine: new THREE.MeshStandardMaterial({ color: "#475563", metalness: 0.4, roughness: 0.46 }),
      flame: new THREE.MeshBasicMaterial({
        color: "#9ad8ff",
        transparent: true,
        opacity: launch ? 0.78 : 0.45,
        blending: THREE.AdditiveBlending,
      }),
    }),
    [launch]
  );

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geo) => geo.dispose());
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [geometries, materials]);

  return (
    <group ref={group}>
      <mesh geometry={geometries.body} material={materials.body} />
      <mesh position={[0, 0.6, 0]} geometry={geometries.nose} material={materials.nose} />
      {[-1, 1].map((s) => (
        <mesh
          key={`x${s}`}
          position={[s * 0.16, -0.25, 0]}
          rotation={[0, 0, s * (Math.PI / 9)]}
          geometry={geometries.fin}
          material={materials.fin}
        />
      ))}
      {[-1, 1].map((s) => (
        <mesh
          key={`z${s}`}
          position={[0, -0.25, s * 0.16]}
          rotation={[s * (Math.PI / 9), 0, 0]}
          geometry={geometries.finZ}
          material={materials.fin}
        />
      ))}
      <mesh position={[0, -0.55, 0]} geometry={geometries.engine} material={materials.engine} />
      <mesh position={[0, -0.72, 0]} geometry={geometries.flame} material={materials.flame} />
      <group position={[0, -0.85, 0]}>
        <Sparkles count={launch ? 44 : 16} scale={0.9} size={1.6} speed={1.2} color="#bfe3ff" />
      </group>
      <pointLight position={[0, -0.7, 0]} intensity={launch ? 2.2 : 1.1} distance={4} color="#bfe3ff" />
    </group>
  );
}

/* ======================================================
   RocketHUD : ancrage bas/centre + montée écran
   (perfs: aucun new() dans useFrame)
   ====================================================== */
function RocketHUD({ launch, zDist = 3.0, bottomPx = 88, scale = 1.0, onExitTop }) {
  const ref = useRef();
  const camY = useRef(0);
  const vy = useRef(0);
  const started = useRef(false);

  // Vecteurs réutilisés à chaque frame (zéro alloc)
  const tmp = useMemo(
    () => ({
      offset: new THREE.Vector3(),
      worldPos: new THREE.Vector3(),
    }),
    []
  );

  useFrame(({ camera, size }, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1 / 60);

    const fovRad = (camera.fov * Math.PI) / 180;
    const halfH = Math.tan(fovRad / 2) * zDist;
    const baseY = -halfH + (bottomPx / size.height) * (2 * halfH); // bas + marge

    if (!launch) {
      camY.current += (baseY - camY.current) * dt * 10;
      vy.current *= Math.exp(-8 * dt);
      started.current = false;
    } else {
      if (!started.current) {
        started.current = true;
        camY.current = baseY;
        vy.current = 0;
      }
      vy.current = Math.min(vy.current + 12 * dt, 10);
      camY.current += vy.current * dt;

      if (camY.current > halfH + 0.8) onExitTop?.();
    }

    tmp.offset.set(0, camY.current, -zDist).applyQuaternion(camera.quaternion);
    tmp.worldPos.copy(camera.position).add(tmp.offset);

    if (ref.current) {
      ref.current.position.copy(tmp.worldPos);
      ref.current.quaternion.copy(camera.quaternion);
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={ref}>
      <Rocket launch={launch} />
    </group>
  );
}

export default function Landing({ onEnter }) {
  const [launching, setLaunching] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);

  // Empêche le scroll derrière le landing
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    htmlEl.style.overflow = "hidden";
    bodyEl.style.overflow = "hidden";
    return () => {
      if (!isUnmountedRef.current) {
        htmlEl.style.overflow = prevHtmlOverflow;
        bodyEl.style.overflow = prevBodyOverflow;
      }
    };
  }, []);

  const handleEnter = useCallback(() => {
    if (launching) return;
    setLaunching(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Sécurité (si jamais onExitTop ne déclenche pas)
    timeoutRef.current = setTimeout(() => {
      if (!isUnmountedRef.current) {
        setIsVisible(false);
        onEnter?.();
      }
    }, 1200);
  }, [launching, onEnter]);

  // Entrée clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnter]);

  // Cleanup
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Qualité + anim fluide (qualité conservée)
  const canvasConfig = useMemo(
    () => ({
      dpr: [1, 2], // qualité retina préservée
      gl: {
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        depth: true,
        stencil: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      },
      camera: { position: [0, 0.6, 4.2], fov: 46, near: 0.1, far: 100 },
    }),
    []
  );

  if (!isVisible) return null;

  return (
    <div
      id="landing-overlay"
      className={`fixed inset-0 z-[1000] text-slate-100 overflow-hidden ${launching ? "launching" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Landing overlay"
      style={{ pointerEvents: "auto" }}
    >
      <style>{`
        .landing-canvas { position:absolute; inset:0; z-index:1002; pointer-events:none; }
        .split-pane { position:absolute; top:0; bottom:0; width:50%; background:linear-gradient(90deg, rgba(7,11,22,0.75), rgba(10,14,22,0.45)); transition:transform 0.9s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.6s ease; z-index:1001; pointer-events:none; will-change:transform, opacity; }
        .split-pane.left { left:0; transform:translateX(0); }
        .split-pane.right { right:0; transform:translateX(0); }
        .launching .split-pane.left { transform:translateX(-110%); opacity:0; }
        .launching .split-pane.right { transform:translateX(110%); opacity:0; }
        .landing-center-wrap { position:relative; z-index:1003; display:flex; align-items:center; justify-content:center; width:100%; height:100%; }
        .landing-center { width:100%; max-width:980px; padding:3rem 1.5rem; margin:0 auto; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem; will-change:transform, opacity; }
        #landing-overlay::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(10,14,22,0.0) 35%, rgba(4,6,10,0.6) 100%); pointer-events:none; transition:opacity 0.9s ease; will-change:opacity; z-index:999; }
        .btn-glass { background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px) saturate(110%); padding:0.6rem 1.15rem; border-radius:12px; color:#e6f0ff; font-weight:600; box-shadow:0 6px 18px rgba(2,8,23,0.6); transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease; cursor:pointer; outline:none; user-select:none; }
        .btn-glass:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 10px 30px rgba(3,12,35,0.7); }
        .btn-glass:active { transform: translateY(-1px) scale(0.998); }
        .btn-glass:focus-visible { box-shadow: 0 6px 18px rgba(2,8,23,0.6), 0 0 0 2px rgba(96,165,250,0.5); }
        .launching #landing-overlay::before { opacity:0; }
        .launching .landing-center { transform: translateY(-18vh) scale(0.98); opacity:0; transition: transform 1.2s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.9s ease; }
        @media (max-width: 640px) { .landing-center { padding: 2rem 1rem; } h1 { font-size: 1.85rem !important; } }
        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* Canvas 3D — visible pendant l’anim */}
      <div className="landing-canvas">
        <Canvas
          {...canvasConfig}
          onCreated={({ gl }) => {
  gl.setClearColor(new THREE.Color(0, 0, 0), 0);
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.0;

  const canvas = gl.domElement;


 
  const onLostCapture = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    // pas de remount ici : le landing se ferme très vite de toute façon
  };
  const onRestored = () => {
    try { gl.resetState(); } catch {}
  };

  canvas.addEventListener("webglcontextlost", onLostCapture, { capture: true, passive: false });
  canvas.addEventListener("webglcontextrestored", onRestored, { passive: true });

  // cleanup
  return () => {
    canvas.removeEventListener("webglcontextlost", onLostCapture, { capture: true });
    canvas.removeEventListener("webglcontextrestored", onRestored);
  };
}}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 3, 4]} intensity={0.9} castShadow={false} />
          <RocketHUD
            launch={launching}
            zDist={3.0}
            bottomPx={88}
            scale={1.0}
            onExitTop={() => {
              setIsVisible(false);
              onEnter?.();
            }}
          />
        </Canvas>
      </div>

      {/* Split panes */}
      <div className="split-pane left" />
      <div className="split-pane right" />

      {/* Contenu */}
      <div className="landing-center-wrap" role="document">
        <div className="landing-center">
          <h1
            style={{
              fontFamily: "Orbitron, system-ui, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              lineHeight: 1.02,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Welcome to <span style={{ color: "#60a5fa" }}>Sagar.io</span>
          </h1>

          <p
            style={{
              maxWidth: 820,
              color: "rgba(226,236,255,0.88)",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Créé par <strong> M. Sagar </strong> — Éxpédition sur une lune sculptée à la main, entre stations, satellites et HUD immersif.
            <br />
            Appuie sur {" "}
            <kbd
              style={{
                padding: "2px 6px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                fontFamily: "monospace",
                fontSize: "0.9em",
              }}
            >
              Entrée
            </kbd>{" "}
            ou clique sur Enter.
          </p>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={handleEnter}
              className="btn-glass"
              aria-label="Entrée"
              autoFocus
              disabled={launching}
              style={{ pointerEvents: "auto" }}
            >
              {launching ? "Launching…" : "Entrée"}
            </button>
          </div>

          <div style={{ marginTop: 18, color: "rgba(200,220,255,0.5)", fontSize: 13 }}>
            © {new Date().getFullYear()} M. Sagar — All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
