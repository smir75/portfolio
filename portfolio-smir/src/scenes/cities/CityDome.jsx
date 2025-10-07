import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { orientQuatFromUp } from "@/utils/math3d";

/**
 * Dôme de ville, enrichi :
 * - Base + joint périphérique
 * - Dôme “verre” avec léger glow au pied
 * - Intérieur : parc, bâtiments variés, mini habitants
 * - Petit radar au sommet
 */
export default function CityDome({ pos, color = "#7cc6ff" }) {
  const dir = pos.clone().normalize();
  const q = orientQuatFromUp(dir);

  const walkers = useRef([]);
  const radarRef = useRef();

  // Bâtiments variés en couronne
  const buildings = useMemo(() => {
    const arr = [];
    const n = 10 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.25;
      const r = 0.18 + Math.random() * 0.24;
      const h = 0.09 + Math.random() * 0.28;
      const w = 0.06 + Math.random() * 0.06;
      const d = 0.06 + Math.random() * 0.06;
      arr.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, h, w, d, a });
    }
    return arr;
  }, []);

  // Habitants intérieurs
  const people = useMemo(
    () =>
      Array.from({ length: 7 + Math.floor(Math.random() * 4) }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.14 + Math.random() * 0.26,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  // Animations
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // promeneurs
    walkers.current.forEach((m, i) => {
      if (!m) return;
      const p = people[i];
      const a = p.a + t * 0.12 * p.speed;
      const y = 0.02 + Math.sin(t * 1.6 + p.phase) * 0.01;
      m.position.set(Math.cos(a) * p.r, y, Math.sin(a) * p.r);
      // orientation face à la tangente
      const tangent = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      const up = new THREE.Vector3(0, 1, 0);
      const mat = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), tangent, up);
      m.quaternion.setFromRotationMatrix(mat);
    });

    // radar
    if (radarRef.current) {
      radarRef.current.rotation.y = t * 1.2;
    }
  });

  // teinte
  const glassTint = new THREE.Color(color).convertSRGBToLinear();
  const emissiveDim = glassTint.clone().multiplyScalar(0.3);

  return (
    <group position={pos} quaternion={q}>
      {/* base */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.58, 0.64, 0.06, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.25} roughness={0.7} />
      </mesh>

      {/* joint lumineux au sol */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.63, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* dôme “verre” mi-transparent */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.64, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={glassTint}
          transmission={0.88}
          thickness={0.22}
          roughness={0.2}
          metalness={0.06}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* glow bas du dôme */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.6, 0.01, 12, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>

      {/* intérieur */}
      <group position={[0, 0.04, 0]}>
        {/* sol parc */}
        <mesh>
          <circleGeometry args={[0.52, 40]} />
          <meshStandardMaterial color="#12263b" roughness={0.85} />
        </mesh>

        {/* allées en croix */}
        {[
          [0, 0, 0, 0.46, 0.05],
          [0, 0, Math.PI / 2, 0.46, 0.05],
        ].map(([x, y, rz, len, wid], k) => (
          <mesh key={k} rotation={[0, 0, rz]} position={[x, 0.001, y]}>
            <boxGeometry args={[len, 0.002, wid]} />
            <meshStandardMaterial color="#20354d" roughness={0.7} />
          </mesh>
        ))}

        {/* bâtiments */}
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, b.h / 2, b.z]} rotation={[0, b.a, 0]}>
            <mesh>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial
                color="#2a3b57"
                roughness={0.62}
                metalness={0.08}
                emissive={emissiveDim}
                emissiveIntensity={0.18 + Math.random() * 0.12}
              />
            </mesh>
            {/* toits/antennes */}
            <mesh position={[0, b.h / 2 + 0.02, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />
              <meshStandardMaterial color="#5b6a84" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* habitants (petites capsules lumineuses) */}
        {people.map((_, i) => (
          <group key={i} ref={(el) => (walkers.current[i] = el)} position={[0, 0.02, 0]}>
            <mesh>
              <capsuleGeometry args={[0.012, 0.026, 6, 10]} />
              <meshStandardMaterial color="#e6f2ff" emissive="#6aa5ff" emissiveIntensity={0.35} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* petit radar au sommet */}
      <group position={[0, 0.44, 0]} ref={radarRef}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />
          <meshStandardMaterial color="#3b4b65" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.12, 0.01, 0.06]} />
          <meshStandardMaterial color="#4c6387" roughness={0.6} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
