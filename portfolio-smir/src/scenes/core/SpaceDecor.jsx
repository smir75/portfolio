import React from "react";
import { Stars, Sparkles } from "@react-three/drei";

export default function SpaceDecor() {
  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <Stars radius={260} depth={120} count={6000} factor={2.2} fade speed={0.2} />
      <Sparkles count={60} scale={[240, 120, 240]} size={2} speed={0.35} color="#9ad8ff" />
    </>
  );
}
