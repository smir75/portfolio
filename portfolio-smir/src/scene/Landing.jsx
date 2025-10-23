// src/scene/Landing.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ============================================
   GLContextGuards
   - Applique les params GL (tone mapping, color space)
   - Gère proprement webglcontextlost/restored avec cleanup
   ============================================ */
function GLContextGuards() {
  const { gl } = useThree();

  useEffect(() => {
    // GL params
    gl.setClearColor(new THREE.Color(0, 0, 0), 0);
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;

    const canvas = gl.domElement;

    const onLostCapture = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const onRestored = () => {
      try {
        gl.resetState();
      } catch {}
    };

    canvas.addEventListener("webglcontextlost", onLostCapture, { capture: true, passive: false });
    canvas.addEventListener("webglcontextrestored", onRestored, { passive: true });

    return () => {
      canvas.removeEventListener("webglcontextlost", onLostCapture, { capture: true });
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl]);

  return null;
}

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
      // "roll" ici est techniquement un yaw visuel (rotation Y)
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
      {/* frustumCulled false pour garantir la visibilité de l'effet */}
      <mesh frustumCulled={false} position={[0, -0.72, 0]} geometry={geometries.flame} material={materials.flame} />
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
    // HUD jamais cullé
    <group ref={ref} frustumCulled={false}>
      <Rocket launch={launch} />
    </group>
  );
}

export default function Landing({ onEnter }) {
  const [launching, setLaunching] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const didEnterRef = useRef(false);

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

    timeoutRef.current = setTimeout(() => {
      if (!isUnmountedRef.current && !didEnterRef.current) {
        didEnterRef.current = true;
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

  // Respect "prefers-reduced-motion" : skip l'intro
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced && isVisible && !launching && !didEnterRef.current) {
      didEnterRef.current = true;
      setIsVisible(false);
      onEnter?.();
    }
  }, [isVisible, launching, onEnter]);

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
      aria-labelledby="landing-title"
      aria-label="Landing overlay"
      style={{ pointerEvents: "auto" }}
    >
      {/* Canvas 3D — visible pendant l’anim */}
      <div className="landing-canvas">
        <Canvas {...canvasConfig}>
          <GLContextGuards />
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 3, 4]} intensity={0.9} castShadow={false} />
          <RocketHUD
            launch={launching}
            zDist={3.0}
            bottomPx={88}
            scale={1.0}
            onExitTop={() => {
              // ✅ Première arrivée : on enter + annule le timeout
              if (!didEnterRef.current) {
                didEnterRef.current = true;
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                setIsVisible(false);
                onEnter?.();
              }
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
            id="landing-title"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
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
            Créé par <strong> M. Sagar </strong> — Éxpédition sur une lune sculptée à la main, entre
            stations, satellites et HUD immersif.
            <br />
            Appuie sur{" "}
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
            ou clique sur le bouton.
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
