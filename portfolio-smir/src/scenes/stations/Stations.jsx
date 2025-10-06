// src/scenes/stations/Stations.jsx
import React, { useMemo } from "react";
import StationDome from "./StationDome";
import StationTower from "./StationTower";
import StationDish from "./StationDish";
import StationRingHab from "./StationRingHab";
import buildStations from "./buildStations";

export default function Stations({ RADIUS, qWorldRef, spinYRef, onFocus, highContrast }) {
  const STATIONS = useMemo(() => buildStations(RADIUS), [RADIUS]);
  return (
    <group>
      {STATIONS.map((s) => (
        <React.Fragment key={s.id}>
          {s.type === "dome"  && (
            <StationDome    s={s} qWorldRef={qWorldRef} spinYRef={spinYRef} onFocus={onFocus} highContrast={highContrast} />
          )}
          {s.type === "tower" && (
            <StationTower   s={s} qWorldRef={qWorldRef} spinYRef={spinYRef} onFocus={onFocus} highContrast={highContrast} />
          )}
          {s.type === "dish"  && (
            <StationDish    s={s} qWorldRef={qWorldRef} spinYRef={spinYRef} onFocus={onFocus} highContrast={highContrast} />
          )}
          {s.type === "ring"  && (
            <StationRingHab s={s} qWorldRef={qWorldRef} spinYRef={spinYRef} onFocus={onFocus} highContrast={highContrast} />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}
