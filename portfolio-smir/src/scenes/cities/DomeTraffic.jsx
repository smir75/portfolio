// src/scenes/cities/DomeTraffic.jsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { orientQuatFromUp } from "@/utils/math3d";

function makeLCG(seed = 0x1a2b3c4d) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return (s & 0xffffffff) / 0x100000000;
  };
}

function Rover({ scale = 0.08, color = "#9aa4b2" }) {
  return (
    <group scale={scale}>
      {/* corps */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.6, 0.4, 1]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.25} />
      </mesh>
      {/* mât/caméra */}
      <mesh position={[0.25, 0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 10]} />
        <meshStandardMaterial color="#737b88" roughness={0.6} />
      </mesh>
      <mesh position={[0.25, 0.8, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#1de5ff" emissive="#1de5ff" emissiveIntensity={0.4} />
      </mesh>
      {/* roues */}
      {[-0.6, 0.6].map((x) =>
        [-0.45, 0.45].map((z, i) => (
          <mesh key={`${x}-${z}-${i}`} position={[x, 0.25, z]} rotation={[0, 0, Math.PI * 0.5]}>
            <torusGeometry args={[0.22, 0.08, 10, 24]} />
            <meshStandardMaterial color="#1f232a" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
}

/**
 * Rovers qui tournent autour de chaque dôme (basés sur anchors = dirs unitaires).
 */
export default function DomeTraffic({
  RADIUS,
  anchors = [],
  perSite = 3,
  reduceMotion = false,
}) {
  const groupRef = useRef();

  const vehicles = useMemo(() => {
    const out = [];
    const rnd = makeLCG((0xD0CE ^ Math.floor(RADIUS * 997)) >>> 0); // seed valide
    anchors.forEach((dir) => {
      const d = dir.clone().normalize();
      const q = orientQuatFromUp(d); // Y+=up (normale), Z+=avant local
      for (let k = 0; k < perSite; k++) {
        const ringR = 0.55 + 0.25 * rnd();
        const height = 0.018 + 0.02 * rnd();
        const w = (0.35 + 0.4 * rnd()) * (reduceMotion ? 0.6 : 1.0);
        const phase = rnd() * Math.PI * 2;
        const bobAmp = 0.01 + 0.01 * rnd();
        const scale = 0.08 * (0.9 + 0.25 * rnd());
        out.push({ dir: d, q, ringR, height, w, phase, bobAmp, scale });
      }
    });
    return out;
  }, [anchors, perSite, RADIUS, reduceMotion]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const nodes = groupRef.current.children;

    for (let i = 0; i < Math.min(nodes.length, vehicles.length); i++) {
      const v = vehicles[i];
      const node = nodes[i];
      const a = v.phase + v.w * t;

      // position locale sur l’anneau
      const local = new THREE.Vector3(Math.cos(a) * v.ringR, 0, Math.sin(a) * v.ringR);
      const localFwd = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)); // dérivée du cercle

      // up = normale ; petit bob
      const bob = v.bobAmp * Math.sin(2.2 * a);
      const up = v.dir.clone();
      const offset = local.applyQuaternion(v.q);
      const world = v.dir.clone().multiplyScalar(RADIUS + v.height + bob).add(offset);

      node.position.copy(world);

      // orientation : up=normale, forward=marche
      const fwd = localFwd.applyQuaternion(v.q).normalize();
      const right = new THREE.Vector3().crossVectors(up, fwd).normalize();
      fwd.crossVectors(right, up).normalize();
      const m = new THREE.Matrix4().makeBasis(right, up, fwd);
      node.quaternion.setFromRotationMatrix(m);
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      {vehicles.map((v, i) => (
        <group key={i} frustumCulled={false}>
          <Rover scale={v.scale} />
        </group>
      ))}
    </group>
  );
}
