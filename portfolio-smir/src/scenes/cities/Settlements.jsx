import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import { makePos, orientQuatFromUp } from "@/utils/math3d";
import CityDome from "@/scenes/cities/CityDome";

/**
 * Colonies lunaires plus “vivantes” :
 * - Génère des dômes (CityDome)
 * - Ajoute pads d’atterrissage, panneaux solaires, balises lumineuses
 * - Expose les ANCHORS (directions locales normalisées) via onAnchors
 *
 * Props:
 *  - RADIUS: rayon de la lune
 *  - count: nombre de colonies
 *  - onAnchors?: (dirs: THREE.Vector3[]) => void  // directions locales unitaires
 *  - highContrast?: boolean
 */
export default function Settlements({ RADIUS, count = 5, onAnchors, highContrast }) {
  // Couleurs de dôme
  const colors = ["#7cc6ff", "#ff7ab6", "#9cff8a", "#7df9ff", "#ffe07a"];

  // Positions “mid-latitudes” + data utiles (dir unitaire, pos monde, quat d’orientation locale)
  const colonies = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // latitudes moyennes -> [-0.7, +0.7] rad environ
      const lat = (Math.random() - 0.5) * 0.8; // en rad
      const lon = Math.random() * Math.PI * 2;

      const p = makePos(RADIUS, THREE.MathUtils.radToDeg(lat), THREE.MathUtils.radToDeg(lon)); // Vector3 monde
      const dir = p.clone().normalize(); // direction locale
      const q = orientQuatFromUp(dir);   // oriente Z+ local vers “devant”, Y+ = normale locale

      arr.push({
        dir, pos: p, q,
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, [RADIUS, count]);

  // Expose anchors (directions locales unitaires) pour les Walkers/aliens
  useEffect(() => {
    if (typeof onAnchors === "function") {
      onAnchors(colonies.map(c => c.dir.clone()));
    }
  }, [colonies, onAnchors]);

  // Helpers de placement “dans le repère local” du site
  const localOffsetToWorld = (dir, q, offset = new THREE.Vector3(), rAdd = 0.0) => {
    // offset est exprimé dans l’espace local du site (tangent au sol)
    const worldOff = offset.clone().applyQuaternion(q);
    return dir.clone().multiplyScalar(RADIUS + rAdd).add(worldOff);
  };

  return (
    <group>
      {colonies.map((c, i) => (
        <group key={i}>
          {/* Dôme principal */}
          <CityDome pos={c.pos} color={c.color} />

          {/* Ornements autour du dôme */}
          <group quaternion={c.q}>
            {/* Landing pad — à l’est local */}
            <group position={localOffsetToWorld(c.dir, c.q, new THREE.Vector3(0.95, 0, 0), 0.002)}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.35, 40]} />
                <meshStandardMaterial
                  color={highContrast ? "#d1d5db" : "#93a3b3"}
                  roughness={0.85}
                  metalness={0.05}
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
                <ringGeometry args={[0.275, 0.34, 40]} />
                <meshBasicMaterial
                  color={c.color}
                  transparent
                  opacity={highContrast ? 0.45 : 0.3}
                  depthWrite={false}
                />
              </mesh>
              {/* H lumineux au centre */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
                <planeGeometry args={[0.16, 0.03]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0.08]}>
                <planeGeometry args={[0.03, 0.16]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -0.08]}>
                <planeGeometry args={[0.03, 0.16]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
            </group>

            {/* Panneaux solaires — à l’ouest local */}
            <group position={localOffsetToWorld(c.dir, c.q, new THREE.Vector3(-1.1, 0, 0), 0.002)}>
              {[-0.35, 0, 0.35].map((z, k) => (
                <group key={k} position={[0, 0, z]}>
                  <mesh position={[0, 0.04, 0]}>
                    <boxGeometry args={[0.02, 0.08, 0.26]} />
                    <meshStandardMaterial color="#444c5c" roughness={0.7} />
                  </mesh>
                  <mesh position={[0.18, 0.08, 0]} rotation={[THREE.MathUtils.degToRad(-12), 0, 0]}>
                    <boxGeometry args={[0.36, 0.01, 0.28]} />
                    <meshStandardMaterial color="#1f5a8a" roughness={0.35} metalness={0.25} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* Balises lumineuses — nord/sud locaux */}
            {[new THREE.Vector3(0, 0, 1.1), new THREE.Vector3(0, 0, -1.1)].map((off, k) => (
              <group key={k} position={localOffsetToWorld(c.dir, c.q, off, 0.002)}>
                <mesh>
                  <cylinderGeometry args={[0.015, 0.015, 0.08, 10]} />
                  <meshStandardMaterial color="#404a5a" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshStandardMaterial
                    color={c.color}
                    emissive={c.color}
                    emissiveIntensity={0.8}
                    roughness={0.4}
                    metalness={0.1}
                  />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}
