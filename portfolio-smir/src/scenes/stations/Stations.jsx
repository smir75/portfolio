// src/scenes/stations/Stations.jsx
import React, { useMemo } from "react";
import buildStations from "@/scenes/stations/buildStations";
import StationDish from "@/scenes/stations/StationDish";
import StationDome from "@/scenes/stations/StationDome";
import StationRingHab from "@/scenes/stations/StationRingHab";
import StationTower from "@/scenes/stations/StationTower";
import RotatingRing from "@/scenes/stations/RotatingRing";

export default function Stations({
  RADIUS,
  qWorldRef,
  spinYRef,
  onFocus,
  highContrast,
  stations,             // ✅ nouvelle prop optionnelle
}) {
  // ✅ si on reçoit stations, on les utilise; sinon fallback (compat)
  const STATIONS = useMemo(
    () => stations ?? buildStations(RADIUS),
    [stations, RADIUS]
  );

  return (
    <group>
      {STATIONS.map((s) => {
        const common = { s, qWorldRef, spinYRef, onFocus, highContrast };
        switch (s.type) {
          case "dish":   return <StationDish key={s.id} {...common} />;
          case "dome":   return <StationDome key={s.id} {...common} />;
          case "ring":   return <StationRingHab key={s.id} {...common} />;
          case "tower":  return <StationTower key={s.id} {...common} />;
          case "rotor":  return <RotatingRing key={s.id} {...common} />;
          default:       return <StationDish key={s.id} {...common} />;
        }
      })}
    </group>
  );
}
