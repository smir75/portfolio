// src/scenes/nav/CameraRig.jsx
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, lerp } from "@/utils/math3d";

export default function CameraRig({
  RADIUS,
  zoomRef,                 // optionnel : ref exposée au HUD
  controlsEnabled = true,  // on/off (désactive molette & raccourcis)
}) {
  const { camera, gl } = useThree(); // ✅ on récupère le canvas via gl.domElement

  const targetNear = useRef(new THREE.Vector3(0, 0.25, RADIUS));
  const targetFar  = useRef(new THREE.Vector3(0, 0.0, 0.0));
  const zSmooth    = useRef(0.25);

  // Init à partir d’un zoomRef éventuel
  useEffect(() => {
    if (zoomRef?.current != null) {
      const v = Number(zoomRef.current);
      if (!Number.isNaN(v)) zSmooth.current = clamp(v, 0, 1);
    } else if (zoomRef) {
      zoomRef.current = zSmooth.current;
    }
  }, [zoomRef]);

  const [deviceRatio, setDeviceRatio] = useState(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  );

  const farDist  = RADIUS * 6.0 + 12;
  const nearDist = RADIUS + 0.9;

  // 🎚️ Molette : on écoute UNIQUEMENT le canvas WebGL
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    const onWheel = (e) => {
      if (!controlsEnabled) return; // laisse la page scroller
      // Comme on est sur le canvas, on peut empêcher le scroll de la page seulement ici
      e.preventDefault();
      const delta = e.deltaY;
      const step  = 0.06;
      zSmooth.current = clamp(zSmooth.current + (delta > 0 ? step : -step), 0, 1);
      if (zoomRef) zoomRef.current = zSmooth.current;
    };

    // on attache quand controlsEnabled=true, on détache sinon
    if (controlsEnabled) {
      canvas.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => {
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [gl, controlsEnabled, zoomRef]);

  // ⌨️ Raccourcis clavier pour zoom (attach/detach selon controlsEnabled)
  useEffect(() => {
    const onKey = (e) => {
      if (!controlsEnabled) return;
      if (e.key === "+" || e.key === "=") {
        zSmooth.current = clamp(zSmooth.current + 0.06, 0, 1);
        if (zoomRef) zoomRef.current = zSmooth.current;
      }
      if (e.key === "-" || e.key === "_") {
        zSmooth.current = clamp(zSmooth.current - 0.06, 0, 1);
        if (zoomRef) zoomRef.current = zSmooth.current;
      }
      if (e.key === "0") {
        zSmooth.current = 0.25;
        if (zoomRef) zoomRef.current = zSmooth.current;
      }
    };

    if (controlsEnabled) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [controlsEnabled, zoomRef]);

  // 📱 Densité de pixels (dpi compensation)
  useEffect(() => {
    const onResize = () => setDeviceRatio(window.devicePixelRatio || 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🎥 Animation de la caméra
  useFrame(({ clock }) => {
    const t = zSmooth.current;

    const tgt = new THREE.Vector3()
      .copy(targetFar.current)
      .lerp(targetNear.current, Math.pow(t, 1.2));

    const baseDist = lerp(farDist, nearDist, t);
    const dpiComp  = 1 / Math.pow(deviceRatio, 0.5);
    const dist     = baseDist * dpiComp;

    const sway = 0.03 * Math.sin(clock.getElapsedTime() * 0.7);

    camera.position.set(0, 2.2 + 0.25 * t, dist + sway);
    camera.lookAt(tgt);
    camera.near = 0.1;
    camera.far  = Math.max(2000, farDist * 4);
    camera.updateProjectionMatrix();
  });

  return null;
}
