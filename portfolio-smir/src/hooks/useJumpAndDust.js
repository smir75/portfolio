// src/hooks/useJumpAndDust.js
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { JUMP_V, GRAV, ALT_DAMP } from "@/constants/space";
import { clamp } from "@/utils/math3d";

/**
 * Gère l'altitude (saut) et les bursts de poussière au contact du sol.
 * API:
 *  - alt: hauteur actuelle
 *  - bursts: array pour le composant <Dust />
 *  - tick(jumpPressed:boolean, clock, dt:number): avance la simulation
 */
export default function useJumpAndDust(RADIUS, qWorldRef) {
  const [alt, setAlt] = useState(0);
  const [bursts, setBursts] = useState([]);
  const vAltRef = useRef(0);

  const tmp = useMemo(() => ({
    contact: new THREE.Vector3(),
    forward: new THREE.Vector3(0,0,1),
  }), []);

  function tick(jumpPressed, clock, dt) {
    // déclenchement du saut si au sol
    if (jumpPressed && Math.abs(alt) < 0.001) vAltRef.current = JUMP_V;

    // intégration simple avec amortissement vertical
    vAltRef.current = (vAltRef.current - GRAV * dt) * Math.exp(-ALT_DAMP * dt);
    let next = alt + vAltRef.current * dt;

    // collision sol
    if (next < 0) {
      if (alt > 0.02 && qWorldRef?.current) {
        const contact = tmp.contact.set(0, 0, RADIUS).applyQuaternion(qWorldRef.current);
        const id = clock.getElapsedTime() + Math.random();
        const t0 = clock.getElapsedTime();
        setBursts((b) => [...b.slice(-6), { id, pos: contact.clone(), t0 }]);
      }
      next = 0;
      vAltRef.current = 0;
    }

    setAlt(next);
  }

  return { alt, bursts, tick };
}
