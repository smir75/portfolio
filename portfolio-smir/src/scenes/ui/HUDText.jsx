// src/scenes/ui/HUDText.jsx
import React from "react";
import { Text } from "@react-three/drei";

// Use TTF for Troika/Text (WOFF2 isn't supported)
const FONT_TITLE = "/fonts/Orbitron-SemiBold.ttf";
const FONT_BODY  = "/fonts/Inter-Regular.ttf";

export default function HUDText({ title, lines = [], vertical = false }) {
  const titleY = vertical ? 0.42 : 0.18;
  const lineStartY = vertical ? 0.22 : 0.06;
  const lineStep = vertical ? 0.18 : 0.12;
  const footerY = vertical ? -0.48 : -0.24;

  return (
    <>
      {/* Title */}
      <Text
        font={FONT_TITLE}
        position={[0, titleY, 0.002]}
        fontSize={vertical ? 0.13 : 0.14}
        anchorX="center"
        anchorY="middle"
        color="#e8f6ff"
        toneMapped={false}
      >
        {title}
      </Text>

      {/* Lines */}
      {lines.map((ln, i) => (
        <Text
          key={i}
          font={FONT_BODY}
          position={[0, lineStartY - i * lineStep, 0.002]}
          fontSize={vertical ? 0.11 : 0.095}
          anchorX="center"
          anchorY="middle"
          color="#d3efff"
          toneMapped={false}
        >
          {ln}
        </Text>
      ))}

      {/* Footer hint */}
      <Text
        font={FONT_BODY}
        position={[0, footerY, 0.002]}
        fontSize={0.08}
        anchorX="center"
        anchorY="middle"
        color="#9ad8ff"
        toneMapped={false}
      >
        ⏎ Entrée pour ouvrir
      </Text>
    </>
  );
}
