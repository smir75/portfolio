// src/scenes/core/Scene.jsx
import React, { useEffect, useMemo, useRef, useState, lazy, Suspense, useCallback } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import useInput from "@/hooks/useInput";
import useInputInertia from "@/hooks/useInputInertia";
import useJumpAndDust from "@/hooks/useJumpAndDust";
import useStationAiming from "@/hooks/useStationAiming";
import useStationEvents from "@/hooks/useStationEvents";

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
import { ROCK_COUNT, SURF_PARTICLES, BELT_PARTS, SAT_COUNT, ENTER_OPEN } from "@/constants/space";

// Helper: normalise un prop ref en { current: ... }
const asRef = (maybeRef) =>
  (maybeRef && typeof maybeRef === "object" && "current" in maybeRef)
    ? maybeRef
    : { current: null };

export default function Scene({
  RADIUS,
  navTarget,          // 🔹 vient de TopNav (MoonScene)
  onNavConsumed,      // 🔹 callback pour reset navTarget
  onOpenStation,      // 🔹 déclenché quand une station s'ouvre
  quality,
  reduceMotion,
  highContrast,
  worldQuatRef,
  zoomRef,
  focusedStationIdRef, // 🔹 ref externe (MoonScene) pour persister le focus
  uiBlocked = false,  
}) {
  useThree();
  const input = useInput();

  const worldQuatOutRef = asRef(worldQuatRef);
  const zoomOutRef      = asRef(zoomRef);

  const [farReady, setFarReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setFarReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Orientation monde (+Z local astronaute)
  const qWorldRef = useRef(new THREE.Quaternion());

  // Groupes & spin visuel
  const worldGroup = useRef();
  const spinGroup  = useRef();
  const spinSpeed  = 0.02;
  const spinYRef   = useRef(0);

  // Stations (repère local, avant spin)
  const STATIONS = useMemo(() => buildStations(RADIUS), [RADIUS]);

  // Contrôles inertiels + saut/poussière
  const { vxRef, vyRef, applyTo } = useInputInertia(input);
  const { alt, bursts, tick: tickJump } = useJumpAndDust(RADIUS, qWorldRef);

  // ⚙️ Aiming (dirSpin → +Z) + stationDirWorld pour l'ouverture
  const { aimToStation, stopAiming, stationDirWorld } = useStationAiming({
    STATIONS,
    qWorldRef,
    spinYRef,
    maxAlignSpeed: 0.8,
    alignEps: 0.0015,
  });

  // 🔹 Gestion des événements (HUD + TopNav)
  const { focusStation, armOpen } = useStationEvents({
    STATIONS,
    qWorldRef,
    stationDirWorld,
    aimToStation,
    stopAiming,
    onOpenStation,
    navTarget,        // 🔹 TopNav → auto-focus + auto-open
    onNavConsumed,    // 🔹 reset navTarget après consommation
    enterThresholdRad: ENTER_OPEN, // ~0.35 rad (~20°)
    focusedIdRef: focusedStationIdRef,
  });

  // Callback pour le HUD (simple clic = focus uniquement)
  const handleStationFocus = useCallback((id) => {
    focusStation(id);
  }, [focusStation]);

  // Expose qWorld
  useFrame(() => {
    if (worldQuatOutRef.current && qWorldRef.current) {
      worldQuatOutRef.current.copy(qWorldRef.current);
    }
  });

  // Boucle anim
  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1 / 60);

    // Spin visuel
    if (spinGroup.current) {
      spinGroup.current.rotation.y += spinSpeed * dt;
      spinYRef.current = spinGroup.current.rotation.y;
    }

    // Clavier inertiel : stop l'auto-aim si l'utilisateur agit
    if (applyTo(qWorldRef.current, dt)) {
      stopAiming();
    }

    // Appliquer qWorld
    if (worldGroup.current) {
      worldGroup.current.quaternion.copy(qWorldRef.current);
    }

    // Saut + poussière
    tickJump(input.jump, clock, dt);
  });

  // Visuels (thrusters/lean)
  const leanX = THREE.MathUtils.clamp(-vxRef.current * 0.15, -0.25, 0.25);
  const leanY = THREE.MathUtils.clamp( vyRef.current * 0.12, -0.22, 0.22);
  const thrusterPower = clamp(
    Math.abs(vxRef.current) + Math.abs(vyRef.current) + (alt > 0 ? 0.8 : 0),
    0, 1
  );

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
            <Moon RADIUS={RADIUS} highContrast={highContrast} />
            <Rocks RADIUS={RADIUS} count={rockCount} />
            <SurfaceParticles RADIUS={RADIUS} count={surfCount} reduceMotion={reduceMotion} />

            {/* 🔹 Stations : 1er clic = focus, double-clic géré par useStationEvents */}
            <Stations
              RADIUS={RADIUS}
              qWorldRef={qWorldRef}
              spinYRef={spinYRef}
              onFocus={handleStationFocus}
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

      <Astronaut
        RADIUS={RADIUS}
        alt={alt}
        leanX={leanX}
        leanY={leanY}
        thrusterPower={thrusterPower}
      />

      {/* Drag rotatif : désactivé automatiquement pendant l'auto-aim */}
      <PointerOrbit
        qWorldRef={qWorldRef}
        sensitivity={0.003}
        deadZone={3}
        enabled={!uiBlocked}
        
        inertia
        damping={4}
        invertPitch
      />
      <CameraRig RADIUS={RADIUS} zoomRef={zoomOutRef} controlsEnabled={!uiBlocked} />
    </>
  );
}