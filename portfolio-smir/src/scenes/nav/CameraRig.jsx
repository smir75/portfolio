import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, lerp } from "@/utils/math3d";

export default function CameraRig({ RADIUS, zoomRef }) {
  const { camera, gl } = useThree();
  const targetNear = useRef(new THREE.Vector3(0, 0.25, RADIUS));
  const targetFar = useRef(new THREE.Vector3(0, 0.0, 0.0));
  const zSmooth = useRef(0.25);
  const [deviceRatio, setDeviceRatio] = useState(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  );

  const farDist = RADIUS * 6.0 + 12;
  const nearDist = RADIUS + 0.9;

  useEffect(() => {
    const onWheel = (e) => {
      // important pour empêcher le scroll de la page
      e.preventDefault();
      const delta = e.deltaY;
      const step = 0.06;
      zSmooth.current = clamp(
        zSmooth.current + (delta > 0 ? step : -step),
        0,
        1
      );
      if (zoomRef) zoomRef.current = zSmooth.current;
    };

    const el = gl?.domElement;
    el && el.addEventListener("wheel", onWheel, { passive: false });
    // écoute globale pour les zones UI qui recouvrent le canvas
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el && el.removeEventListener("wheel", onWheel);
      window.removeEventListener("wheel", onWheel);
    };
  }, [gl, zoomRef]);

  useEffect(() => {
    const onKey = (e) => {
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomRef]);

  useEffect(() => {
    const onResize = () => setDeviceRatio(window.devicePixelRatio || 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useFrame(({ clock }) => {
    const t = zSmooth.current;
    const tgt = new THREE.Vector3()
      .copy(targetFar.current)
      .lerp(targetNear.current, Math.pow(t, 1.2));
    const baseDist = lerp(farDist, nearDist, t);
    const dpiComp = 1 / Math.pow(deviceRatio, 0.5);
    const dist = baseDist * dpiComp;
    const sway = 0.03 * Math.sin(clock.getElapsedTime() * 0.7);

    camera.position.set(0, 2.2 + 0.25 * t, dist + sway);
    camera.lookAt(tgt);
    camera.near = 0.1;
    camera.far = Math.max(2000, farDist * 4);
    camera.updateProjectionMatrix();
  });

  return null;
}
