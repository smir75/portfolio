// src/scenes/core/Scene.jsx
import React, { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import SpaceDecor from "@/scenes/core/SpaceDecor";
import FailSafeLight from "@/scenes/core/FailSafeLight";
import SunMoonCycle from "@/scenes/sky/SunMoonCycle";

// ↓ ces 4 composants lourds passent en lazy
const AsteroidBelt = lazy(() => import("@/scenes/belt/AsteroidBelt"));
const Satellites   = lazy(() => import("@/scenes/orbit/Satellites"));
const Nebulae      = lazy(() => import("@/scenes/sky/Nebulae"));
const FlybyShips   = lazy(() => import("@/scenes/sky/FlybyShips"));

import Moon from "@/scenes/terrain/Moon";
import Rocks from "@/scenes/terrain/Rocks";
import SurfaceParticles from "@/scenes/terrain/SurfaceParticles";

import Stations from "@/scenes/stations/Stations";
import buildStations from "@/scenes/stations/buildStations";

import Dust from "@/scenes/actors/Dust";
import Astronaut from "@/scenes/actors/Astronaut";

import Rivers from "@/scenes/cities/Rivers";
import Settlements from "@/scenes/cities/Settlements";

import ClickAim from "@/scenes/nav/ClickAim";
import CameraRig from "@/scenes/nav/CameraRig";

import { clamp, angleBetween } from "@/utils/math3d";

import {
  ACCEL, DAMP, MAX_SPEED, STEER,
  JUMP_V, GRAV, ALT_DAMP,
  ROCK_COUNT, SURF_PARTICLES, BELT_PARTS, SAT_COUNT,
  ENTER_OPEN,
} from "@/constants/space";

export default function Scene({
  RADIUS,
  navTarget,
  onNavConsumed,
  onOpenStation,
  quality,
  reduceMotion,
  highContrast,
  worldQuatRef,
  zoomRef,
}) {
  const { camera } = useThree();
  // input clavier (local, pas de dépendance externe)
  const input = useSimpleInput();

  // pré-armement des éléments lointains (lazy) une frame après le 1er render
  const [farReady, setFarReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setFarReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // orientation et cible
  const qWorldRef = useRef(new THREE.Quaternion());
  const qTargetRef = useRef(null);

  // planet spin
  const worldGroup = useRef(); // suit qWorldRef
  const spinGroup  = useRef(); // tourne en continu
  const spinSpeed  = 0.02;
  const spinYRef   = useRef(0);  // exposé pour corriger le clic

  // états dynamiques
  const vy = useRef(0), vx = useRef(0);
  const [alt, setAlt] = useState(0);
  const vAlt = useRef(0);
  const sphereRef = useRef(); // mesh principal de la lune (raycast)
  const [bursts, setBursts] = useState([]);

  const STATIONS = useMemo(() => buildStations(RADIUS), [RADIUS]);

  // expose qWorld pour la mini-map / UI externe
  useFrame(() => {
    if (worldQuatRef?.current) worldQuatRef.current.copy(qWorldRef.current);
  });

  // -------- helpers d'aim ----------
  // convertit une direction *locale planète (pré-spin)* → monde
  const localToWorldDir = (vLocalUnit) => {
    const qSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spinYRef.current);
    return vLocalUnit.clone().applyQuaternion(qSpin).applyQuaternion(qWorldRef.current);
  };

  const aimToLocal = (dirLocalUnit) => {
    const dirWorld = localToWorldDir(dirLocalUnit);
    const zPlus = new THREE.Vector3(0, 0, 1);
    const delta = new THREE.Quaternion().setFromUnitVectors(dirWorld, zPlus);
    qTargetRef.current = delta.multiply(qWorldRef.current).normalize();
  };

  // mini-map envoie une direction locale *raw* (pré-spin déjà)
  const aimToLocalRaw = (dirLocalUnit) => {
    const zPlus = new THREE.Vector3(0, 0, 1);
    const dirWorld = dirLocalUnit.clone().applyQuaternion(qWorldRef.current);
    const delta = new THREE.Quaternion().setFromUnitVectors(dirWorld, zPlus);
    qTargetRef.current = delta.multiply(qWorldRef.current).normalize();
  };

  const aimToStation = (id) => {
    const s = STATIONS.find((x) => x.id === id);
    if (s) aimToLocal(s.pos.clone().normalize());
  };

  // nav par TopNav
  useEffect(() => {
    if (!navTarget) return;
    aimToStation(navTarget);
    onNavConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navTarget]);

  // bus d’événements : mini-map
  useEffect(() => {
    const onAimLocalRaw = (e) => {
      const { dir } = e.detail || {};
      if (!dir) return;
      aimToLocalRaw(new THREE.Vector3(dir[0], dir[1], dir[2]).normalize());
    };
    window.addEventListener("saga-aim-local-raw", onAimLocalRaw);
    return () => window.removeEventListener("saga-aim-local-raw", onAimLocalRaw);
  }, []);

  // boucle anim
  useFrame(({ clock }, dt) => {
    dt = Math.min(dt, 1 / 30);

    // spin auto (planète + stations + décors de surface)
    if (spinGroup.current) {
      spinGroup.current.rotation.y += spinSpeed * dt;
      spinYRef.current = spinGroup.current.rotation.y;
    }

    // slerp vers la cible (clic planète / mini-map / navbar)
    if (qTargetRef.current) {
      qWorldRef.current.slerp(qTargetRef.current, clamp(STEER * dt, 0, 0.22));
      const f = new THREE.Vector3(0, 0, 1).applyQuaternion(qWorldRef.current);
      const t = new THREE.Vector3(0, 0, 1).applyQuaternion(qTargetRef.current);
      if (angleBetween(f, t) < 0.01) {
        qWorldRef.current.copy(qTargetRef.current);
        qTargetRef.current = null;
      }
    }

    // contrôles
    let ay = 0, ax = 0;
    if (input.left)  ay += ACCEL;
    if (input.right) ay -= ACCEL;
    if (input.up)    ax += ACCEL;
    if (input.down)  ax -= ACCEL;

    vy.current = clamp(vy.current + ay * dt, -MAX_SPEED, MAX_SPEED) * Math.exp(-DAMP * dt);
    vx.current = clamp(vx.current + ax * dt, -MAX_SPEED, MAX_SPEED) * Math.exp(-DAMP * dt);

    const qYaw   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), vy.current * dt);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), vx.current * dt);
    qWorldRef.current.premultiply(qYaw).premultiply(qPitch).normalize();

    worldGroup.current?.quaternion.copy(qWorldRef.current);

    // saut / poussière
    if (input.jump && Math.abs(alt) < 0.001) vAlt.current = JUMP_V;
    vAlt.current = (vAlt.current - GRAV * dt) * Math.exp(-ALT_DAMP * dt);
    let next = alt + vAlt.current * dt;
    if (next < 0) {
      if (alt > 0.02) {
        const contact = new THREE.Vector3(0, 0, RADIUS).applyQuaternion(qWorldRef.current);
        setBursts((b) => [
          ...b.slice(-6),
          { id: clock.getElapsedTime() + Math.random(), pos: contact, t0: clock.getElapsedTime() },
        ]);
      }
      next = 0; vAlt.current = 0;
    }
    setAlt(next);
  });

  // Entrée = station face caméra (prend en compte le spin)
  // Entrée = station face caméra (prend en compte le spin) — version sécurisée
