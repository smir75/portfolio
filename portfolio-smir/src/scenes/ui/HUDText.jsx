import React from "react";
import { Text } from "@react-three/drei";

export default function HUDText({ title, lines = [], vertical = false }) {
  return (
    <>
      <Text position={[0, vertical ? 0.42 : 0.18, 0.002]} fontSize={vertical ? 0.13 : 0.14} color="#e8f6ff" anchorX="center" anchorY="middle">{title}</Text>
      {lines.map((ln, i) => (
        <Text key={i} position={[0, (vertical ? 0.22 : 0.06) - i * (vertical ? 0.18 : 0.12), 0.002]} fontSize={vertical ? 0.11 : 0.095} color="#d3efff" anchorX="center" anchorY="middle">
          {ln}
        </Text>
      ))}
      <Text position={[0, vertical ? -0.48 : -0.24, 0.002]} fontSize={0.08} color="#9ad8ff" anchorX="center" anchorY="middle">⏎ Entrée pour ouvrir</Text>
    </>
  );
}
