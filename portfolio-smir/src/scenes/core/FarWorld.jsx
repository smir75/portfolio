// src/scenes/core/FarWorld.jsx
import React, { Suspense, lazy } from "react";

const AsteroidBelt = lazy(() => import("@/scenes/belt/AsteroidBelt"));
const Satellites   = lazy(() => import("@/scenes/orbit/Satellites"));
const Nebulae      = lazy(() => import("@/scenes/sky/Nebulae"));
const FlybyShips   = lazy(() => import("@/scenes/sky/FlybyShips"));

/**
 * Regroupe tous les éléments "lointains" (chargés après 1er RAF).
 * On garde les <Suspense/> ici pour que Scene reste ultra-légère.
 */
export default function FarWorld({ RADIUS, counts, reduceMotion, farReady }) {
  if (!farReady) return null;

  return (
    <>
      <Suspense fallback={null}>
        <AsteroidBelt
          RADIUS={RADIUS}
          count={Math.floor(counts.beltCount * 0.8)}
          reduceMotion={reduceMotion}
          tilt={0.45}
          centerOffset={0.0}
          inner={3.2}
          outer={4.8}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Satellites
          RADIUS={RADIUS}
          count={counts.satCount}
          reduceMotion={reduceMotion}
        />
      </Suspense>

      <Suspense fallback={null}>
        <Nebulae />
      </Suspense>

      <Suspense fallback={null}>
        <FlybyShips />
      </Suspense>
    </>
  );
}
