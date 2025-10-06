// src/scenes/core/Scene.jsx
import React, { useEffect, useMemo, useRef, useState, lazy, Suspense, useCallback } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import useInput from "@/hooks/useInput";
import SpaceDecor from "@/scenes/core/SpaceDecor";
import FailSafeLight from "@/scenes/core/FailSafeLight";
import SunMoonCycle from "@/scenes/sky/SunMoonCycle";

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
import PointerOrbit from "@/scenes/nav/PointerOrbit";
import CameraRig from "@/scenes/nav/CameraRig";

import { clamp } from "@/utils/math3d";
import {
  ACCEL, DAMP, MAX_SPEED,
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
  useThree();
  const input = useInput();

  const [farReady, setFarReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setFarReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Orientation "monde" (l’astronaute voit +Z sous lui)
  const qWorldRef  = useRef(new THREE.Quaternion());
  const qTargetRef = useRef(null);

  // Groupes & spin visuel de la planète
  const worldGroup = useRef();
  const spinGroup  = useRef();
  const spinSpeed  = 0.02;
  const spinYRef   = useRef(0);

  // Altitude & poussière
  const [alt, setAlt] = useState(0);
  const vAlt = useRef(0);
  const sphereRef = useRef();
  const [bursts, setBursts] = useState([]);

  // Vitesse rot clavier
  const vy = useRef(0), vx = useRef(0);

  // Stations locales (avant spin)
  const STATIONS = useMemo(() => buildStations(RADIUS), [RADIUS]);

  // Expose qWorld au parent
  useFrame(() => { worldQuatRef?.current?.copy(qWorldRef.current); });

  // Axes (+Z = “sous l’astronaute”, Y = axe de spin)
  const TARGET_AXIS = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const Y_AXIS      = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Direction d’une station dans le REPÈRE SPIN (locale + spin SEULEMENT)
  const stationDirSpin = useCallback((posLocal) => {
    const qSpin = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, spinYRef.current);
    return posLocal.clone().normalize().applyQuaternion(qSpin).normalize();
  }, [Y_AXIS]);

  // --- suivi dynamique : tant qu’on vise une station, on recalcule la cible à chaque frame (avec SPIN)
  const aimingStationIdRef = useRef(null);

  const aimToStation = useCallback((id) => {
    const st = STATIONS.find(x => x.id === id);
    if (!st) return;
    aimingStationIdRef.current = id;   // la cible sera recalculée dans useFrame
  }, [STATIONS]);

  const stopAiming = useCallback(() => {
    aimingStationIdRef.current = null;
    qTargetRef.current = null;
  }, []);

  // ----- Ouverture contrôlée (clic simple = focus, double = open) -----
  const pendingOpenRef   = useRef(null);
  const justOpenedRef    = useRef(false);
  const fallbackTimerRef = useRef(null);

  const armFallback = useCallback((id, delayMs = 900) => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      if (pendingOpenRef.current === id && !justOpenedRef.current) {
        pendingOpenRef.current = null;
        justOpenedRef.current  = true;
        onOpenStation?.(id);
        setTimeout(() => { justOpenedRef.current = false; }, 600);
      }
    }, delayMs);
  }, [onOpenStation]);

  // Clic HUD = focus only
  const focusStation = useCallback((id) => {
    if (justOpenedRef.current) return;
    if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
    pendingOpenRef.current = null;
    aimToStation(id);
  }, [aimToStation]);

  // TopNav = focus only
  useEffect(() => {
    if (!navTarget) return;
    aimToStation(navTarget);
    onNavConsumed?.();
  }, [navTarget, aimToStation, onNavConsumed]);

  // Double-clic HUD => open (+ fallback court)
  useEffect(() => {
    const onOpenEvt = (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      aimToStation(id);
      pendingOpenRef.current = id;
      armFallback(id, 900);
    };
    window.addEventListener("saga-open-station", onOpenEvt);
    return () => window.removeEventListener("saga-open-station", onOpenEvt);
  }, [aimToStation, armFallback]);

  // ---------- Boucle anim ----------
  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1/30);

    // Spin visuel
    if (spinGroup.current) {
      spinGroup.current.rotation.y += spinSpeed * dt;
      spinYRef.current = spinGroup.current.rotation.y;
    }

    // Suivi dynamique : cible = orientation qui amène +Z vers la dir SPIN de la station (indépendant de qWorld)
    if (aimingStationIdRef.current) {
      const st = STATIONS.find(s => s.id === aimingStationIdRef.current);
      if (!st) {
        aimingStationIdRef.current = null;
        qTargetRef.current = null;
      } else {
        const dirSpin = stationDirSpin(st.pos);
        qTargetRef.current = new THREE.Quaternion()
          .setFromUnitVectors(TARGET_AXIS, dirSpin)
          .normalize();
      }
    }

    // Slerp vers la cible (+Z -> dirSpin)
    if (qTargetRef.current) {
      qWorldRef.current.slerp(qTargetRef.current, clamp(1.5 * dt, 0, 0.22));

      const f = TARGET_AXIS.clone().applyQuaternion(qWorldRef.current).normalize();
      const t = TARGET_AXIS.clone().applyQuaternion(qTargetRef.current).normalize();

      // Aligné ? on fige et on stoppe le suivi
      if (f.dot(t) > 0.9999) {
        qWorldRef.current.copy(qTargetRef.current);
        qTargetRef.current = null;
        aimingStationIdRef.current = null;
      }
    }

    // Flèches (yaw/pitch inertiels). Si l’utilisateur agit, on annule le ciblage auto.
    let ay = 0, ax = 0;
    if (input.left)  ay += ACCEL;
    if (input.right) ay -= ACCEL;
    if (input.up)    ax += ACCEL;
    if (input.down)  ax -= ACCEL;
    if (ax !== 0 || ay !== 0) stopAiming();

    const DAMP_E = Math.exp(-DAMP * dt);
    vy.current = clamp(vy.current + ay * dt, -MAX_SPEED, MAX_SPEED) * DAMP_E;
    vx.current = clamp(vx.current + ax * dt, -MAX_SPEED, MAX_SPEED) * DAMP_E;

    const qYaw   = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, vy.current * dt);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), vx.current * dt);
    qWorldRef.current.premultiply(qYaw).premultiply(qPitch).normalize();

    worldGroup.current?.quaternion.copy(qWorldRef.current);

    // Saut + poussière
    if (input.jump && Math.abs(alt) < 0.001) vAlt.current = JUMP_V;
    vAlt.current = (vAlt.current - GRAV * dt) * Math.exp(-ALT_DAMP * dt);
    let next = alt + vAlt.current * dt;
    if (next < 0) {
      if (alt > 0.02) {
        const contact = new THREE.Vector3(0, 0, RADIUS).applyQuaternion(qWorldRef.current);
        setBursts((b) => [...b.slice(-6), { id: clock.getElapsedTime() + Math.random(), pos: contact, t0: clock.getElapsedTime() }]);
      }
      next = 0; vAlt.current = 0;
    }
    setAlt(next);

    // Auto-open si aligné — compare dans le repère SPIN (stable)
    if (pendingOpenRef.current && !justOpenedRef.current) {
      const st = STATIONS.find(s => s.id === pendingOpenRef.current);
      if (st) {
        const dirSpin = stationDirSpin(st.pos);
        if (dirSpin.dot(TARGET_AXIS) > Math.cos(ENTER_OPEN)) {
          const id = pendingOpenRef.current;
          pendingOpenRef.current = null;
          justOpenedRef.current  = true;
          onOpenStation?.(id);
          setTimeout(() => { justOpenedRef.current = false; }, 600);
        }
      } else {
        pendingOpenRef.current = null;
      }
    }
  });

  // Entrée = ouvrir si “dessus” (même logique SPIN)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Enter") return;
      let best = null, bestDot = -Infinity;
      for (const s of STATIONS) {
        const d = stationDirSpin(s.pos).dot(TARGET_AXIS);
        if (d > bestDot) { bestDot = d; best = s.id; }
      }
      if (best && bestDot > Math.cos(ENTER_OPEN)) onOpenStation?.(best);
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [STATIONS, onOpenStation, stationDirSpin, TARGET_AXIS]);

  // Visuels dépendants de la qualité
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
      <SpaceDecor reduceMotion={reduceMotion} quality={quality} />
      <SunMoonCycle />
      <FailSafeLight />

      <group ref={worldGroup}>
        <group ref={spinGroup}>
          <group>
            <Moon RADIUS={RADIUS} ref={sphereRef} highContrast={highContrast} />
            <Rocks RADIUS={RADIUS} count={rockCount} />
            <SurfaceParticles RADIUS={RADIUS} count={surfCount} reduceMotion={reduceMotion} />

            <Stations
              RADIUS={RADIUS}
              qWorldRef={qWorldRef}
              spinYRef={spinYRef}
              onFocus={focusStation}   // simple clic = centrage
              highContrast={highContrast}
            />

            <Rivers RADIUS={RADIUS} count={3} color="#8fa5b3" />
            <Settlements RADIUS={RADIUS} count={5} />
            <Dust bursts={bursts} />
          </group>
        </group>
      </group>

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
        {farReady && <Satellites RADIUS={RADIUS} count={satCount} reduceMotion={reduceMotion} />}
      </Suspense>

      <Suspense fallback={null}>
        {farReady && <Nebulae />}
      </Suspense>

      <Suspense fallback={null}>
        {farReady && <FlybyShips />}
      </Suspense>

      <Astronaut RADIUS={RADIUS} alt={alt} leanX={leanX} leanY={leanY} thrusterPower={thrusterPower} />

      {/* Drag rotatif (diagonales OK, inertie) */}
      <PointerOrbit qWorldRef={qWorldRef} sensitivity={0.003} deadZone={3} inertia damping={4} invertPitch />

      <CameraRig RADIUS={RADIUS} zoomRef={zoomRef} />
    </>
  );
}
