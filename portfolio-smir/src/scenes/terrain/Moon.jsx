import React, { forwardRef } from "react";
import * as THREE from "three";
import useLunarGeometry from "./useLunarGeometry";

const Moon = forwardRef(function Moon({ RADIUS, highContrast }, ref) {
  const geo = useLunarGeometry(RADIUS, 168);

  return (
    <group>
      <mesh ref={ref} castShadow receiveShadow geometry={geo}>
        <meshStandardMaterial
          vertexColors
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>
      {/* halo doux */}
      <mesh scale={1.04}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color={highContrast ? "#d6e6ff" : "#adc7e6"}
          side={THREE.BackSide}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

export default Moon;
