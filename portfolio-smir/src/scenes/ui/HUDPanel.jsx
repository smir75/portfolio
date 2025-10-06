// src/scenes/ui/HUDPanel.jsx
import React, { useRef, useState } from "react";
import { Billboard, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import HUDText from "./HUDText";

export default function HUDPanel({
  type,
  color = "#7cc6ff",
  title,
  lines = [],
  kRef,
  onFocus: onFocusProp,   // simple click => focus
  onClick,                // compat
  stationId,              // needed for dblclick
  highContrast,
}) 
{
  const onFocus = onFocusProp ?? onClick;

  const plane = useRef();
  const scan  = useRef();
  const [hot, setHot] = useState(false);

  useFrame(({ clock }) => {
    const k = Math.max(0, Math.min(1, kRef?.current ?? 1));
    const t = clock.getElapsedTime();
    const pulse = 0.85 + 0.15 * Math.sin(t * 6.0);
    const opBase = highContrast ? 0.65 : 0.5;
    const op = opBase * k * pulse;

    if (plane.current?.material) plane.current.material.opacity = op;
    if (scan.current?.material) {
      scan.current.position.y = (type === "totem" ? 0.35 : 0.22) * Math.sin(t * 1.4);
      scan.current.material.opacity = (highContrast ? 0.3 : 0.22) * k;
    }
  });

  const stop = (e) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  const handleFocus = (e) => { stop(e); onFocus?.(stationId); };
  const handleOpen  = (e) => {
    stop(e);
    if (!stationId) return;
    window.dispatchEvent(new CustomEvent("saga-open-station", { detail: { id: stationId } }));
  };

  const commonProps = {
   onPointerOver: () => setHot(true),
   onPointerOut:  () => setHot(false),
   
   onClick: (e) => (e?.detail >= 2 ? handleOpen(e) : handleFocus(e)),
   onDoubleClick: handleOpen, 
 };
  useCursor(hot);

  if (type === "round") {
    return (
      <Billboard follow distanceFactor={8} {...commonProps}>
        <mesh ref={plane}>
          <planeGeometry args={[1.7, 0.7]} />
          <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
        </mesh>
        <mesh position={[0, 0, -0.001]}>
          <ringGeometry args={[0.8, 0.82, 64, 1, Math.PI, Math.PI]} />
          <meshBasicMaterial color={color} transparent opacity={highContrast ? 0.45 : 0.35} depthTest={false} depthWrite={false} />
        </mesh>
        <mesh ref={scan} position={[0, 0, 0.001]}>
          <planeGeometry args={[1.66, 0.06]} />
          <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
        </mesh>
        <HUDText title={title} lines={lines} />
      </Billboard>
    );
  }

  if (type === "totem") {
    return (
      <Billboard follow distanceFactor={8} {...commonProps}>
        <mesh ref={plane}>
          <planeGeometry args={[0.9, 1.3]} />
          <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
        </mesh>
        <mesh position={[0, 0, -0.001]}>
          <boxGeometry args={[0.92, 1.34, 0.01]} />
          <meshBasicMaterial color={color} transparent opacity={highContrast ? 0.24 : 0.16} depthTest={false} depthWrite={false} />
        </mesh>
        <mesh ref={scan} position={[0, 0, 0.001]}>
          <planeGeometry args={[0.88, 0.05]} />
          <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
        </mesh>
        <HUDText title={title} lines={lines} vertical />
      </Billboard>
    );
  }

  if (type === "hex") {
    return (
      <Billboard follow distanceFactor={8} {...commonProps}>
        <mesh ref={plane}>
          <circleGeometry args={[0.9, 6]} />
          <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
        </mesh>
        <mesh position={[0, 0, -0.001]}>
          <ringGeometry args={[0.78, 0.9, 6]} />
          <meshBasicMaterial color={color} transparent opacity={highContrast ? 0.36 : 0.28} depthTest={false} depthWrite={false} />
        </mesh>
        <HUDText title={title} lines={lines} />
      </Billboard>
    );
  }

  // default
  return (
    <Billboard follow distanceFactor={8} {...commonProps}>
      <mesh ref={plane}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshBasicMaterial transparent blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} color={color} />
      </mesh>
      <mesh position={[0, 0, -0.001]} rotation={[0, 0, Math.PI / 40]}>
        <boxGeometry args={[1.82, 0.82, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={highContrast ? 0.26 : 0.18} depthTest={false} depthWrite={false} />
      </mesh>
      <HUDText title={title} lines={lines} />
    </Billboard>
  );
}
