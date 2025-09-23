import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function Satellite({ r, speed = 0.10, inc = 0.25, phase = 0, reduceMotion }) {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (reduceMotion ? 0.05 : speed) + phase;
    const x = r * Math.cos(t), z = r * Math.sin(t), y = Math.sin(t * 2.0) * inc * r * 0.12;
    g.current?.position.set(x, y, z);
    g.current?.lookAt(0, 0, 0);
  });
  return (
    <group ref={g}>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#d9e2ec" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.6]}>
        <boxGeometry args={[1.2, 0.08, 0.02]} />
        <meshStandardMaterial color="#6aa5ff" emissive="#3b6ed8" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[1.2, 0.08, 0.02]} />
        <meshStandardMaterial color="#6aa5ff" emissive="#3b6ed8" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#cbd7e6" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Satellites({ RADIUS, count = 7, reduceMotion }) {
  const cfgs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        r: RADIUS + 4 + Math.random() * 5,
        speed: 0.07 + Math.random() * 0.06,
        inc: 0.18 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      })),
    [RADIUS, count]
  );
  return (
    <group>
      {cfgs.map((c, i) => (
        <Satellite key={i} r={c.r} speed={c.speed} inc={c.inc} phase={c.phase} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
}
