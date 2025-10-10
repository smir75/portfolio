// src/scenes/nav/PointerOrbit.jsx
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

/**
 * Drag (LMB) to rotate qWorldRef:
 * - Drag RIGHT  => yaw right
 * - Drag DOWN   => pitch down
 * Axes caméra (diagonales OK). Dead-zone pour préserver click/dblclick.
 * Inertie optionnelle après relâche.
 */
export default function PointerOrbit({
  qWorldRef,
  sensitivity = 0.003,
  deadZone = 3,
  enabled = true,
  inertia = true,
  damping = 4.0,
  invertYaw = false,
  invertPitch = true,
}) {
  const { gl, camera } = useThree();

  // état + temporaires réutilisés
  const s = useMemo(
    () => ({
      dragging: false,
      moved: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      vyaw: 0,    // rad/s
      vpitch: 0,

      // TMP objects (évite new/alloc)
      vUp: new THREE.Vector3(),
      vRight: new THREE.Vector3(),
      qYaw: new THREE.Quaternion(),
      qPitch: new THREE.Quaternion(),
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
        if ((totalDx * totalDx + totalDy * totalDy) < (deadZone * deadZone)) return;
        s.moved = true;
      }

      // axes caméra sans alloc
      s.vUp.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
      s.vRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();

      const yawDelta   =  (invertYaw   ? -dx :  dx) * sensitivity;
      const pitchDelta =  (invertPitch ?  dy : -dy) * sensitivity;

      s.qYaw.setFromAxisAngle(s.vUp,    yawDelta);
      s.qPitch.setFromAxisAngle(s.vRight, pitchDelta);
      qWorldRef.current.premultiply(s.qYaw).premultiply(s.qPitch).normalize();

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

  // inertie après relâche — sans alloc
  useFrame((_, dt) => {
    if (!inertia || s.dragging || !qWorldRef?.current) return;

    const k = Math.exp(-damping * dt);
    s.vyaw   *= k;
    s.vpitch *= k;

    if (Math.abs(s.vyaw) < 1e-5 && Math.abs(s.vpitch) < 1e-5) {
      s.vyaw = s.vpitch = 0;
      return;
    }

    s.vUp.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    s.vRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();

    s.qYaw.setFromAxisAngle(s.vUp,    s.vyaw   * dt);
    s.qPitch.setFromAxisAngle(s.vRight, s.vpitch * dt);
    qWorldRef.current.premultiply(s.qYaw).premultiply(s.qPitch).normalize();
  });

  return null;
}