// Entrée = station face caméra (prend en compte le spin) — version sécurisée écran + angle
useEffect(() => {
  const onKey = (e) => {
    if (e.code !== "Enter") return;
    if (!camera) return;

    const zPlus = new THREE.Vector3(0, 0, 1);

    // Fenêtre de centrage plus indulgente (NDC)
    const NDC_WINDOW = 0.32; // 0.22 → 0.32 pour tolérance
    // Seuil angle (constants/space ENTER_OPEN ~ 0.20 rad) — on garde
    // + on autorise un peu plus si c’est ultra-centré
    const ANG_BASE = ENTER_OPEN;        // ~0.20
    const ANG_BONUS = 0.26;             // si ultra-centré (<= 0.12 NDC), on autorise jusqu’à ~15°

    let bestId = null;
    let bestScore = Infinity; // score combiné angle + centrage

    for (const s of STATIONS) {
      // direction monde de la station (pré-spin -> monde)
      const dirW = localToWorldDir(s.pos.clone().normalize()); // unit
      const ang = angleBetween(zPlus, dirW);
      if (!Number.isFinite(ang)) continue;

      // position monde approx (rayon réel ~ RADIUS + 0.06)
      const posW = dirW.clone().multiplyScalar(RADIUS + 0.06);
      const ndc = posW.clone().project(camera);

      // visible devant la caméra (dans le frustum)
      const inFrustum = ndc.z >= -1 && ndc.z <= 1;
      if (!inFrustum) continue;

      const cx = Math.abs(ndc.x);
      const cy = Math.abs(ndc.y);
      const centered = cx <= NDC_WINDOW && cy <= NDC_WINDOW;
      if (!centered) continue;

      // petite prime si ultra centré
      const ultraCentered = cx <= 0.12 && cy <= 0.12;
      const angOK = ang < (ultraCentered ? ANG_BONUS : ANG_BASE);
      if (!angOK) continue;

      // score = max(|x|,|y|) + petit poids sur l’angle
      const score = Math.max(cx, cy) + ang * 0.25;
      if (score < bestScore) {
        bestScore = score;
        bestId = s.id;
      }
    }

    if (!bestId) return;
    onOpenStation?.(bestId);
  };

  window.addEventListener("keydown", onKey, { passive: true });
  return () => window.removeEventListener("keydown", onKey);
}, [STATIONS, onOpenStation, RADIUS, camera]); // eslint-disable-line

  const leanX = THREE.MathUtils.clamp(-vx.current * 0.15, -0.25, 0.25);
  const leanY = THREE.MathUtils.clamp( vy.current * 0.12, -0.22, 0.22);
  const thrusterPower = clamp(Math.abs(vx.current) + Math.abs(vy.current) + (alt > 0 ? 0.8 : 0), 0, 1);

  const qLow = quality === "low";
  const rockCount = qLow ? Math.floor(ROCK_COUNT * 0.5) : ROCK_COUNT;
  const surfCount = qLow ? Math.floor(SURF_PARTICLES * 0.5) : SURF_PARTICLES;
  const beltCount = qLow ? Math.floor(BELT_PARTS * 0.6) : BELT_PARTS;
  const satCount  = qLow ? Math.max(2, Math.floor(SAT_COUNT * 0.6)) : SAT_COUNT;

  return (
    <>
      {/* décor global */}
      <SpaceDecor reduceMotion={reduceMotion} quality={quality} />
      <SunMoonCycle />
      <FailSafeLight />

      {/* planète + tout ce qui "colle" au sol (et tourne lentement) */}
      <group ref={worldGroup}>
        <group ref={spinGroup}>
          <group>
            <Moon RADIUS={RADIUS} ref={sphereRef} highContrast={highContrast} />
            <Rocks RADIUS={RADIUS} count={rockCount} />
            <SurfaceParticles RADIUS={RADIUS} count={surfCount} reduceMotion={reduceMotion} />
            <Stations RADIUS={RADIUS} qWorldRef={qWorldRef} onOpen={onOpenStation} highContrast={highContrast} />
            <Rivers RADIUS={RADIUS} count={3} color="#8fa5b3" />
            <Settlements RADIUS={RADIUS} count={5} />
            <Dust bursts={bursts} />
          </group>
        </group>
      </group>

      {/* entourage indépendant du spin planète - monté en lazy après 1 frame */}
      <Suspense fallback={null}>
        {farReady && (
          <AsteroidBelt
            RADIUS={RADIUS}
            count={Math.floor(beltCount * 0.8)}
            reduceMotion={reduceMotion}
            tilt={0.45}
            centerOffset={0.0}
            inner={3.2}
            outer={4.8}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {farReady && (
          <Satellites RADIUS={RADIUS} count={satCount} reduceMotion={reduceMotion} />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {farReady && <Nebulae />}
      </Suspense>

      <Suspense fallback={null}>
        {farReady && <FlybyShips />}
      </Suspense>

      {/* acteur indépendant */}
      <Astronaut
        RADIUS={RADIUS}
        alt={alt}
        leanX={leanX}
        leanY={leanY}
        thrusterPower={thrusterPower}
      />

      {/* Clic planète → onAimLocal (corrigé avec le spin) */}
      <ClickAim
        sphereRef={sphereRef}
        qWorldRef={qWorldRef}
        spinYRef={spinYRef}
        onAimLocal={aimToLocal}
      />

      <CameraRig RADIUS={RADIUS} zoomRef={zoomRef} />
    </>
  );
}

/* ---------------------------
   Mini hook de saisie clavier
   --------------------------- */
function useSimpleInput() {
  const [i, set] = useState({ up: false, down: false, left: false, right: false, jump: false });

  useEffect(() => {
    const down = (e) => {
      if (["ArrowUp", "KeyW"].includes(e.code))    set((s) => ({ ...s, up: true }));
      if (["ArrowDown", "KeyS"].includes(e.code))  set((s) => ({ ...s, down: true }));
      if (["ArrowLeft", "KeyA"].includes(e.code))  set((s) => ({ ...s, left: true }));
      if (["ArrowRight", "KeyD"].includes(e.code)) set((s) => ({ ...s, right: true }));
      if (e.code === "Space")                      set((s) => ({ ...s, jump: true }));
    };
    const up = (e) => {
      if (["ArrowUp", "KeyW"].includes(e.code))    set((s) => ({ ...s, up: false }));
      if (["ArrowDown", "KeyS"].includes(e.code))  set((s) => ({ ...s, down: false }));
      if (["ArrowLeft", "KeyA"].includes(e.code))  set((s) => ({ ...s, left: false }));
      if (["ArrowRight", "KeyD"].includes(e.code)) set((s) => ({ ...s, right: false }));
      if (e.code === "Space")                      set((s) => ({ ...s, jump: false }));
    };
    window.addEventListener("keydown", down, { passive: true });
    window.addEventListener("keyup", up, { passive: true });
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return i;
}
