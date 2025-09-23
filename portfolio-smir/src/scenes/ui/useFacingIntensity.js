import { useRef } from "react";
import * as THREE from "three";
import { angleBetween, lerp } from "@/utils/math3d";
import { HOLO_ON, HOLO_START } from "@/constants/space";
import { useFrame } from "@react-three/fiber";

export default function useFacingIntensity(posLocal, qWorldRef) {
  const kSmooth = useRef(0);
  useFrame(() => {
    const dir = posLocal.clone().normalize().applyQuaternion(qWorldRef.current);
    const ang = angleBetween(new THREE.Vector3(0, 0, 1), dir);
    let k = 0;
    if (ang <= HOLO_ON) k = 1;
    else if (ang <= HOLO_START) k = 1 - (ang - HOLO_ON) / (HOLO_START - HOLO_ON);
    const target = k;
    const rate = target > kSmooth.current ? 0.28 : 0.14;
    kSmooth.current = lerp(kSmooth.current, target, rate);
  });
  return kSmooth;
}
