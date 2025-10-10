// src/scenes/actors/Astronaut.jsx
import React, { useMemo } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";

/**
 * CONTRAT D'ORIENTATION (clé pour éviter tout mélange de repères) :
 * - Par défaut, l'avant local de l'astronaute est l'axe +Z.
 * - Le root ne fait que des petits "lean" (X/Z). PAS de rotation Y globale.
 * - La scène (qWorld) considère +Z comme la direction "sous l'astronaute" (cible à aligner).
 *
 * Si tu dois inverser l'asset (visuel), passe facing="minusZ" plutôt que de mettre Math.PI ici.
 */
export default function Astronaut({
  RADIUS,
  alt,
  leanX = 0,
  leanY = 0,
  thrusterPower = 0,
  facing = "plusZ",     // "plusZ" (recommandé) ou "minusZ"
  debugAxes = false,    // affiche un repère local pour debug
}) {
  // Rotation Y fixe en fonction de la convention choisie (pas de 180° caché ailleurs)
  const yawFacing = facing === "minusZ" ? Math.PI : 0;

  // Sécurité : on limite un peu les lean pour éviter des postures bizarres
  const clampedLeanX = THREE.MathUtils.clamp(leanX, -0.35, 0.35);
  const clampedLeanY = THREE.MathUtils.clamp(leanY, -0.30, 0.30);

  // Repère local pour debug (facultatif)
  const axes = useMemo(() => {
    if (!debugAxes) return null;
    const g = new THREE.Group();

    const mk = (dir, len = 0.25) => {
      const geom = new THREE.CylinderGeometry(0.004, 0.004, len, 6);
      const mat = new THREE.MeshBasicMaterial({ color: dir });
      const m = new THREE.Mesh(geom, mat);
      // oriente le cylindre le long de l’axe voulu
      if (dir === 0xff0000) m.rotation.z = Math.PI / 2;        // X rouge
      if (dir === 0x0000ff) m.rotation.x = Math.PI / 2;        // Z bleu
      m.position.y = len / 2;
      return m;
    };
    // X (rouge), Y (vert), Z (bleu)
    const x = mk(0xff0000);
    const y = mk(0x00ff00);
    const z = mk(0x0000ff);
    // On tourne X et Z pour que le cylindre pointe bien dans l’axe concerné
    x.rotation.z = Math.PI / 2;
    z.rotation.x = Math.PI / 2;

    g.add(x, y, z);
    return g;
  }, [debugAxes]);

  return (
    // IMPORTANT : pas de rotation Y "cachée", on contrôle via 'facing' uniquement
    <group position={[0, 0, RADIUS + alt]} rotation={[clampedLeanX, yawFacing, clampedLeanY]}>
      {/* Ombre/halo au sol */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 24]} />
        <meshBasicMaterial color="black" transparent opacity={0.25} />
      </mesh>

      {/* Repère debug (facultatif) */}
      {axes && <primitive object={axes} />}

      {/* Corps */}
      <group>
        {/* Casque */}
        <mesh position={[0, 0.30 + alt * 0.15, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Visière (léger “look” vers -Z pour le style visuel, sans changer le repère logique) */}
        <mesh position={[0, 0.30 + alt * 0.15, -0.11]}>
          {/* Hémisphère tournée vers -Z (strictement visuel) */}
          <sphereGeometry args={[0.09, 24, 24, Math.PI, Math.PI]} />
          <meshStandardMaterial color="#172554" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* Torse */}
        <mesh position={[0, 0.10, 0]}>
          <cylinderGeometry args={[0.10, 0.10, 0.28, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.85} />
        </mesh>

        {/* Backpack */}
        <group position={[0, 0.12, 0.12]}>
          <boxGeometry args={[0.16, 0.22, 0.1]} />
          <meshStandardMaterial color="#5b6678" roughness={0.7} />
        </group>

        {/* Propulseur */}
        <Thruster power={thrusterPower} />
      </group>
    </group>
  );
}
