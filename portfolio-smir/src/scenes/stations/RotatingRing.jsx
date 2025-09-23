import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RotatingRing({ color = "#ffb86b" }) {
  const ref = useRef();
  useFrame((_, dt) => { ref.current && (ref.current.rotation.y += dt * 0.8); });
  return (
    <mesh ref={ref} position={[0, 0.33, 0]}>
      <torusGeometry args={[0.24, 0.02, 12, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} metalness={0.2} />
    </mesh>
  );
}
