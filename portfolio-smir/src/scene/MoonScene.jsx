// src/scene/MoonScene.jsx
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import { useSettings } from "@/state/settings.jsx";
import { BASE_RADIUS } from "@/constants/space";

import Scene from "@/scenes/core/Scene";
import OverlayUI from "@/scenes/ui/OverlayUI";
import TopNav from "@/scenes/ui/TopNav";
import buildStations from "@/scenes/stations/buildStations";

export default function MoonScene({ onOpenStation }) {
  const { settings } = useSettings();

  const [canvasKey, setCanvasKey] = useState(0);

  const RADIUS = BASE_RADIUS;
  // ✅ Génère UNE FOIS la liste des stations
  const stations = useMemo(() => buildStations(RADIUS), [RADIUS]);

  const worldQuatRef = useRef(new THREE.Quaternion());
  const zoomRef = useRef(0.25);

  const glRef = useRef(null);
  const lostOnceRef = useRef(false);

  const onCanvasCreated = useCallback(({ camera, gl }) => {
    camera.lookAt(0, 0, 0);
    gl.setClearColor("#050a16", 1);
    gl.shadowMap.enabled = false;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    glRef.current = gl;
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;
    const canvas = gl.domElement;

    const onLostCapture = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (window.__saga_navigating) return;
      if (lostOnceRef.current) return;
      lostOnceRef.current = true;
      setTimeout(() => setCanvasKey((k) => k + 1), 0);
    };
    const onRestored = () => { try { gl.resetState(); } catch {} };

    canvas.addEventListener("webglcontextlost", onLostCapture, { capture: true, passive: false });
    canvas.addEventListener("webglcontextrestored", onRestored, { passive: true });

    return () => {
      canvas.removeEventListener("webglcontextlost", onLostCapture, true);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [canvasKey]);

  return (
    <div className="fixed inset-0 bg-black">
      <div className="fixed inset-x-0 top-0 z-[120] pointer-events-auto">
        {/* ✅ Passe la même liste à l’UI */}
        <TopNav stations={stations} />
      </div>

      <Canvas
        key={canvasKey}
        dpr={[1, 1.75]}
        shadows={false}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 2.2, RADIUS * 3.2], fov: 42, near: 0.1, far: 1000 }}
        onCreated={onCanvasCreated}
        style={{ width: "100vw", height: "100vh", zIndex: 0, display: "block" }}
      >
        {/* ✅ Passe la même liste à la scène */}
        <Scene
          RADIUS={RADIUS}
          stations={stations}
          onOpenStation={onOpenStation}
          quality={settings.quality}
          reduceMotion={settings.reduceMotion || settings.presentation}
          highContrast={settings.highContrast}
          worldQuatRef={worldQuatRef}
          zoomRef={zoomRef}
        />
      </Canvas>

      <OverlayUI />
    </div>
  );
}
