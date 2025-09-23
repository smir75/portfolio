import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

export default function FailSafeLight() {
  const { camera } = useThree();
  const ref = useRef();
  useFrame(() => { ref.current && ref.current.position.copy(camera.position); });
  return <pointLight ref={ref} intensity={0.8} distance={300} color="#ffffff" />;
}
