// src/scenes/controls/PlayerInput.jsx
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Contrôles joueur (clavier + clic planète) :
 * - ZQSD / WASD / Flèches = déplacement relatif caméra (plane Y=0)
 * - Espace = saut
 * - Entrée = entrer dans un module
 * - Clic planète = oriente + move-to vers le point cliqué
 *
 * Émet des CustomEvent:
 *  - "saga-move"     { detail: { dir:[x,y,z], running:boolean } }  (dir locale "pré-rotation monde")
 *  - "saga-jump"     {}
 *  - "saga-enter-module" {}
 *  - "saga-move-to"  { detail: { dir:[x,y,z] } } (locale)
 *  - "saga-aim-local-raw" { detail: { dir:[x,y,z] } }
 */
export default function PlayerInput({ RADIUS, worldQuatRef, targetQuatRef }) {
  const { camera } = useThree();

  // ---- clavier
  const keysRef = useRef(new Set());
  const shiftRef = useRef(false);

  useEffect(() => {
    const down = (e) => {
      const c = e.code;
      if (
        c === "ArrowUp" || c === "ArrowDown" || c === "ArrowLeft" || c === "ArrowRight" ||
        c === "Space"
      ) e.preventDefault(); // évite scroll
      if (c === "ShiftLeft" || c === "ShiftRight") shiftRef.current = true;
      keysRef.current.add(c);

      if (c === "Space") window.dispatchEvent(new CustomEvent("saga-jump"));
      if (c === "Enter") window.dispatchEvent(new CustomEvent("saga-enter-module"));
    };
    const up = (e) => {
      const c = e.code;
      if (c === "ShiftLeft" || c === "ShiftRight") shiftRef.current = false;
      keysRef.current.delete(c);
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up, { passive: true });
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ---- calculs réutilisés
  const tmp = useMemo(() => ({
    forward: new THREE.Vector3(),
    right: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    moveWorld: new THREE.Vector3(),
    invQ: new THREE.Quaternion(),
    moveLocal: new THREE.Vector3(),
    hitLocal: new THREE.Vector3(),
    rot: new THREE.Quaternion(),
    safeAxis: new THREE.Vector3(0,1,0),
  }), []);

  // ---- mouvement continu (par frame)
  useFrame(() => {
    const k = keysRef.current;
    if (!k.size) return;

    // mapping AZERTY & QWERTY & flèches
    const fwd = k.has("KeyZ") || k.has("KeyW") || k.has("ArrowUp");
    const back = k.has("KeyS") || k.has("ArrowDown");
    const left = k.has("KeyQ") || k.has("KeyA") || k.has("ArrowLeft");
    const right = k.has("KeyD") || k.has("ArrowRight");

    if (!(fwd || back || left || right)) return;

    // axes caméra
    camera.getWorldDirection(tmp.forward).setY(0).normalize(); // avant sol
    tmp.right.copy(tmp.forward).cross(tmp.up).normalize();

    tmp.moveWorld.set(0,0,0);
    if (fwd)  tmp.moveWorld.add(tmp.forward);
    if (back) tmp.moveWorld.sub(tmp.forward);
    if (right) tmp.moveWorld.add(tmp.right);
    if (left)  tmp.moveWorld.sub(tmp.right);

    if (tmp.moveWorld.lengthSq() === 0) return;
    tmp.moveWorld.normalize();

    // monde -> local "pré-rotation monde"
    tmp.invQ.copy(worldQuatRef.current).invert();
    tmp.moveLocal.copy(tmp.moveWorld).applyQuaternion(tmp.invQ).normalize();

    window.dispatchEvent(new CustomEvent("saga-move", {
      detail: {
        dir: [tmp.moveLocal.x, tmp.moveLocal.y, tmp.moveLocal.z],
        running: shiftRef.current
      }
    }));
  });

  // ---- clic planète : oriente + move-to
  const onClickPlanet = (e) => {
    // point monde -> local "pré-rotation monde"
    tmp.invQ.copy(worldQuatRef.current).invert();
    tmp.hitLocal.copy(e.point).normalize().applyQuaternion(tmp.invQ);
    if (!isFinite(tmp.hitLocal.x)) return;

    // event existant (viser)
    window.dispatchEvent(new CustomEvent("saga-aim-local-raw", {
      detail: { dir: [tmp.hitLocal.x, tmp.hitLocal.y, tmp.hitLocal.z] }
    }));
    // move-to (local)
    window.dispatchEvent(new CustomEvent("saga-move-to", {
      detail: { dir: [tmp.hitLocal.x, tmp.hitLocal.y, tmp.hitLocal.z] }
    }));

    // feedback visuel : slerp vers +Z local
    const anchor = new THREE.Vector3(0,0,1);
    const d = tmp.hitLocal.dot(anchor);
    if (d < -0.999999) {
      tmp.rot.setFromAxisAngle(tmp.safeAxis, Math.PI);
    } else {
      tmp.rot.setFromUnitVectors(tmp.hitLocal, anchor);
    }
    targetQuatRef.current.copy(tmp.rot).normalize();
  };

  // mesh capteur (légèrement > rayon planète)
  return (
    <mesh onClick={onClickPlanet} renderOrder={-9999}>
      <sphereGeometry args={[RADIUS + 0.01, 16, 12]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
    </mesh>
  );
}
