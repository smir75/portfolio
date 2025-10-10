// src/scenes/core/NearWorld.jsx
import React from "react";

import Moon from "@/scenes/terrain/Moon";
import Rocks from "@/scenes/terrain/Rocks";
import SurfaceParticles from "@/scenes/terrain/SurfaceParticles";

import Stations from "@/scenes/stations/Stations";
import Rivers from "@/scenes/cities/Rivers";
import Settlements from "@/scenes/cities/Settlements";
import DomeTraffic from "@/scenes/cities/DomeTraffic";
import DroneSwarm from "@/scenes/cities/DroneSwarm";
import LunarBases from "@/scenes/cities/LunarBases";
import Runways from "@/scenes/cities/Runways";
import Mines from "@/scenes/terrain/Mines";
import Walkers from "@/scenes/actors/Walkers";
import Dust from "@/scenes/actors/Dust";

/**
 * Grouille tout ce qui est “proche” (la lune et les éléments dessus).
 * - pas de logique ici : uniquement du JSX + props claires
 */
export default function NearWorld({
  RADIUS,
  quality,
  reduceMotion,
  highContrast,
  onFocusStation,
  qWorldRef,
  spinYRef,
  settlementAnchors,
  onAnchors,
  counts,
  bursts,
}) {
  const { rockCount, surfCount } = counts;

  return (
    <group>
      <Moon RADIUS={RADIUS} highContrast={highContrast} />

      <Rocks RADIUS={RADIUS} count={rockCount} />
      <SurfaceParticles RADIUS={RADIUS} count={surfCount} reduceMotion={reduceMotion} />

      <Stations
        RADIUS={RADIUS}
        qWorldRef={qWorldRef}
        spinYRef={spinYRef}
        onFocus={onFocusStation}
        highContrast={highContrast}
      />

      <Rivers RADIUS={RADIUS} count={3} color="#8fa5b3" />

      <Settlements
        RADIUS={RADIUS}
        count={5}
        highContrast={highContrast}
        onAnchors={onAnchors}
      />

      <DomeTraffic
        RADIUS={RADIUS}
        anchors={settlementAnchors}
        perSite={quality === "low" ? 2 : 3}
        reduceMotion={reduceMotion}
      />
      <DroneSwarm
        RADIUS={RADIUS}
        anchors={settlementAnchors}
        perSite={quality === "low" ? 1 : 2}
        reduceMotion={reduceMotion}
      />

      <LunarBases RADIUS={RADIUS} count={quality === "low" ? 3 : 7} highContrast={highContrast} />
      <Runways    RADIUS={RADIUS} count={quality === "low" ? 2 : 4} highContrast={highContrast} />
      <Mines      RADIUS={RADIUS} count={quality === "low" ? 3 : 6} />

      <Walkers
        RADIUS={RADIUS}
        qWorldRef={qWorldRef}
        anchors={settlementAnchors}
        count={quality === "low" ? 8 : 16}
        speed={0.6}
        reduceMotion={reduceMotion}
      />

      <Dust bursts={bursts} />
    </group>
  );
}
