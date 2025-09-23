import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function SunMoonCycle() {
  const sunRef = useRef(), moonRef = useRef();
  const sunLight = useRef(), moonLight = useRef();

  const fade = (elev) => {
    const t = THREE.MathUtils.clamp((elev + 0.3) / 0.6, 0, 1);
    return t * t * (3 - 2 * t);
  };

  useFrame(() => {
    const now = Date.now(), dayMs = 86400000;
    const frac = (now % dayMs) / dayMs;
    const ang = frac * Math.PI * 2;

    const dirSun = new THREE.Vector3(Math.cos(ang), Math.sin(ang) * 0.6, Math.sin(ang));
    const dirMoon = dirSun.clone().multiplyScalar(-1);

    const R = 280;
    const sunPos = dirSun.clone().normalize().multiplyScalar(R);
    const moonPos = dirMoon.clone().normalize().multiplyScalar(R);

    const kSun = fade(dirSun.y), kMoon = fade(dirMoon.y);

    if (sunRef.current) sunRef.current.position.copy(sunPos);
    if (moonRef.current) moonRef.current.position.copy(moonPos);

    if (sunLight.current) {
      sunLight.current.position.copy(sunPos);
      sunLight.current.intensity = Math.max(0.2, 1.6 * kSun);
      sunLight.current.color.set("#ffdca8");
    }
    if (moonLight.current) {
      moonLight.current.position.copy(moonPos);
      moonLight.current.intensity = Math.max(0.1, 0.7 * kMoon);
      moonLight.current.color.set("#9bb8ff");
    }

    if (sunRef.current) {
      sunRef.current.children[0].material.opacity = 0.85 * kSun;
      sunRef.current.children[1].material.opacity = 0.25 * kSun;
    }
    if (moonRef.current) {
      moonRef.current.children[0].material.opacity = 0.85 * kMoon;
      moonRef.current.children[1].material.opacity = 0.18 * kMoon;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.6} groundColor={"#0b1220"} />
      <directionalLight ref={sunLight} castShadow />
      <directionalLight ref={moonLight} />

      <group ref={sunRef}>
        <mesh><sphereGeometry args={[8, 32, 32]} /><meshBasicMaterial color="#ffcc66" transparent /></mesh>
        <mesh scale={1.6}><sphereGeometry args={[8, 32, 32]} /><meshBasicMaterial color="#ffefcc" transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      </group>

      <group ref={moonRef}>
        <mesh><sphereGeometry args={[5, 32, 32]} /><meshBasicMaterial color="#e6edf7" transparent /></mesh>
        <mesh scale={1.4}><sphereGeometry args={[5, 32, 32]} /><meshBasicMaterial color="#bcd0ff" transparent blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      </group>
    </>
  );
}
