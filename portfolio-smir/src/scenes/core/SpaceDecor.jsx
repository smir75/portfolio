// src/scenes/core/SpaceDecor.jsx
import React, { useMemo } from "react";
import { Stars, Sparkles } from "@react-three/drei";

export default function SpaceDecor({ reduceMotion = false, quality = "auto" }) {
  // réglages selon qualité
  const qLow =
    quality === "low" ||
    (quality === "auto" && (typeof window !== "undefined" && window.devicePixelRatio <= 1));

  const starsCount = useMemo(() => (qLow || reduceMotion ? 2800 : 6000), [qLow, reduceMotion]);
  const sparklesCount = useMemo(() => (qLow || reduceMotion ? 28 : 60), [qLow, reduceMotion]);

  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <Stars radius={260} depth={120} count={starsCount} factor={2.0} fade speed={0.18} />
      <Sparkles
        count={sparklesCount}
        scale={[240, 120, 240]}
        size={2}
        speed={qLow || reduceMotion ? 0.25 : 0.35}
        color="#9ad8ff"
      />
    </>
  );
}
