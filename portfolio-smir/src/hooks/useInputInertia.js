// src/hooks/useInputInertia.js
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp } from "@/utils/math3d";
import { ACCEL, DAMP, MAX_SPEED } from "@/constants/space";

/**
 * Gère l'inertie de rotation via les touches (ZQSD/WASD/Flèches).
 * - vxRef, vyRef : vitesses angulaires intégrées (rad/s)
 * - applyTo(q, dt) : applique le yaw/pitch sur le quaternion donné et renvoie `true` si l'utilisateur a agi sur cette frame
 */
export default function useInputInertia(input) {
  const vxRef = useRef(0); // pitch  (autour X local caméra-monde)
  const vyRef = useRef(0); // yaw    (autour Y monde)
  const actedRef = useRef(false);

  const tmp = useMemo(() => ({
    qYaw: new THREE.Quaternion(),
    qPitch: new THREE.Quaternion(),
    X_AXIS: new THREE.Vector3(1, 0, 0),
    Y_AXIS: new THREE.Vector3(0, 1, 0),
  }), []);

  function step(dt) {
    let ay = 0, ax = 0;
    if (input?.left)  ay += ACCEL;
    if (input?.right) ay -= ACCEL;
    if (input?.up)    ax += ACCEL;
    if (input?.down)  ax -= ACCEL;

    actedRef.current = (ax !== 0 || ay !== 0);

    const DAMP_E = Math.exp(-DAMP * dt);
    vyRef.current = clamp(vyRef.current + ay * dt, -MAX_SPEED, MAX_SPEED) * DAMP_E;
    vxRef.current = clamp(vxRef.current + ax * dt, -MAX_SPEED, MAX_SPEED) * DAMP_E;
  }

  function applyTo(q, dt) {
    if (!q) return false;
    // intègre
    step(dt);
    // applique
    const yaw = vyRef.current * dt;
    const pitch = vxRef.current * dt;

    if (Math.abs(yaw) > 1e-8)   tmp.qYaw.setFromAxisAngle(tmp.Y_AXIS, yaw);
    else                        tmp.qYaw.identity();

    if (Math.abs(pitch) > 1e-8) tmp.qPitch.setFromAxisAngle(tmp.X_AXIS, pitch);
    else                        tmp.qPitch.identity();

    q.premultiply(tmp.qYaw).premultiply(tmp.qPitch).normalize();
    return actedRef.current;
  }

  return { vxRef, vyRef, applyTo, step, actedRef };
}
