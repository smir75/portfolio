// src/scenes/cities/DroneSwarm.jsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { orientQuatFromUp } from "@/utils/math3d";

function makeLCG(seed = 0xBEEFABCD) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return (s & 0xffffffff) / 0x100000000;
  };
}

function Drone({ scale = 0.1, color = "#7cc6ff" }) {
  return (
    <group scale={scale}>
      {/* corps */}
      <mesh>
        <capsuleGeometry args={[0.18, 0.5, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* bras */}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.06]} />
          <meshStandardMaterial color="#aab3bf" roughness={0.6} />
        </mesh>
      ))}
      {/* rotors */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <torusGeometry args={[0.16, 0.03, 8, 24]} />
          <meshStandardMaterial color="#1f232a" roughness={0.8} />
        </mesh>
      ))}
      {/* phare */}
      <mesh position={[0, 0.1, 0.25]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export default function DroneSwarm({
  RADIUS,
  anchors = [],
  perSite = 2,
  reduceMotion = false,
}) {
  const groupRef = useRef();

  const drones = useMemo(() => {
    const out = [];
    const rnd = makeLCG((0xD00E ^ Math.floor(RADIUS * 991)) >>> 0); // seed valide
    anchors.forEach((dir) => {
      const d = dir.clone().normalize();
      const q = orientQuatFromUp(d); // Y+=up
      // même offset que le pad (à l’est local ~ +X)
      const padLocal = new THREE.Vector3(0.95, 0, 0);
      for (let k = 0; k < perSite; k++) {
        const phase = rnd() * 10;
        const cruiseR = 0.9 + 0.4 * rnd();
        const hMax = 0.7 + 0.6 * rnd();
        const speed = (reduceMotion ? 0.6 : 1.0) * (0.6 + 0.6 * rnd());
        const color = ["#7cc6ff", "#ff7ab6", "#9cff8a", "#7df9ff"][Math.floor(rnd() * 4)];
        out.push({ dir: d, q, padLocal: padLocal.clone(), phase, cruiseR, hMax, speed, color });
      }
    });
    return out;
  }, [anchors, perSite, RADIUS, reduceMotion]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const nodes = groupRef.current.children;

    for (let i = 0; i < Math.min(nodes.length, drones.length); i++) {
      const d = drones[i];
      const node = nodes[i];

      // Cycle : idle(0.8s) → takeoff(2s) → cruise(6s) → land(2s)
      const T_idle = 0.8, T_up = 2.0, T_cruise = 6.0, T_down = 2.0;
      const T = T_idle + T_up + T_cruise + T_down;
      const tt = ((t * d.speed) + d.phase) % T;

      const up = d.dir;                          // normale
      const base = up.clone().multiplyScalar(RADIUS); // pied du site
      const q = d.q;

      let localXZ = new THREE.Vector3(0, 0, 0);
      let y = 0;

      if (tt < T_idle) {
        // posé sur le pad
        localXZ.copy(d.padLocal);
        y = 0.0;
      } else if (tt < T_idle + T_up) {
        // décollage
        const k = (tt - T_idle) / T_up; // 0..1
        const ease = 1 - Math.pow(1 - k, 3);
        localXZ.copy(d.padLocal);
        y = ease * d.hMax;
      } else if (tt < T_idle + T_up + T_cruise) {
        // croisière autour du dôme
        const k = (tt - T_idle - T_up) / T_cruise; // 0..1
        const ang = k * Math.PI * 2 + d.phase;
        localXZ.set(Math.cos(ang) * d.cruiseR, 0, Math.sin(ang) * d.cruiseR);
        y = d.hMax * (0.9 + 0.1 * Math.sin(ang * 2.0));
      } else {
        // atterrissage
        const k = (tt - (T_idle + T_up + T_cruise)) / T_down; // 0..1
        const ease = 1 - Math.pow(k, 3);
        localXZ.copy(d.padLocal).multiplyScalar(ease);
        y = d.hMax * (1 - k);
      }

      // passer en monde : base (au sol) + (localXZ, y) dans le repère du site
      const off = new THREE.Vector3(localXZ.x, y, localXZ.z).applyQuaternion(q);
      const world = base.add(off);
      node.position.copy(world);

      // orientation : suivre la direction horizontale
      const aheadXZ = localXZ.clone().add(new THREE.Vector3(0.001, 0, 0));
      let fwdLocal = aheadXZ.sub(localXZ);
      if (fwdLocal.lengthSq() < 1e-6) fwdLocal = new THREE.Vector3(0, 0, 1);
      const fwd = fwdLocal.applyQuaternion(q).normalize();
      const right = new THREE.Vector3().crossVectors(up, fwd).normalize();
      fwd.crossVectors(right, up).normalize();
      const m = new THREE.Matrix4().makeBasis(right, up, fwd);
      node.quaternion.setFromRotationMatrix(m);
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      {drones.map((d, i) => (
        <group key={i} frustumCulled={false}>
          <Drone scale={0.12} color={d.color} />
        </group>
      ))}
    </group>
  );
}
