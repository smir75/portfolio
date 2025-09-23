import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * Clic sur la planète -> calcule une direction *locale pré-spin*,
 * puis appelle onAimLocal(dirLocalUnit).
 */
export default function ClickAim({ sphereRef, qWorldRef, spinYRef, onAimLocal }) {
  const { camera, gl } = useThree();
  const ray = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    const el = gl?.domElement;
    if (!el) return;

    const onClick = (e) => {
      if (!sphereRef.current) return;

      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      ray.setFromCamera({ x, y }, camera);
      const hit = ray.intersectObject(sphereRef.current, true)[0];
      if (!hit) return;

      // direction monde (depuis l'origine vers le point touché)
      const dirWorld = hit.point.clone().normalize();

      // reviens en *local planète pré-spin* : inv(world) puis inv(spin)
      const invWorld = (qWorldRef?.current || new THREE.Quaternion()).clone().invert();
      const invSpin = new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(0, 1, 0), spinYRef?.current || 0)
        .invert();

      const dirLocal = dirWorld.clone().applyQuaternion(invWorld).applyQuaternion(invSpin).normalize();

      onAimLocal?.(dirLocal);
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [camera, gl, ray, sphereRef, qWorldRef, spinYRef, onAimLocal]);

  return null;
}
