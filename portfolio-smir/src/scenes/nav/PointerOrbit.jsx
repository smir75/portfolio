// src/scenes/nav/PointerOrbit.jsx
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

/**
 * Drag (LMB) to rotate qWorldRef:
 * - Drag RIGHT  => yaw right
 * - Drag DOWN   => pitch down  (vertical corrigé)
 * Axes basés caméra (diagonales OK). Dead-zone pour préserver click/dblclick.
 * Inertie optionnelle après relâche.
 */
export default function PointerOrbit({
  qWorldRef,
  sensitivity = 0.003,
  deadZone = 3,          // px avant d'engager la rotation
  enabled = true,
  inertia = true,        // garde une rotation après le mouseup
  damping = 4.0,         // plus grand = s’arrête plus vite
  invertYaw = false,     // change si tu préfères l’autre sens horizontal
  invertPitch = true,    // ✅ par défaut ON pour corriger ton ressenti vertical
}) {
  const { gl, camera } = useThree();

  // état interne non réactif
  const s = useMemo(
    () => ({
      dragging: false,
      moved: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      vyaw: 0,    // vitesses angulaires (rad/s)
      vpitch: 0,
    }),
    []
  );

  useEffect(() => {
    if (!enabled) return;
    const el = gl?.domElement;
    if (!el) return;

    const onDown = (e) => {
      if (e.button !== 0) return; // LMB only
      s.dragging = true;
      s.moved = false;
      s.startX = s.lastX = e.clientX;
      s.startY = s.lastY = e.clientY;
      s.lastT = performance.now();
      s.vyaw = 0;
      s.vpitch = 0;
      try { el.setPointerCapture?.(e.pointerId); } catch {}
      e.preventDefault?.();
    };

    const onMove = (e) => {
      if (!s.dragging || !qWorldRef?.current) return;

      const now = performance.now();
      const dtMs = Math.max(1, now - s.lastT);
      s.lastT = now;

      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;

      // dead-zone : évite d'engager un drag pour un simple clic
      if (!s.moved) {
        const totalDx = e.clientX - s.startX;
        const totalDy = e.clientY - s.startY;
        if (Math.hypot(totalDx, totalDy) < deadZone) return;
        s.moved = true;
      }

      // axes caméra (diagonales OK)
      const up    = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();

      // sens intuitif:
      // - horizontal: drag RIGHT => yaw + (ou inverse si invertYaw)
      // - vertical:   drag DOWN  => pitch + (=> planète “descend” visuellement)
      const yawDelta   =  (invertYaw   ? -dx :  dx) * sensitivity;
      const pitchDelta =  (invertPitch ?  dy : -dy) * sensitivity;

      const qYaw   = new THREE.Quaternion().setFromAxisAngle(up,    yawDelta);
      const qPitch = new THREE.Quaternion().setFromAxisAngle(right, pitchDelta);
      qWorldRef.current.premultiply(qYaw).premultiply(qPitch).normalize();

      // vitesses angulaires pour l'inertie (rad/s)
      const dt = dtMs / 1000;
      if (dt > 0) {
        s.vyaw   = yawDelta   / dt;
        s.vpitch = pitchDelta / dt;
      }
    };

    const onUp = (e) => {
      s.dragging = false;
      try { el.releasePointerCapture?.(e.pointerId); } catch {}
    };

    const onLeave = () => { s.dragging = false; };

    el.addEventListener("pointerdown", onDown, { passive: false });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, camera, qWorldRef, sensitivity, deadZone, enabled, invertYaw, invertPitch, s]);

  // inertie après relâche
  useFrame((_, dt) => {
    if (!inertia || s.dragging || !qWorldRef?.current) return;

    const k = Math.exp(-damping * dt);
    s.vyaw   *= k;
    s.vpitch *= k;

    if (Math.abs(s.vyaw) < 1e-5 && Math.abs(s.vpitch) < 1e-5) {
      s.vyaw = s.vpitch = 0;
      return;
    }

    const up    = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();

    const qYaw   = new THREE.Quaternion().setFromAxisAngle(up,    s.vyaw   * dt);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(right, s.vpitch * dt);
    qWorldRef.current.premultiply(qYaw).premultiply(qPitch).normalize();
  });

  return null;
}
