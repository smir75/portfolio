import { useRef } from "react";
import * as THREE from "three";
import { angleBetween, lerp } from "@/utils/math3d";
import { HOLO_ON, HOLO_START } from "@/constants/space";
import { useFrame } from "@react-three/fiber";

/**
 * k ∈ [0..1] selon l'angle entre la station (avec spin) et l'axe caméra (z+).
 * - null-safe (si qWorldRef pas encore prêt, on ne crash pas)
 * - suit le spin (spinYRef)
 */
export default function useFacingIntensity(posLocal, qWorldRef, spinYRef) {
  const kSmooth = useRef(0);

  useFrame(() => {
    const qWorld = qWorldRef?.current;
    if (!qWorld) return;

    const qSpin = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      spinYRef?.current || 0
    );

    // direction monde de la station (préspin -> spin -> monde)
    const dirWorld = posLocal.clone().normalize().applyQuaternion(qSpin).applyQuaternion(qWorld);

    const ang = angleBetween(new THREE.Vector3(0, 0, 1), dirWorld);

    // fenêtre de visibilité
    let k = 0;
    if (Number.isFinite(ang)) {
      if (ang <= HOLO_ON) k = 1;
      else if (ang <= HOLO_START) k = 1 - (ang - HOLO_ON) / (HOLO_START - HOLO_ON);
    }

    const target = k;
    const rate = target > kSmooth.current ? 0.28 : 0.14;
    kSmooth.current = lerp(kSmooth.current, target, rate);
  });

  return kSmooth;
}
