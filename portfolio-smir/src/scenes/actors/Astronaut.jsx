import React from "react";
import Thruster from "./Thruster";

export default function Astronaut({ RADIUS, alt, leanX = 0, leanY = 0, thrusterPower = 0 }) {
  return (
    <group position={[0, 0, RADIUS + alt]} rotation={[leanX, Math.PI, leanY]}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 24]} /><meshBasicMaterial color="black" transparent opacity={0.25} /></mesh>
      <group>
        <mesh position={[0, 0.30 + alt * 0.15, 0]}><sphereGeometry args={[0.12, 24, 24]} /><meshStandardMaterial color="#dbeafe" roughness={0.6} metalness={0.1} /></mesh>
        <mesh position={[0, 0.30 + alt * 0.15, -0.11]}><sphereGeometry args={[0.09, 24, 24, Math.PI, Math.PI]} /><meshStandardMaterial color="#172554" roughness={0.3} metalness={0.3} /></mesh>
        <mesh position={[0, 0.10, 0]}><cylinderGeometry args={[0.10, 0.10, 0.28, 16]} /><meshStandardMaterial color="#94a3b8" roughness={0.85} /></mesh>
        <group position={[0, 0.12, 0.12]}><boxGeometry args={[0.16, 0.22, 0.1]} /><meshStandardMaterial color="#5b6678" roughness={0.7} /></group>
        <Thruster power={thrusterPower} />
      </group>
    </group>
  );
}
