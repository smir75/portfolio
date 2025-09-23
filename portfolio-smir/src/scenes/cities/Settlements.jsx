import React, { useMemo } from "react";
import * as THREE from "three";

import { makePos } from "@/utils/math3d";
import CityDome from "@/scenes/cities/CityDome";

export default function Settlements({ RADIUS, count = 5 }) {
  const seeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // plutôt latitudes moyennes
      const lat = THREE.MathUtils.radToDeg((Math.random() - 0.5) * 0.8);
      const lon = Math.random() * 360;
      arr.push(makePos(RADIUS, lat, lon));
    }
    return arr;
  }, [RADIUS, count]);

  const colors = ["#7cc6ff", "#ff7ab6", "#9cff8a", "#7df9ff"];

  return (
    <group>
      {seeds.map((p, i) => (
        <CityDome key={i} pos={p} color={colors[i % colors.length]} />
      ))}
    </group>
  );
}
